import React, { useState, useCallback } from "react";
import {
  Rows,
  SearchInputMenu,
  Menu,
  MenuItem,
  Button,
  Columns,
  Column,
  Text,
  ImageCard,
  LoadingIndicator,
} from "@canva/app-ui-kit";
import { useAddElement } from "utils/use_add_element";
import { useSelection } from "utils/use_selection_hook";
import { useIntl } from "react-intl";
import { upload } from "@canva/asset";
import ApiClient from "../services/api_client";

interface SearchResult {
  id: string;
  displayValue: string;
  data: Record<string, unknown>;
}

interface DetailedData {
  images?: {
    url: string;
    field: string;
  }[];
  textFields?: {
    field: string;
    value: string;
  }[];
}

interface SearchableTabProps {
  endpoint: string;
  tabName: string;
}

export const SearchableTab: React.FC<SearchableTabProps> = ({
  endpoint,
  tabName,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [detailedData, setDetailedData] = useState<DetailedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const addElement = useAddElement();
  const textSelection = useSelection("plaintext");
  const imageSelection = useSelection("image");
  const intl = useIntl();
  const apiClient = ApiClient.getInstance();

  const searchAPI = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      // Use the authenticated API client
      const response = await apiClient.search(endpoint, query);
      
      if (!response.success) {
        // API error - silently fail and show no results
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      const data = response.data as any;
      
      // Get results array from the 'result' property (same as agent search)
      let resultArray: Record<string, unknown>[] = [];
      
      if (data?.result && Array.isArray(data.result)) {
        resultArray = data.result;
      }
      
      // Transform search response to SearchResult format (basic info only)
      const results: SearchResult[] = resultArray.map((item: Record<string, unknown>, index: number) => ({
        id: (item.id as string) || (item._id as string) || `result-${index}`,
        displayValue: (item.name as string) || (item.displayName as string) || (item.title as string) || "Unknown",
        data: item,
      }));

      setSearchResults(results);
      setShowResults(true);
    } catch {
      // API error - silently fail and show no results
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  }, [endpoint, apiClient]);

  const fetchDetailedData = useCallback(async (result: SearchResult) => {
    setLoadingDetails(true);
    try {
      // Use the detailed data endpoint (same endpoint with item ID)
      const response = await apiClient.getDetails(endpoint, result.id);
      
      if (!response.success) {
        setDetailedData(null);
        return;
      }

      const data = response.data as any;
      const itemData = data?.result || data || {};

      // Transform detailed response to DetailedData format
      const detailedInfo: DetailedData = {
        images: Object.entries(itemData)
          .filter(([, value]) => 
            typeof value === "string" && 
            (value.startsWith("http") && (value.includes(".jpg") || value.includes(".png") || value.includes(".jpeg") || value.includes(".gif")))
          )
          .map(([field, url]) => ({ field, url: url as string })),
        textFields: Object.entries(itemData)
          .filter(([key, value]) => 
            typeof value === "string" && 
            !key.toLowerCase().includes("image") && 
            !key.toLowerCase().includes("photo") &&
            !(value.startsWith("http")) &&
            key !== "id"
          )
          .map(([field, value]) => ({ field, value: value as string })),
      };

      setDetailedData(detailedInfo);
    } catch {
      setDetailedData(null);
    } finally {
      setLoadingDetails(false);
    }
  }, [endpoint, apiClient]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    searchAPI(value);
  }, [searchAPI]);

  const handleResultSelect = useCallback(async (result: SearchResult) => {
    setSelectedResult(result);
    setSearchQuery(result.displayValue);
    setShowResults(false);
    setSearchResults([]);
    setDetailedData(null);

    // Fetch detailed data for the selected result
    await fetchDetailedData(result);
  }, [fetchDetailedData]);

  const handleTextFieldClick = useCallback(async (value: string) => {
    try {
      const selection = await textSelection.read();
      
      if (selection.contents.length > 0) {
        // Replace selected text
        const content = selection.contents[0];
        content.text = value;
        await selection.save();
      } else {
        // Add new text element
        addElement({
          type: "text",
          children: [value],
        });
      }
    } catch {
      // Fallback: add new text element
      addElement({
        type: "text",
        children: [value],
      });
    }
  }, [textSelection, addElement]);

  const handleImageClick = useCallback(async (imageUrl: string) => {
    try {
      // Create a proxy URL to bypass CORS issues
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
      
      // Get original image dimensions
      const img = new Image();
      const imageDimensions = await new Promise<{width: number, height: number}>((resolve, reject) => {
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = proxyUrl;
      });
      
      // First upload the image to get a valid ImageRef with original dimensions
      const { ref } = await upload({
        type: "image",
        url: proxyUrl,
        thumbnailUrl: proxyUrl,
        mimeType: "image/jpeg",
        width: imageDimensions.width,
        height: imageDimensions.height,
        aiDisclosure: "none",
      });

      const selection = await imageSelection.read();
      
      if (selection.contents.length > 0) {
        // Replace selected image
        const content = selection.contents[0];
        content.ref = ref;
        await selection.save();
      } else {
        // Add new image element
        addElement({
          type: "image",
          ref,
          altText: {
            text: "Uploaded image",
            decorative: false,
          },
        });
      }
    } catch {
      // If upload fails, we can't add the image - silently fail
    }
  }, [imageSelection, addElement]);

  const handleClear = useCallback(() => {
    setSearchQuery("");
    setSelectedResult(null);
    setDetailedData(null);
    setSearchResults([]);
    setShowResults(false);
  }, []);

  return (
    <Rows spacing="3u">
      <SearchInputMenu
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={handleClear}
        placeholder={intl.formatMessage({
          id: "searchable_tab.search_placeholder",
          defaultMessage: "Search {tabName}...",
          description: "Placeholder text for search input",
        }, { tabName: tabName.toLowerCase() })}
        ariaLabel={intl.formatMessage({
          id: "searchable_tab.search_aria_label",
          defaultMessage: "Search for {tabName}",
          description: "Aria label for search input",
        }, { tabName: tabName.toLowerCase() })}
        onOutsidePointerDown={() => setShowResults(false)}
      >
        {showResults && searchResults.length > 0 && (
          <Menu ariaLabel="Search results">
            {searchResults.map((result) => (
              <MenuItem
                key={result.id}
                label={result.displayValue}
                onClick={() => handleResultSelect(result)}
              />
            ))}
          </Menu>
        )}
      </SearchInputMenu>

      {selectedResult && (
        <Rows spacing="1u">
          <Text variant="regular">
            {intl.formatMessage({
              id: "searchable_tab.selected_item",
              defaultMessage: "Selected: {name}",
              description: "Label showing selected item",
            }, { name: selectedResult.displayValue })}
          </Text>

          {loadingDetails && (
            <Rows spacing="1u">
              <LoadingIndicator size="medium" />
              <Text variant="regular">
                {intl.formatMessage({
                  id: "searchable_tab.loading_details",
                  defaultMessage: "Loading details...",
                  description: "Loading text while fetching item details",
                })}
              </Text>
            </Rows>
          )}

          {detailedData && (
            <Rows spacing="1u">
              {/* Text Fields */}
              {detailedData.textFields && detailedData.textFields.length > 0 && (
                <Rows spacing="1u">
                  <Text variant="bold">
                    {intl.formatMessage({
                      id: "searchable_tab.text_fields_label",
                      defaultMessage: "Text Fields:",
                      description: "Label for text fields section",
                    })}
                  </Text>
                  <Rows spacing="1u">
                    {detailedData.textFields.map((field, index) => (
                      <Button
                        key={`${field.field}-${index}`}
                        variant="secondary"
                        onClick={() => handleTextFieldClick(field.value)}
                      >
                        {`${field.field}: ${field.value}`}
                      </Button>
                    ))}
                  </Rows>
                </Rows>
              )}

              {/* Images */}
              {detailedData.images && detailedData.images.length > 0 && (
                <Rows spacing="1u">
                  <Text variant="bold">
                    {intl.formatMessage({
                      id: "searchable_tab.images_label",
                      defaultMessage: "Images:",
                      description: "Label for images section",
                    })}
                  </Text>
                  <Columns spacing="1u">
                    {detailedData.images.map((image, index) => (
                      <Column key={`${image.field}-${index}`}>
                        <div>
                          <Text>{image.field}</Text>
                          <Button
                            variant="tertiary"
                            onClick={() => handleImageClick(image.url)}
                          >
                            {intl.formatMessage({
                              id: "searchable_tab.add_image_button",
                              defaultMessage: "Add Image",
                              description: "Button text to add image to design",
                            })}
                          </Button>
                          <ImageCard
                            thumbnailUrl={image.url}
                            onClick={() => handleImageClick(image.url)}
                            alt={`${image.field} thumbnail`}
                          />
                        </div>
                      </Column>
                    ))}
                  </Columns>
                </Rows>
              )}
            </Rows>
          )}
        </Rows>
      )}

      {loading && (
        <Text variant="regular">
          {intl.formatMessage({
            id: "searchable_tab.searching",
            defaultMessage: "Searching...",
            description: "Loading text while searching",
          })}
        </Text>
      )}
    </Rows>
  );
};