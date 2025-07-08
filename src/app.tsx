/* ================== src/app.tsx ======================== */
import React, { useCallback, useRef, useState } from "react";
import QRCode from "qrcode";
import Papa from "papaparse";
import {
  addPage,
  addElementAtPoint,
  openDesign,
} from "@canva/design";
import { upload } from "@canva/asset";
import { notification, requestOpenExternalUrl } from "@canva/platform";
import {
  Alert,
  Box,
  Button,
  FormField,
  Link,
  MultilineInput,
  NumberInput,
  Rows,
  Text,
  Title,
  Slider,
  Columns,
  Column,
} from "@canva/app-ui-kit";
import { FormattedMessage, useIntl } from "react-intl";
/* eslint-disable no-restricted-imports */
import bmcQr from "assets/images/bmc_qr.png";

interface QrSpec {
  text: string;
  dataUrl: string;
  uploadedRef?: string;
}

interface DetectedPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface FailedPage {
  index: number;
  qrSpec: QrSpec;
  error: string;
}

const DEFAULT_SIZE = { width: 300, height: 300 };

export function App() {
  const intl = useIntl();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawInput, setRawInput] = useState<string>("");
  const [codes, setCodes] = useState<QrSpec[]>([]);
  const [qrSize, setQrSize] = useState(DEFAULT_SIZE);
  const [busy, setBusy] = useState(false);
  const [firstQrPlaced, setFirstQrPlaced] = useState(false);
  const [detectedPosition, setDetectedPosition] = useState<DetectedPosition | null>(null);
  
  // Failed pages tracking for recovery
  const [failedPages, setFailedPages] = useState<FailedPage[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Donation banner state
  const [showDonationBanner, setShowDonationBanner] = useState(false);

  /* ------------ handle external links ------------------- */
  const openExternalUrl = useCallback(async (url: string) => {
    const response = await requestOpenExternalUrl({ url });
    if (response.status === "aborted") {
      // User decided not to navigate to the link
    }
  }, []);

  /* ------------ acquire data (textarea or CSV) ---------- */
  const parseCsvFile = (file: File) => {
    Papa.parse<string>(file, {
      skipEmptyLines: true,
      complete: (result) => {
        const items = result.data.map((row) => row[0]);
        setRawInput(items.join("\n"));
        notification.addToast({
          messageText: intl.formatMessage({
            defaultMessage: "CSV file loaded successfully",
            description: "Toast when CSV is successfully parsed",
          }),
        });
      },
      error: () => {
        notification.addToast({
          messageText: intl.formatMessage({
            defaultMessage: "Error reading CSV file",
            description: "Toast when CSV parsing fails",
          }),
        });
      }
    });
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseCsvFile(file);
    }
  };

  /* ------------ generate QR images ---------------------- */
  const generateQrCodes = useCallback(async () => {
    setBusy(true);
    setFirstQrPlaced(false);
    setDetectedPosition(null);
    
    try {
      const lines = rawInput
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const out: QrSpec[] = [];
      for (const text of lines) {
        const dataUrl = await QRCode.toDataURL(text, {
          margin: 0,
          errorCorrectionLevel: "H",
        });
        out.push({ text, dataUrl });
      }
      setCodes(out);
      notification.addToast({
        messageText: intl.formatMessage(
          {
            defaultMessage: "{n} QR codes generated successfully",
            description: "Toast after generating n QR codes",
          },
          { n: out.length },
        ),
      });
    } catch {
      notification.addToast({
        messageText: intl.formatMessage({
          defaultMessage: "Error while generating QR codes",
          description: "Toast on QR generation error",
        }),
      });
    } finally {
      setBusy(false);
    }
  }, [rawInput, intl]);

  /* ------------ add first QR to current page ------------ */
  const addFirstQrToPage = useCallback(async () => {
    if (codes.length === 0) {
      notification.addToast({
        messageText: intl.formatMessage({
          defaultMessage: "Generate QR codes first",
          description: "Toast when no QR codes to place",
        }),
      });
      return;
    }

    setBusy(true);
    try {
      const firstQr = codes[0];
      
      // Upload the QR code image to Canva
      const uploadResult = await upload({
        type: "image",
        mimeType: "image/png", 
        url: firstQr.dataUrl,
        thumbnailUrl: firstQr.dataUrl,
        width: qrSize.width,
        height: qrSize.height,
        aiDisclosure: "none",
      });

      // Store the uploaded reference
      const updatedCodes = [...codes];
      updatedCodes[0] = { ...firstQr, uploadedRef: uploadResult.ref };
      setCodes(updatedCodes);

      // Add to current page at default position
      await addElementAtPoint({
        type: "image",
        ref: uploadResult.ref,
        top: 100, // Default initial position
        left: 100, // Default initial position
        width: qrSize.width,
        height: qrSize.height,
        altText: {
          text: `QR Code: ${firstQr.text}`,
          decorative: false,
        },
      });

      setFirstQrPlaced(true);
      
      notification.addToast({
        messageText: intl.formatMessage({
          defaultMessage: "First QR code added to page. Position it as desired, then create the remaining pages.",
          description: "Toast after first QR is placed",
        }),
      });
    } catch {
      notification.addToast({
        messageText: intl.formatMessage({
          defaultMessage: "Error adding QR code to page",
          description: "Toast on QR placement error",
        }),
      });
    } finally {
      setBusy(false);
    }
  }, [codes, qrSize, intl]);

  /* ------------ detect position and create pages -------- */
  const detectPositionAndCreatePages = useCallback(async () => {
    if (codes.length === 0 || !firstQrPlaced) {
      notification.addToast({
        messageText: intl.formatMessage({
          defaultMessage: "Place the first QR code on the page first",
          description: "Toast when trying to create pages before placing first QR",
        }),
      });
      return;
    }

    setBusy(true);
    
    const remainingPages = codes.length - 1; // Exclude first page
    const totalProgress = remainingPages;
    let currentProgress = 0;
    
    // Show initial toast notification
    notification.addToast({
      messageText: intl.formatMessage({
        defaultMessage: "🔄 Starting QR page generation... Do not modify the design during this process.",
        description: "Initial toast for page generation start",
      }),
    });
    
    try {
      let foundPosition: DetectedPosition | null = null;

      // Find the position of our QR code and get all page elements for duplication
      let pageTemplate: any[] = [];
      
      await openDesign({ type: "current_page" }, async (session) => {
        if (session.page.type !== "absolute") {
          throw new Error("Page type not supported for positioning");
        }

        // Look for any rect elements (our QR code might be added as rect)
        // Since we can't reliably detect image elements in design editing,
        // we'll use the detected position approach
        const rectElements = session.page.elements.filter(
          (el) => el.type === "rect"
        );

        if (rectElements.length > 0) {
          // Get the last rect element (most recently added - likely our QR)
          const lastRect = rectElements[rectElements.length - 1];
          if (lastRect.type === "rect") {
            foundPosition = {
              top: lastRect.top,
              left: lastRect.left,
              width: lastRect.width,
              height: lastRect.height,
            };
          }
        }
      });

      if (!foundPosition) {
        throw new Error("Could not detect QR code position");
      }

      setDetectedPosition(foundPosition);

      // Create pages for remaining QR codes
      const remainingCodes = codes.slice(1);
      const position = foundPosition as DetectedPosition;
      
      let successCount = 0;
      let errorCount = 0;
      const startTime = Date.now();
      const newFailedPages: FailedPage[] = [];

      // Show progress start
      notification.addToast({
        messageText: intl.formatMessage(
          {
            defaultMessage: "📄 Creating {total} pages... Progress: 0/{total}",
            description: "Progress start toast",
          },
          { total: remainingPages }
        ),
      });

      // Process each QR code sequentially with longer delays
      for (let i = 0; i < remainingCodes.length; i++) {
        const qrSpec = remainingCodes[i];
        const pageNumber = i + 2; // +2 because we skip first page and arrays are 0-indexed
        
        currentProgress = i + 1;
        
        // Show progress every 3 pages or on last page
        if (currentProgress % 3 === 0 || currentProgress === remainingPages) {
          notification.addToast({
            messageText: intl.formatMessage(
              {
                defaultMessage: "⏳ Progress: {current}/{total} pages created...",
                description: "Progress update toast",
              },
              { current: currentProgress, total: remainingPages }
            ),
          });
        }
        
        try {
          // Always use dataUrl fallback to avoid upload issues
          // The upload API is too restrictive with dimensions and rate limiting
          await addPage({
            elements: [
              {
                type: "image",
                dataUrl: qrSpec.dataUrl,
                top: position.top,
                left: position.left,
                width: position.width,
                height: position.height,
                altText: {
                  text: `QR Code: ${qrSpec.text}`,
                  decorative: false,
                },
              },
            ],
          });
          
          successCount++;
          
          // Longer delay between page creations to avoid rate limiting
          // Canva allows max 3 pages per second, so we use 1 second delay
          if (i < remainingCodes.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1200));
          }
          
        } catch (pageError) {
          console.error(`Failed to create page ${pageNumber}:`, pageError);
          errorCount++;
          
          // Track failed page for potential retry
          newFailedPages.push({
            index: pageNumber,
            qrSpec,
            error: pageError instanceof Error ? pageError.message : 'Unknown error'
          });
          
          // If we hit rate limit, wait longer and try again
          if (pageError instanceof Error && pageError.message.includes('rate_limited')) {
            console.log(`Rate limited on page ${pageNumber}, waiting 3 seconds before retrying...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            try {
              // Retry once
              await addPage({
                elements: [
                  {
                    type: "image",
                    dataUrl: qrSpec.dataUrl,
                    top: position.top,
                    left: position.left,
                    width: position.width,
                    height: position.height,
                    altText: {
                      text: `QR Code: ${qrSpec.text}`,
                      decorative: false,
                    },
                  },
                ],
              });
              
              successCount++;
              errorCount--; // Remove from error count since retry succeeded
              
              // Remove from failed pages since retry succeeded
              const failedIndex = newFailedPages.findIndex(fp => fp.index === pageNumber);
              if (failedIndex !== -1) {
                newFailedPages.splice(failedIndex, 1);
              }
              
            } catch (retryError) {
              console.error(`Retry failed for page ${pageNumber}:`, retryError);
              // Keep it in error count and failed pages
            }
          }
          
          // Add extra delay after any error
          if (i < remainingCodes.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }

      // Update failed pages state
      setFailedPages(newFailedPages);

      // Final success notification
      console.log(`DEBUG: successCount=${successCount}, errorCount=${errorCount}`);
      if (successCount > 0) {
        if (errorCount === 0) {
          console.log("DEBUG: Showing donation banner - all pages created successfully");
          notification.addToast({
            messageText: intl.formatMessage(
              {
                defaultMessage: "✅ Successfully created all {success} pages!",
                description: "Complete success toast",
              },
              { success: successCount }
            ),
          });
          // Show donation banner after complete success
          setShowDonationBanner(true);
        } else {
          notification.addToast({
            messageText: intl.formatMessage(
              {
                defaultMessage: "⚠️ Created {success} pages successfully, {errors} failed (check retry option below)",
                description: "Partial success toast",
              },
              { success: successCount, errors: errorCount }
            ),
          });
        }
      } else {
        throw new Error("Failed to create any pages");
      }
      
    } catch {
      notification.addToast({
        messageText: intl.formatMessage({
          defaultMessage: "❌ Error creating pages. Make sure the first QR code is positioned on the page.",
          description: "Toast on page creation error",
        }),
      });
    } finally {
      setBusy(false);
    }
  }, [codes, firstQrPlaced, intl]);

  /* ------------ retry failed pages only -------------------- */
  const retryFailedPages = useCallback(async () => {
    if (failedPages.length === 0 || !detectedPosition) {
      return;
    }

    setIsRetrying(true);
    setBusy(true);
    
    // Show initial retry toast
    notification.addToast({
      messageText: intl.formatMessage(
        {
          defaultMessage: "🔄 Retrying {count} failed pages...",
          description: "Initial retry toast",
        },
        { count: failedPages.length }
      ),
    });

    try {
      const position = detectedPosition;
      let successCount = 0;
      let errorCount = 0;
      const remainingFailedPages: FailedPage[] = [];

      for (let i = 0; i < failedPages.length; i++) {
        const failedPage = failedPages[i];
        
        try {
          await addPage({
            elements: [
              {
                type: "image",
                dataUrl: failedPage.qrSpec.dataUrl,
                top: position.top,
                left: position.left,
                width: position.width,
                height: position.height,
                altText: {
                  text: `QR Code: ${failedPage.qrSpec.text}`,
                  decorative: false,
                },
              },
            ],
          });
          
          successCount++;
          
          // Show progress every 2 pages or on last page
          if ((i + 1) % 2 === 0 || i === failedPages.length - 1) {
            notification.addToast({
              messageText: intl.formatMessage(
                {
                  defaultMessage: "⏳ Retry progress: {current}/{total}...",
                  description: "Retry progress toast",
                },
                { current: i + 1, total: failedPages.length }
              ),
            });
          }
          
          // Delay to avoid rate limiting
          if (i < failedPages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
          
        } catch (retryError) {
          console.error(`Retry failed for page ${failedPage.index}:`, retryError);
          errorCount++;
          remainingFailedPages.push(failedPage);
          
          // Longer delay after error
          if (i < failedPages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2500));
          }
        }
      }

      // Update failed pages state
      setFailedPages(remainingFailedPages);

      // Final retry notification
      console.log(`DEBUG RETRY: successCount=${successCount}, errorCount=${errorCount}`);
      if (successCount > 0) {
        if (errorCount === 0) {
          console.log("DEBUG: Showing donation banner - all failed pages recovered");
          notification.addToast({
            messageText: intl.formatMessage({
              defaultMessage: "✅ All failed pages successfully recovered!",
              description: "Complete retry success toast",
            }),
          });
          // Show donation banner after complete recovery
          setShowDonationBanner(true);
        } else {
          notification.addToast({
            messageText: intl.formatMessage(
              {
                defaultMessage: "⚠️ Recovered {success} pages, {errors} still failed",
                description: "Partial retry success toast",
              },
              { success: successCount, errors: errorCount }
            ),
          });
        }
      } else {
        notification.addToast({
          messageText: intl.formatMessage({
            defaultMessage: "❌ Retry failed - all pages still have errors",
            description: "Complete retry failure toast",
          }),
        });
      }

    } catch {
      notification.addToast({
        messageText: intl.formatMessage({
          defaultMessage: "❌ Error during retry process",
          description: "Toast on retry error",
        }),
      });
    } finally {
      setIsRetrying(false);
      setBusy(false);
    }
  }, [failedPages, detectedPosition, intl]);

  /* ------------ reset workflow --------------------------- */
  const resetWorkflow = useCallback(() => {
    setFirstQrPlaced(false);
    setDetectedPosition(null);
    setCodes([]);
    setRawInput("");
    setFailedPages([]);
    setIsRetrying(false);
    setQrSize(DEFAULT_SIZE);
    // Don't reset donation banner - let it stay visible
  }, []);

  /* ------------------- UI ------------------------------- */
  return (
    <Box padding="2u">
      <Rows spacing="2u">
      <Title>
        <FormattedMessage
          defaultMessage="Bulk QR Page Generator"
          description="Main heading / app name"
        />
      </Title>

      <Text>
        <FormattedMessage
          defaultMessage="Create QR codes in bulk and add them to your design. Position the first QR code manually, then generate pages for the rest."
          description="Help text explaining the app functionality"
        />
      </Text>

      {/* Input Section */}
      <Rows spacing="1u">
        <FormField
          label={intl.formatMessage({
            defaultMessage: "Text or URLs",
            description: "Label for text input field",
          })}
          value={rawInput}
          control={(props) => (
            <MultilineInput
              {...props}
              placeholder={intl.formatMessage({
                defaultMessage:
                  "https://example.com\nhttps://another.com\nOr any text content...",
                description: "Placeholder example for multiline input",
              })}
              onChange={(value) => setRawInput(value)}
              maxRows={6}
              readOnly={firstQrPlaced}
            />
          )}
        />

        <Button
          variant="secondary"
          onClick={handleFileUpload}
          disabled={busy || firstQrPlaced}
          stretch
        >
          {intl.formatMessage({
            defaultMessage: "Upload CSV file",
            description: "Button to upload CSV file",
          })}
        </Button>
        
        {/* eslint-disable-next-line react/forbid-elements */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Rows>

      {/* QR Size Configuration - only show if no QR placed yet */}
      {!firstQrPlaced && (
        <Rows spacing="1u">
          <Title size="small">
            <FormattedMessage
              defaultMessage="QR Code Size"
              description="Sub‑heading for size controls"
            />
          </Title>

          <Rows spacing="2u">
            {/* Width Control */}
            <FormField
              label={intl.formatMessage({
                defaultMessage: "Width",
                description: "Width label",
              })}
              value={qrSize.width}
              control={() => (
                <Rows spacing="0.5u">
                  <Slider
                    min={50}
                    max={800}
                    step={10}
                    value={qrSize.width}
                    onChange={(value) =>
                      setQrSize({ ...qrSize, width: value })
                    }
                  />
                  <NumberInput
                    value={qrSize.width}
                    onChange={(value) =>
                      setQrSize({ ...qrSize, width: value || 50 })
                    }
                    min={50}
                    max={800}
                    placeholder="px"
                  />
                </Rows>
              )}
            />

            {/* Height Control */}
            <FormField
              label={intl.formatMessage({
                defaultMessage: "Height",
                description: "Height label",
              })}
              value={qrSize.height}
              control={() => (
                <Rows spacing="0.5u">
                  <Slider
                    min={50}
                    max={800}
                    step={10}
                    value={qrSize.height}
                    onChange={(value) =>
                      setQrSize({ ...qrSize, height: value })
                    }
                  />
                  <NumberInput
                    value={qrSize.height}
                    onChange={(value) =>
                      setQrSize({ ...qrSize, height: value || 50 })
                    }
                    min={50}
                    max={800}
                    placeholder="px"
                  />
                </Rows>
              )}
            />
          </Rows>
        </Rows>
      )}

      {/* Progress indicator */}
      {firstQrPlaced && detectedPosition && (
        <Text size="small">
          <FormattedMessage
            defaultMessage="✅ First QR positioned at: Top {top}px, Left {left}px (Size: {width}×{height}px)"
            description="Position detection success message"
            values={{
              top: detectedPosition.top,
              left: detectedPosition.left,
              width: detectedPosition.width,
              height: detectedPosition.height,
            }}
          />
        </Text>
      )}

      {/* Action Buttons */}
      <Rows spacing="1u">
        {!firstQrPlaced && (
          <>
            <Button
              disabled={busy || !rawInput.trim()}
              onClick={generateQrCodes}
              variant="primary"
              stretch
              loading={busy}
            >
              {intl.formatMessage({
                defaultMessage: "1. Generate QR Codes",
                description: "Step 1 button text",
              })}
            </Button>

            <Button
              disabled={busy || codes.length === 0}
              onClick={addFirstQrToPage}
              variant="secondary"
              stretch
              loading={busy}
            >
              {intl.formatMessage({
                defaultMessage: "2. Place First QR Code",
                description: "Step 2 button text",
              })}
            </Button>
          </>
        )}

        {firstQrPlaced && (
          <>
            <Button
              disabled={busy}
              onClick={detectPositionAndCreatePages}
              variant="primary"
              stretch
              loading={busy}
            >
              {intl.formatMessage(
                {
                  defaultMessage: "3. Create {count} Additional Pages",
                  description: "Step 3 button text",
                },
                { count: codes.length - 1 },
              )}
            </Button>

            {/* Retry Failed Pages Button - only show if there are failed pages */}
            {failedPages.length > 0 && (
              <Button
                disabled={busy || isRetrying}
                onClick={retryFailedPages}
                variant="secondary"
                stretch
                loading={isRetrying}
              >
                {intl.formatMessage(
                  {
                    defaultMessage: "🔄 Retry {count} Failed Pages",
                    description: "Retry failed pages button text",
                  },
                  { count: failedPages.length },
                )}
              </Button>
            )}

            <Button
              disabled={busy}
              onClick={resetWorkflow}
              variant="secondary"
              stretch
            >
              {intl.formatMessage({
                defaultMessage: "Start Over",
                description: "Reset button text",
              })}
            </Button>
          </>
        )}
      </Rows>

      {/* Donation Banner */}
      {showDonationBanner && (
        <Alert tone="info">
          <Rows spacing="1.5u">
            {/* Header with title and close button */}
            <Columns spacing="1u" alignY="center">
              <Column>
                <Text>
                  <FormattedMessage
                    defaultMessage="🎉 Great work! Tool completed successfully."
                    description="Donation banner title"
                  />
                </Text>
              </Column>
              <Column width="content">
                <Button 
                  variant="tertiary" 
                  onClick={() => setShowDonationBanner(false)}
                >
                  ✕
                </Button>
              </Column>
            </Columns>
            
            {/* Main content */}
            <Columns spacing="2u" alignY="center">
              {/* QR Code */}
              <Column width="content">
                <img
                  src={bmcQr}
                  alt="Buy Me a Coffee QR Code"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "6px",
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                />
              </Column>
              
              {/* Text content */}
              <Column>
                <Rows spacing="0.5u">
                  <Text size="small">
                    <FormattedMessage
                      defaultMessage="If this tool was helpful, consider supporting its development:"
                      description="Donation banner subtitle"
                    />
                  </Text>
                  
                  <Text>
                    ☕{" "}
                    <Link
                      href="https://coff.ee/giuseppedichiara"
                      requestOpenExternalUrl={() => openExternalUrl("https://coff.ee/giuseppedichiara")}
                      title="Support development - Buy me a coffee"
                    >
                      <FormattedMessage
                        defaultMessage="Buy me a coffee"
                        description="Donation link text"
                      />
                    </Link>
                  </Text>
                  
                  <Text size="small">
                    <FormattedMessage
                      defaultMessage="Scan QR code or click the link above"
                      description="Donation instruction text"
                    />
                  </Text>
                </Rows>
              </Column>
            </Columns>
          </Rows>
        </Alert>
      )}

      {/* Status Messages */}
      {codes.length > 0 && !firstQrPlaced && (
        <Text size="small">
          <FormattedMessage
            defaultMessage="{count} QR codes ready. Place the first one on the page to continue."
            description="Status text showing generated QR count"
            values={{ count: codes.length }}
          />
        </Text>
      )}

      {firstQrPlaced && !detectedPosition && (
        <Rows spacing="0.5u">
          <Text size="small">
            <FormattedMessage
              defaultMessage="First QR code placed! Move it to your desired position, then click 'Create Additional Pages'."
              description="Status text after first QR placement"
            />
          </Text>
          <Text size="small">
            <FormattedMessage
              defaultMessage="📝 Note: New pages will contain only the QR code at the detected position. Other elements from this page need to be manually copied if needed."
              description="Information about page duplication limitations"
            />
          </Text>
        </Rows>
      )}

      {/* Failed Pages Status */}
      {failedPages.length > 0 && (
        <Text size="small" tone="critical">
          <FormattedMessage
            defaultMessage="⚠️ {count} {count, plural, =1 {page} other {pages}} failed to create. Use the retry button above to attempt creating them again."
            description="Status text showing failed pages count"
            values={{ count: failedPages.length }}
          />
        </Text>
      )}
      </Rows>
    </Box>
  );
}
