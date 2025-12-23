import {
  ArrowLeftIcon,
  Box,
  Button,
  CheckIcon,
  Column,
  Columns,
  CopyIcon,
  Grid,
  ImageCard,
  Rows,
  SegmentedControl,
  Text,
  TypographyCard,
} from "@canva/app-ui-kit";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import type { Property } from "../../real_estate.type";
import { useAddElement } from "../../util/use_add_element";
import { useDragElement } from "../../util/use_drag_element";

export const ListingDetailsPage = () => {
  const navigate = useNavigate();
  const listing = (useLocation().state as { listing: Property })?.listing;
  const intl = useIntl();
  const [selectedTab, setSelectedTab] = useState("images");
  const [copyState, setCopyState] = useState<"idle" | "loading" | "complete">(
    "idle",
  );

  const { addText, addImage } = useAddElement();

  const { dragText, dragImage } = useDragElement();

  if (!listing) {
    navigate(-1);
  }

  const handleCopy = async (text: string) => {
    setCopyState("loading");
    try {
      await Promise.all([
        navigator.clipboard.writeText(text),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);
      setCopyState("complete");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch (error) {
      setCopyState("idle");
      // eslint-disable-next-line no-console
      console.error(
        intl.formatMessage({
          defaultMessage: "Failed to copy:",
          description: "Console error message when copying fails",
        }),
        error,
      );
    }
  };

  return (
    <Box paddingY="2u" height="full">
      <Rows spacing="2u">
        <Columns spacing="1u" alignY="center">
          <Column width="content">
            <Button
              icon={ArrowLeftIcon}
              size="small"
              type="button"
              variant="tertiary"
              onClick={() => navigate(-1)}
            />
          </Column>
          <Column>
            <Text variant="bold">
              {intl.formatMessage({
                defaultMessage: "Property Details",
                description: "Page title for property details page",
              })}
            </Text>
          </Column>
        </Columns>

        <Rows spacing="2u">
          <SegmentedControl
            options={[
              {
                value: "images",
                label: intl.formatMessage({
                  defaultMessage: "Images",
                  description: "Property images tab",
                }),
              },
              {
                value: "details",
                label: intl.formatMessage({
                  defaultMessage: "Details",
                  description: "Property details tab",
                }),
              },
              {
                value: "agent",
                label: intl.formatMessage({
                  defaultMessage: "Agent",
                  description: "Property's agent tab",
                }),
              },
            ]}
            value={selectedTab}
            onChange={setSelectedTab}
          />

          {selectedTab === "images" && (
            <Box>
              <Rows spacing="2u">
                {listing.listing_images && listing.listing_images.length > 0 ? (
                  <Grid columns={2} spacing="2u">
                    {listing.listing_images.map((image, index) => (
                      <ImageCard
                        key={index}
                        selectable
                        thumbnailUrl={image.url}
                        alt={
                          image.alt ||
                          intl.formatMessage({
                            defaultMessage: "Property image",
                            description: "Alt text for property image",
                          })
                        }
                        thumbnailHeight={150}
                        thumbnailAspectRatio={4 / 3}
                        onClick={async () => {
                          await addImage(
                            image.url,
                            image.alt ||
                              intl.formatMessage({
                                defaultMessage: "Property image",
                                description: "Alt text for property image",
                              }),
                          );
                        }}
                        onDragStart={(e) => {
                          dragImage(
                            e,
                            image.url,
                            image.alt ||
                              intl.formatMessage({
                                defaultMessage: "Property image",
                                description: "Alt text for property image",
                              }),
                            image.width,
                            image.height,
                          );
                        }}
                      />
                    ))}
                  </Grid>
                ) : (
                  <Box>
                    <Text>
                      {intl.formatMessage({
                        defaultMessage: "No images available",
                        description:
                          "Message shown when no images are available",
                      })}
                    </Text>
                  </Box>
                )}
              </Rows>
            </Box>
          )}

          {selectedTab === "details" && (
            <Rows spacing="2u">
              <Rows spacing="1u">
                <Text variant="bold">
                  {intl.formatMessage({
                    defaultMessage: "Title",
                    description: "Label for property title field",
                  })}
                </Text>
                <TypographyCard
                  ariaLabel={intl.formatMessage({
                    defaultMessage: "Add property title to design",
                    description:
                      "Accessibility label for adding property title to design",
                  })}
                  onClick={() => addText(listing.title)}
                  onDragStart={(e) => dragText(e, listing.title)}
                >
                  <Text>{listing.title}</Text>
                </TypographyCard>
              </Rows>

              <Rows spacing="2u">
                <Rows spacing="1u">
                  <Text variant="bold">
                    {intl.formatMessage({
                      defaultMessage: "Description",
                      description: "Label for property description field",
                    })}
                  </Text>
                  <TypographyCard
                    ariaLabel={intl.formatMessage({
                      defaultMessage: "Add property description to design",
                      description:
                        "Accessibility label for adding property description to design",
                    })}
                    onClick={() => addText(listing.description)}
                    onDragStart={(e) => dragText(e, listing.description)}
                  >
                    <Text>{listing.description}</Text>
                  </TypographyCard>
                </Rows>

                <Columns spacing="1u" alignY="stretch">
                  <Column>
                    <Button
                      variant="primary"
                      stretch
                      onClick={() => addText(listing.description)}
                    >
                      {intl.formatMessage({
                        defaultMessage: "Add to design",
                        description:
                          "Button text for adding description to design",
                      })}
                    </Button>
                  </Column>
                  <Column width="content">
                    <Button
                      icon={copyState === "complete" ? CheckIcon : CopyIcon}
                      variant="secondary"
                      loading={copyState === "loading"}
                      onClick={() => handleCopy(listing.description)}
                    />
                  </Column>
                </Columns>
              </Rows>

              <Rows spacing="1u">
                <Text variant="bold">
                  {intl.formatMessage({
                    defaultMessage: "Address",
                    description: "Label for property address field",
                  })}
                </Text>
                <TypographyCard
                  ariaLabel={intl.formatMessage({
                    defaultMessage: "Add property address to design",
                    description:
                      "Accessibility label for adding property address to design",
                  })}
                  onClick={() => addText(listing.address)}
                  onDragStart={(e) => dragText(e, listing.address)}
                >
                  <Text>{listing.address}</Text>
                </TypographyCard>
              </Rows>

              <Rows spacing="1u">
                <Text variant="bold">
                  {intl.formatMessage({
                    defaultMessage: "Price",
                    description: "Label for property price field",
                  })}
                </Text>
                <TypographyCard
                  ariaLabel={intl.formatMessage({
                    defaultMessage: "Add listing price to design",
                    description:
                      "Accessibility label for adding listing price to design",
                  })}
                  onClick={() => addText(listing.price)}
                  onDragStart={(e) => dragText(e, listing.price)}
                >
                  <Text>{listing.price}</Text>
                </TypographyCard>
              </Rows>
            </Rows>
          )}

          {selectedTab === "agent" && listing.agent && (
            <Box>
              <Rows spacing="2u">
                {listing.agent.headshots && (
                  <Box>
                    <Rows spacing="1u">
                      <Text variant="bold">
                        {intl.formatMessage({
                          defaultMessage: "Headshots",
                          description: "Label for agent headshots section",
                        })}
                      </Text>
                      <Columns spacing="2u" alignY="stretch">
                        {listing.agent.headshots.map((headshot, index) => (
                          <Column key={index} width="1/2">
                            <ImageCard
                              selectable
                              thumbnailUrl={headshot.url}
                              alt={intl.formatMessage({
                                defaultMessage: "Agent photo",
                                description: "Alt text for agent photo",
                              })}
                              thumbnailHeight={150}
                              onClick={async () => {
                                await addImage(
                                  headshot.url,
                                  intl.formatMessage({
                                    defaultMessage: "Agent photo",
                                    description: "Alt text for agent photo",
                                  }),
                                );
                              }}
                              onDragStart={(e) => {
                                dragImage(
                                  e,
                                  headshot.url,
                                  intl.formatMessage({
                                    defaultMessage: "Agent photo",
                                    description: "Alt text for agent photo",
                                  }),
                                  headshot.width,
                                  headshot.height,
                                );
                              }}
                            />
                          </Column>
                        ))}
                      </Columns>
                    </Rows>
                  </Box>
                )}

                <Rows spacing="2u">
                  <Box>
                    <Rows spacing="1u">
                      <Text variant="bold">
                        {intl.formatMessage({
                          defaultMessage: "Name",
                          description: "Label for agent name field",
                        })}
                      </Text>
                      <TypographyCard
                        ariaLabel={intl.formatMessage({
                          defaultMessage: "Add agent name to design",
                          description:
                            "Accessibility label for adding agent name to design",
                        })}
                        onClick={() => addText(listing.agent?.name || "")}
                        onDragStart={(e) =>
                          dragText(e, listing.agent?.name || "")
                        }
                      >
                        <Text>{listing.agent?.name}</Text>
                      </TypographyCard>
                    </Rows>
                  </Box>

                  <Box>
                    <Rows spacing="1u">
                      <Text variant="bold">
                        {intl.formatMessage({
                          defaultMessage: "Title",
                          description: "Label for agent role title field",
                        })}
                      </Text>
                      <TypographyCard
                        ariaLabel={intl.formatMessage({
                          defaultMessage: "Add agent title to design",
                          description:
                            "Accessibility label for adding agent title to design",
                        })}
                        onClick={() => addText(listing.agent?.roleTitle || "")}
                        onDragStart={(e) =>
                          dragText(e, listing.agent?.roleTitle || "")
                        }
                      >
                        <Text>{listing.agent?.roleTitle}</Text>
                      </TypographyCard>
                    </Rows>
                  </Box>

                  <Box>
                    <Rows spacing="0.5u">
                      <Text variant="bold">
                        {intl.formatMessage({
                          defaultMessage: "Phone number",
                          description: "Label for agent phone number field",
                        })}
                      </Text>
                      <TypographyCard
                        ariaLabel={intl.formatMessage({
                          defaultMessage: "Add agent phone to design",
                          description:
                            "Accessibility label for adding agent phone to design",
                        })}
                        onClick={() =>
                          addText(listing.agent?.phoneNumber || "")
                        }
                        onDragStart={(e) =>
                          dragText(e, listing.agent?.phoneNumber || "")
                        }
                      >
                        <Text>{listing.agent?.phoneNumber}</Text>
                      </TypographyCard>
                    </Rows>
                  </Box>
                </Rows>
              </Rows>
            </Box>
          )}
        </Rows>
      </Rows>
    </Box>
  );
};
