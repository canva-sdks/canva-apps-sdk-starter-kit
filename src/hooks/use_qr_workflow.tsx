import React, { createContext, useContext, useReducer, useCallback } from "react";
import { useIntl } from "react-intl";
import { notification, requestOpenExternalUrl } from "@canva/platform";
import type { QrSpec, DetectedPosition, FailedPage } from "../types/qr";
import { DEFAULT_SIZE } from "../types/qr";
import * as qrService from "../services/qr_service";
import * as canvaApi from "../services/canva_api";

export interface QrWorkflowState {
  rawInput: string;
  codes: QrSpec[];
  qrSize: { width: number; height: number };
  busy: boolean;
  firstQrPlaced: boolean;
  detectedPosition: DetectedPosition | null;
  failedPages: FailedPage[];
  isRetrying: boolean;
  showDonationBanner: boolean;
}

export type QrWorkflowAction =
  | { type: "SET_RAW_INPUT"; payload: string }
  | { type: "SET_CODES"; payload: QrSpec[] }
  | { type: "SET_QR_SIZE"; payload: { width: number; height: number } }
  | { type: "SET_BUSY"; payload: boolean }
  | { type: "SET_FIRST_QR_PLACED"; payload: boolean }
  | { type: "SET_DETECTED_POSITION"; payload: DetectedPosition | null }
  | { type: "SET_FAILED_PAGES"; payload: FailedPage[] }
  | { type: "SET_IS_RETRYING"; payload: boolean }
  | { type: "SET_SHOW_DONATION_BANNER"; payload: boolean }
  | { type: "RESET_WORKFLOW" };

function qrWorkflowReducer(
  state: QrWorkflowState,
  action: QrWorkflowAction
): QrWorkflowState {
  switch (action.type) {
    case "SET_RAW_INPUT":
      return { ...state, rawInput: action.payload };
    case "SET_CODES":
      return { ...state, codes: action.payload };
    case "SET_QR_SIZE":
      return { ...state, qrSize: action.payload };
    case "SET_BUSY":
      return { ...state, busy: action.payload };
    case "SET_FIRST_QR_PLACED":
      return { ...state, firstQrPlaced: action.payload };
    case "SET_DETECTED_POSITION":
      return { ...state, detectedPosition: action.payload };
    case "SET_FAILED_PAGES":
      return { ...state, failedPages: action.payload };
    case "SET_IS_RETRYING":
      return { ...state, isRetrying: action.payload };
    case "SET_SHOW_DONATION_BANNER":
      return { ...state, showDonationBanner: action.payload };
    case "RESET_WORKFLOW":
      return {
        ...state,
        firstQrPlaced: false,
        detectedPosition: null,
        codes: [],
        rawInput: "",
        failedPages: [],
        isRetrying: false,
        qrSize: DEFAULT_SIZE,
      };
    default:
      return state;
  }
}

const initialState: QrWorkflowState = {
  rawInput: "",
  codes: [],
  qrSize: DEFAULT_SIZE,
  busy: false,
  firstQrPlaced: false,
  detectedPosition: null,
  failedPages: [],
  isRetrying: false,
  showDonationBanner: false,
};

export interface QrWorkflowActions {
  setRawInput: (input: string) => void;
  setCodes: (codes: QrSpec[]) => void;
  setQrSize: (size: { width: number; height: number }) => void;
  setBusy: (busy: boolean) => void;
  setFirstQrPlaced: (placed: boolean) => void;
  setDetectedPosition: (position: DetectedPosition | null) => void;
  setFailedPages: (pages: FailedPage[]) => void;
  setIsRetrying: (retrying: boolean) => void;
  setShowDonationBanner: (show: boolean) => void;
  resetWorkflow: () => void;
  generateQrCodes: () => Promise<void>;
  addFirstQrToPage: () => Promise<void>;
  detectPositionAndCreatePages: () => Promise<void>;
  retryFailedPages: () => Promise<void>;
  parseCsvFile: (file: File) => void;
  openExternalUrl: (url: string) => Promise<void>;
}

export interface QrWorkflowContextValue {
  state: QrWorkflowState;
  actions: QrWorkflowActions;
}

const QrWorkflowContext = createContext<QrWorkflowContextValue | undefined>(undefined);

export function QrWorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(qrWorkflowReducer, initialState);
  const intl = useIntl();

  // Action creators
  const setRawInput = useCallback((input: string) => {
    dispatch({ type: "SET_RAW_INPUT", payload: input });
  }, []);

  const setCodes = useCallback((codes: QrSpec[]) => {
    dispatch({ type: "SET_CODES", payload: codes });
  }, []);

  const setQrSize = useCallback((size: { width: number; height: number }) => {
    dispatch({ type: "SET_QR_SIZE", payload: size });
  }, []);

  const setBusy = useCallback((busy: boolean) => {
    dispatch({ type: "SET_BUSY", payload: busy });
  }, []);

  const setFirstQrPlaced = useCallback((placed: boolean) => {
    dispatch({ type: "SET_FIRST_QR_PLACED", payload: placed });
  }, []);

  const setDetectedPosition = useCallback((position: DetectedPosition | null) => {
    dispatch({ type: "SET_DETECTED_POSITION", payload: position });
  }, []);

  const setFailedPages = useCallback((pages: FailedPage[]) => {
    dispatch({ type: "SET_FAILED_PAGES", payload: pages });
  }, []);

  const setIsRetrying = useCallback((retrying: boolean) => {
    dispatch({ type: "SET_IS_RETRYING", payload: retrying });
  }, []);

  const setShowDonationBanner = useCallback((show: boolean) => {
    dispatch({ type: "SET_SHOW_DONATION_BANNER", payload: show });
  }, []);

  const resetWorkflow = useCallback(() => {
    dispatch({ type: "RESET_WORKFLOW" });
  }, []);

  // Complex actions
  const generateQrCodes = useCallback(async () => {
    setBusy(true);
    setFirstQrPlaced(false);
    setDetectedPosition(null);

    try {
      const lines = state.rawInput
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      const codes = await qrService.generateQrCodes(lines);
      setCodes(codes);

      notification.addToast({
        messageText: intl.formatMessage(
          {
            defaultMessage: "{n} QR codes generated successfully",
            description: "Toast after generating n QR codes",
          },
          { n: codes.length }
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
  }, [state.rawInput, intl, setBusy, setFirstQrPlaced, setDetectedPosition, setCodes]);

  const addFirstQrToPage = useCallback(async () => {
    if (state.codes.length === 0) {
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
      const firstQr = state.codes[0];

      // Carica il QR code su Canva
      const uploadedRef = await qrService.uploadQr(firstQr.dataUrl, state.qrSize);

      // Aggiorna i codes con il riferimento
      const updatedCodes = [...state.codes];
      updatedCodes[0] = { ...firstQr, uploadedRef };
      setCodes(updatedCodes);

      // Aggiunge alla pagina corrente
      await canvaApi.addImageElement({
        ref: uploadedRef,
        top: 100,
        left: 100,
        width: state.qrSize.width,
        height: state.qrSize.height,
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
  }, [state.codes, state.qrSize, intl, setBusy, setCodes, setFirstQrPlaced]);

  const detectPositionAndCreatePages = useCallback(async () => {
    if (state.codes.length === 0 || !state.firstQrPlaced) {
      notification.addToast({
        messageText: intl.formatMessage({
          defaultMessage: "Place the first QR code on the page first",
          description: "Toast when trying to create pages before placing first QR",
        }),
      });
      return;
    }

    setBusy(true);

    const remainingPages = state.codes.length - 1;

    notification.addToast({
      messageText: intl.formatMessage({
        defaultMessage: "🔄 Starting QR page generation... Do not modify the design during this process.",
        description: "Initial toast for page generation start",
      }),
    });

    try {
      // Rileva la posizione del QR code
      const foundPosition = await canvaApi.detectElementPosition();

      if (!foundPosition) {
        throw new Error("Could not detect QR code position");
      }

      setDetectedPosition(foundPosition);

      // Crea pagine per i QR rimanenti
      const remainingCodes = state.codes.slice(1);
      let successCount = 0;
      let errorCount = 0;
      const newFailedPages: FailedPage[] = [];

      for (let i = 0; i < remainingCodes.length; i++) {
        const qrSpec = remainingCodes[i];
        const pageNumber = i + 2;

        // Progress ogni 3 pagine
        if ((i + 1) % 3 === 0 || (i + 1) === remainingPages) {
          notification.addToast({
            messageText: intl.formatMessage(
              {
                defaultMessage: "⏳ Progress: {current}/{total} pages created...",
                description: "Progress update toast",
              },
              { current: i + 1, total: remainingPages }
            ),
          });
        }

        try {
          const pageElement = qrService.createPageWithQr(qrSpec, foundPosition);
          await canvaApi.createPage([pageElement]);

          successCount++;

          // Delay per evitare rate limiting
          if (i < remainingCodes.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1200));
          }

        } catch (pageError) {
          errorCount++;

          newFailedPages.push({
            index: pageNumber,
            qrSpec,
            error: pageError instanceof Error ? pageError.message : 'Unknown error'
          });

          // Retry logic per rate limiting
          if (pageError instanceof Error && pageError.message.includes('rate_limited')) {
            await new Promise(resolve => setTimeout(resolve, 3000));

            try {
              await canvaApi.createPage([qrService.createPageWithQr(qrSpec, foundPosition)]);
              successCount++;
              errorCount--;

              const failedIndex = newFailedPages.findIndex(fp => fp.index === pageNumber);
              if (failedIndex !== -1) {
                newFailedPages.splice(failedIndex, 1);
              }

            } catch {
              // Retry failed, keep in failed pages list
            }
          }

          if (i < remainingCodes.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }

      setFailedPages(newFailedPages);

      // Notifiche finali
      if (successCount > 0) {
        if (errorCount === 0) {
          notification.addToast({
            messageText: intl.formatMessage(
              {
                defaultMessage: "✅ Successfully created all {success} pages!",
                description: "Complete success toast",
              },
              { success: successCount }
            ),
          });
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
  }, [state.codes, state.firstQrPlaced, intl, setBusy, setDetectedPosition, setFailedPages, setShowDonationBanner]);

  const retryFailedPages = useCallback(async () => {
    if (state.failedPages.length === 0 || !state.detectedPosition) {
      return;
    }

    setIsRetrying(true);
    setBusy(true);

    notification.addToast({
      messageText: intl.formatMessage(
        {
          defaultMessage: "🔄 Retrying {count} failed pages...",
          description: "Initial retry toast",
        },
        { count: state.failedPages.length }
      ),
    });

    try {
      const position = state.detectedPosition;
      let successCount = 0;
      let errorCount = 0;
      const remainingFailedPages: FailedPage[] = [];

      for (let i = 0; i < state.failedPages.length; i++) {
        const failedPage = state.failedPages[i];

        try {
          const pageElement = qrService.createPageWithQr(failedPage.qrSpec, position);
          await canvaApi.createPage([pageElement]);

          successCount++;

          if ((i + 1) % 2 === 0 || i === state.failedPages.length - 1) {
            notification.addToast({
              messageText: intl.formatMessage(
                {
                  defaultMessage: "⏳ Retry progress: {current}/{total}...",
                  description: "Retry progress toast",
                },
                { current: i + 1, total: state.failedPages.length }
              ),
            });
          }

          if (i < state.failedPages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }

        } catch {
          errorCount++;
          remainingFailedPages.push(failedPage);

          if (i < state.failedPages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2500));
          }
        }
      }

      setFailedPages(remainingFailedPages);

      // Notifiche finali retry
      if (successCount > 0) {
        if (errorCount === 0) {
          notification.addToast({
            messageText: intl.formatMessage({
              defaultMessage: "✅ All failed pages successfully recovered!",
              description: "Complete retry success toast",
            }),
          });
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
  }, [state.failedPages, state.detectedPosition, intl, setIsRetrying, setBusy, setFailedPages, setShowDonationBanner]);

  const parseCsvFile = useCallback(async (file: File) => {
    try {
      const items = await qrService.parseCsv(file);
      setRawInput(items.join("\n"));
      notification.addToast({
        messageText: intl.formatMessage({
          defaultMessage: "CSV file loaded successfully",
          description: "Toast when CSV is successfully parsed",
        }),
      });
    } catch {
      notification.addToast({
        messageText: intl.formatMessage({
          defaultMessage: "Error reading CSV file",
          description: "Toast when CSV parsing fails",
        }),
      });
    }
  }, [intl, setRawInput]);

  const openExternalUrl = useCallback(async (url: string) => {
    const response = await requestOpenExternalUrl({ url });
    if (response.status === "aborted") {
      // User decided not to navigate to the link
    }
  }, []);

  const actions: QrWorkflowActions = {
    setRawInput,
    setCodes,
    setQrSize,
    setBusy,
    setFirstQrPlaced,
    setDetectedPosition,
    setFailedPages,
    setIsRetrying,
    setShowDonationBanner,
    resetWorkflow,
    generateQrCodes,
    addFirstQrToPage,
    detectPositionAndCreatePages,
    retryFailedPages,
    parseCsvFile,
    openExternalUrl,
  };

  return (
    <QrWorkflowContext.Provider value={{ state, actions }}>
      {children}
    </QrWorkflowContext.Provider>
  );
}

export function useQrWorkflow(): QrWorkflowContextValue {
  const context = useContext(QrWorkflowContext);
  if (context === undefined) {
    throw new Error("useQrWorkflow must be used within a QrWorkflowProvider");
  }
  return context;
} 