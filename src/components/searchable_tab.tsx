import React, { useState, useCallback, useRef, useEffect } from "react";
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
  Box,
  Title,
  Checkbox,
  Select,
  TypographyCard,
  Masonry,
  MasonryItem
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
  marketData?: {
    house: Record<string, unknown>;
    unit: Record<string, unknown>;
    labels: Array<{ property: string; label: string; format: string }>;
  };
}

interface SearchableTabProps {
  endpoint: string;
  tabName: string;
  userEmail?: string;
}

export const SearchableTab: React.FC<SearchableTabProps> = ({
  endpoint,
  tabName,
  userEmail,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [detailedData, setDetailedData] = useState<DetailedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Filter states for listings
  const [onlyMyOffice, setOnlyMyOffice] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Metric search state for market data
  const [metricSearchQuery, setMetricSearchQuery] = useState("");
  
  // Image upload loading states
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  
  // Refs for managing search debouncing and cancellation
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSearchController = useRef<AbortController | null>(null);

  const addElement = useAddElement();
  const textSelection = useSelection("plaintext");
  const imageSelection = useSelection("image");
  const intl = useIntl();
  const apiClient = ApiClient.getInstance();

  // Helper function to get default metrics
  const getDefaultMetrics = useCallback((labels: Array<{ property: string; label: string; format: string }>) => {
    if (!labels) return [];
    
    // First, let's see what properties are available
    console.log('Available properties:', labels.map(l => ({ property: l.property, label: l.label })));
    
    // Look for metrics that match our patterns (case-insensitive and partial matching)
    return labels.filter(label => {
      const prop = label.property.toLowerCase();
      const labelText = label.label.toLowerCase();
      
      // Check for median price
      if (['sales_12m','median_price_12m','change_12m_median_price_12m','total_sales_value_12m'].includes(prop)) {
        return true;
      }
      
      return false;
    }) //.slice(0, 3); // Limit results ? Ensure we only get 3 metrics
  }, []);

  // Helper function to get searched metrics
  const getSearchedMetrics = useCallback((labels: Array<{ property: string; label: string; format: string }>) => {
    if (!labels || !metricSearchQuery.trim()) return [];
    
    const searchTerm = metricSearchQuery.toLowerCase();
    const defaultMetricsList = getDefaultMetrics(labels);
    const defaultProperties = defaultMetricsList.map(m => m.property);
    
    return labels.filter(label => 
      !defaultProperties.includes(label.property) && 
      label.label.toLowerCase().includes(searchTerm)
    );
  }, [metricSearchQuery, getDefaultMetrics]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (currentSearchController.current) {
        currentSearchController.current.abort();
      }
    };
  }, []);

  const searchAPI = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Cancel any existing search request
    if (currentSearchController.current) {
      currentSearchController.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    currentSearchController.current = controller;

    setLoading(true);
    try {
      // Use the new search endpoints
      let searchEndpoint = "";
      if (endpoint === "listings") {
        searchEndpoint = "/listings/search";
      } else if (endpoint === "market-data") {
        searchEndpoint = "/market/search";
      }

      // Build query parameters
      const params = new URLSearchParams();
      params.append("search", query);
      
      // Add filters for listings endpoint
      if (endpoint === "listings") {
        // Apply "Only my office" filter if checked
        if (onlyMyOffice && userEmail) {
          params.append("agent", userEmail);
        }
        // Always apply status filter when not "all"
        if (statusFilter !== "all") {
          params.append("status", statusFilter);
        }
      }

      // Make GET request with search parameter and abort signal
      const baseUrl = "https://api.theagencymiddleware.io/v1";
      const authStatus = apiClient.getAuthStatus();
      
      const response = await fetch(`${baseUrl}${searchEndpoint}?${params.toString()}`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Authorization": `Bearer ${authStatus.currentToken}`,
          "Content-Type": "application/json",
        },
      });

      // Check if request was aborted
      if (controller.signal.aborted) {
        return;
      }

      if (!response.ok) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      const responseData = await response.json();
      const data = responseData as any;
      let resultArray: Record<string, unknown>[] = [];
      
      if (data?.result && Array.isArray(data.result)) {
        resultArray = data.result;
      }
      
      // Check again if request was aborted before processing results
      if (controller.signal.aborted) {
        return;
      }

      // Transform search response based on endpoint type
      const results: SearchResult[] = resultArray.map((item: Record<string, unknown>, index: number) => {
        let id = "";
        let displayValue = "";

        if (endpoint === "listings") {
          // Use external_id for listings
          id = (item.external_id as string) || (item.id as string) || `result-${index}`;
          const address = (item.address as string) || "Unknown Address";
          const status = (item.status as string) || "";
          displayValue = status ? `${address} (${status})` : address;
        } else if (endpoint === "market-data") {
          // Use suburbpostcode directly from the response
          const suburbPostcode = item.suburbpostcode as string || "";
          id = suburbPostcode || `result-${index}`;
          displayValue = suburbPostcode || "Unknown Location";
        }

        return {
          id,
          displayValue,
          data: item,
        };
      });

      // Final check before setting results
      if (!controller.signal.aborted) {
        setSearchResults(results);
        setShowResults(true);
      }
    } catch (error: any) {
      // Don't show error if request was aborted
      if (error.name !== 'AbortError' && !controller.signal.aborted) {
        setSearchResults([]);
        setShowResults(false);
      }
    } finally {
      // Only update loading state if this is still the current request
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [endpoint, apiClient, onlyMyOffice, userEmail, statusFilter]);

  const fetchDetailedData = useCallback(async (result: SearchResult) => {
    setLoadingDetails(true);
    try {
      let detailEndpoint = "";
      let params = "";

      if (endpoint === "listings") {
        detailEndpoint = "/listings/data";
        params = `listing_id=${encodeURIComponent(result.id)}`;
      } else if (endpoint === "market-data") {
        detailEndpoint = "/market/data";
        params = `suburbpostcode=${encodeURIComponent(result.id)}`;
      }

      const response = await apiClient.customRequest(
        `${detailEndpoint}?${params}`,
        "GET"
      );
      
      if (!response.success) {
        setDetailedData(null);
        return;
      }

      const data = response.data as any;
      const itemData = data?.result || data || {};
      
      // Check if this is market data (has output property with house/unit/labels)
      if (endpoint === "market-data" && itemData.output) {
        const output = itemData.output;
        if (output.house && output.unit && output.labels) {
          // Special handling for market data
          console.log('Market data labels:', output.labels);
          setDetailedData({
            marketData: {
              house: output.house,
              unit: output.unit,
              labels: output.labels,
            }
          });
        } else {
          setDetailedData(null);
        }
      } else {
        // Standard handling for listings
        const detailedInfo: DetailedData = {
          images: [],
          textFields: [],
        };

        // Handle photos array specifically for listings
        if (Array.isArray(itemData.photos) && itemData.photos.length > 0) {
          detailedInfo.images = itemData.photos.map((url: string, index: number) => ({
            field: `Photo ${index + 1}`,
            url: url
          }));
        }

        // Handle all other fields as text fields, with proper formatting
        const fieldsToDisplay = [
          { key: "status", label: "Status" },
          { key: "price_advertise_as", label: "Price" },
          { key: "address", label: "Address" },
          { key: "suburb", label: "Suburb" },
          { key: "state", label: "State" },
          { key: "postcode", label: "Postcode" },
          { key: "property_type", label: "Property Type" },
          { key: "bedrooms", label: "Bedrooms" },
          { key: "bathrooms", label: "Bathrooms" },
          { key: "garages", label: "Garages" },
          { key: "year_built", label: "Year Built" },
          { key: "landarea", label: "Land Area" },
          { key: "listed_at", label: "Listed At" },
          { key: "external_id", label: "External ID" },
          { key: "type", label: "Type" },
          { key: "property_category", label: "Property Category" },
        ];

        detailedInfo.textFields = fieldsToDisplay
          .filter(({ key }) => {
            const value = itemData[key];
            return value !== null && value !== undefined && value !== "" && value !== "null";
          })
          .map(({ key, label }) => {
            let value = itemData[key];
            
            // Format specific fields
            if (key === "listed_at" && value) {
              value = new Date(value).toLocaleDateString();
            }
            
            return {
              field: label,
              value: String(value)
            };
          });

        setDetailedData(detailedInfo);
      }
    } catch {
      setDetailedData(null);
    } finally {
      setLoadingDetails(false);
    }
  }, [endpoint, apiClient]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Cancel any ongoing search request
    if (currentSearchController.current) {
      currentSearchController.current.abort();
    }
    
    // If empty query, clear results immediately
    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setLoading(false);
      return;
    }
    
    // Set new timeout for 200ms delay
    searchTimeoutRef.current = setTimeout(() => {
      searchAPI(value);
    }, 200);
  }, [searchAPI]);

  // Re-trigger search when filters change for listings only
  useEffect(() => {
    if (searchQuery.trim() && endpoint === "listings") {
      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Cancel any ongoing search request
      if (currentSearchController.current) {
        currentSearchController.current.abort();
      }
      
      // Set new timeout for 200ms delay
      searchTimeoutRef.current = setTimeout(() => {
        searchAPI(searchQuery);
      }, 200);
    }
  }, [onlyMyOffice, statusFilter, searchAPI, searchQuery, endpoint]);

  const handleResultSelect = useCallback(async (result: SearchResult) => {
    setSelectedResult(result);
    setSearchQuery(result.displayValue);
    setShowResults(false);
    setSearchResults([]);
    setDetailedData(null);

    await fetchDetailedData(result);
  }, [fetchDetailedData]);

  const handleTextFieldClick = useCallback(async (value: string) => {
    try {
      const selection = await textSelection.read();
      
      if (selection.contents.length > 0) {
        const content = selection.contents[0];
        content.text = value;
        await selection.save();
      } else {
        addElement({
          type: "text",
          children: [value],
        });
      }
    } catch {
      addElement({
        type: "text",
        children: [value],
      });
    }
  }, [textSelection, addElement]);

  const handleImageClick = useCallback(async (imageUrl: string) => {
    // Prevent double-clicks during upload
    if (uploadingImages.has(imageUrl)) return;
    
    // Add to uploading set
    setUploadingImages(prev => new Set(prev).add(imageUrl));
    
    try {
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
      
      const img = new Image();
      const imageDimensions = await new Promise<{width: number, height: number}>((resolve, reject) => {
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = proxyUrl;
      });
      
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
        const content = selection.contents[0];
        content.ref = ref;
        await selection.save();
      } else {
        addElement({
          type: "image",
          ref,
          altText: {
            text: "Uploaded image",
            decorative: false,
          },
        });
      }
    } catch (error) {
      console.error('Failed to add image:', error);
    } finally {
      // Remove from uploading set
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageUrl);
        return newSet;
      });
    }
  }, [imageSelection, addElement, uploadingImages]);

  const handleClear = useCallback(() => {
    setSearchQuery("");
    setSelectedResult(null);
    setDetailedData(null);
    setSearchResults([]);
    setShowResults(false);
    
    // Clean up pending search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (currentSearchController.current) {
      currentSearchController.current.abort();
    }
    setLoading(false);
  }, []);

  const formatValue = (value: any, format: string): string => {
    if (value === null || value === undefined) return "N/A";
    
    switch (format) {
      case "currency":
      case "dollar":
        return `$${Number(value).toLocaleString()}`;
      case "percentage":
      case "percent":
        // Convert decimal to percentage if needed (e.g., 0.05 -> 5%)
        const numValue = Number(value);
        if (numValue > 0 && numValue < 1) {
          return `${(numValue * 100).toFixed(2)}%`;
        }
        return `${numValue.toFixed(2)}%`;
      case "number":
        return Number(value).toLocaleString();
      case "date":
        return value;
      case "text":
      default:
        return String(value);
    }
  };

  return (
    <Rows spacing="3u">
      {/* Filters for listings */}
      {endpoint === "listings" && (
        <Columns spacing="2u" alignY="center">
          <Column width="content">
            <Checkbox
              checked={onlyMyOffice}
              onChange={(value, checked) => setOnlyMyOffice(checked)}
              label="Only my office"
            />
          </Column>
          <Column width="content">
            <Text size="small">Status:</Text>
          </Column>
          <Column>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as string)}
              placeholder="Select status"
              options={[
                { value: "all", label: "All" },
                { value: "current", label: "Current" },
                { value: "sold", label: "Sold" },
                { value: "pending", label: "Pending" }
              ]}
            />
          </Column>
        </Columns>
      )}
      
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
          {endpoint === "agents" && (
            <Text variant="regular">
              {intl.formatMessage({
                id: "searchable_tab.selected_item",
                defaultMessage: "Selected: {name}",
                description: "Label showing selected item",
              }, { name: selectedResult.displayValue })}
            </Text>
          )}

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
              {/* Market Data Display */}
              {detailedData.marketData && (
                <Box background="neutralLow" padding="2u" borderRadius="standard">
                  <Rows spacing="2u">
                    <Title size="small">Market Data</Title>
                    
                    {/* Default metrics - always shown */}
                    {getDefaultMetrics(detailedData.marketData.labels).map((labelInfo) => {
                      const houseValue = detailedData.marketData?.house[labelInfo.property];
                      const unitValue = detailedData.marketData?.unit[labelInfo.property];
                      
                      return (
                        <Rows key={labelInfo.property} spacing="1u">
                          <Text size="small" variant="bold">{labelInfo.label}</Text>
                          <Columns spacing="2u">
                            <Column>
                              <Text size="small">House:</Text>
                              <TypographyCard
                                onClick={() => handleTextFieldClick(formatValue(houseValue, labelInfo.format))}
                                onDragStart={() => formatValue(houseValue, labelInfo.format)}
                                ariaLabel={`Add house value: ${formatValue(houseValue, labelInfo.format)}`}
                              >
                                {formatValue(houseValue, labelInfo.format)}
                              </TypographyCard>
                            </Column>
                            <Column>
                              <Text size="small">Unit:</Text>
                              <TypographyCard
                                onClick={() => handleTextFieldClick(formatValue(unitValue, labelInfo.format))}
                                onDragStart={() => formatValue(unitValue, labelInfo.format)}
                                ariaLabel={`Add unit value: ${formatValue(unitValue, labelInfo.format)}`}
                              >
                                {formatValue(unitValue, labelInfo.format)}
                              </TypographyCard>
                            </Column>
                          </Columns>
                        </Rows>
                      );
                    })}
                    
                    {/* Search for additional metrics */}
                    <Rows spacing="2u">
                      <Text size="small" variant="bold">Search other metrics:</Text>
                      <SearchInputMenu
                        value={metricSearchQuery}
                        onChange={setMetricSearchQuery}
                        onClear={() => setMetricSearchQuery("")}
                        placeholder="Search metrics..."
                        ariaLabel="Search for additional metrics"
                      />
                      
                      {/* Search results - shown below search box */}
                      {getSearchedMetrics(detailedData.marketData.labels).map((labelInfo) => {
                        const houseValue = detailedData.marketData?.house[labelInfo.property];
                        const unitValue = detailedData.marketData?.unit[labelInfo.property];
                        
                        return (
                          <Rows key={labelInfo.property} spacing="1u">
                            <Text size="small" variant="bold">{labelInfo.label}</Text>
                            <Columns spacing="2u">
                              <Column>
                                <Text size="small">House:</Text>
                                <TypographyCard
                                  onClick={() => handleTextFieldClick(formatValue(houseValue, labelInfo.format))}
                                  onDragStart={() => formatValue(houseValue, labelInfo.format)}
                                  ariaLabel={`Add house value: ${formatValue(houseValue, labelInfo.format)}`}
                                >
                                  {formatValue(houseValue, labelInfo.format)}
                                </TypographyCard>
                              </Column>
                              <Column>
                                <Text size="small">Unit:</Text>
                                <TypographyCard
                                  onClick={() => handleTextFieldClick(formatValue(unitValue, labelInfo.format))}
                                  onDragStart={() => formatValue(unitValue, labelInfo.format)}
                                  ariaLabel={`Add unit value: ${formatValue(unitValue, labelInfo.format)}`}
                                >
                                  {formatValue(unitValue, labelInfo.format)}
                                </TypographyCard>
                              </Column>
                            </Columns>
                          </Rows>
                        );
                      })}
                    </Rows>
                  </Rows>
                </Box>
              )}

              {/* Listing Details - Custom Layout for endpoint="listings" */}
              {endpoint === "listings" ? (
                <Rows spacing="2u">
                  {/* Photos First */}
                  {detailedData.images && detailedData.images.length > 0 && (
                    <Rows spacing="1u">
                      <Text variant="bold">Photos</Text>
                      <Masonry targetRowHeightPx={200}>
                        {detailedData.images.map((image, index) => (
                          <MasonryItem 
                            key={`${image.field}-${index}`}
                            targetHeightPx={200}
                            targetWidthPx={200}
                          >
                            <Box position="relative">
                              <ImageCard
                                thumbnailUrl={image.url}
                                onClick={() => handleImageClick(image.url)}
                                alt={`${image.field} photo`}
                                ariaLabel={`Add ${image.field} photo to design`}
                                disabled={uploadingImages.has(image.url)}
                              />
                              {uploadingImages.has(image.url) && (
                                <Box
                                  position="absolute"
                                  top="0"
                                  left="0"
                                  width="full"
                                  height="full"
                                  background="neutralMid"
                                  borderRadius="standard"
                                  style={{ opacity: 0.8 }}
                                >
                                  <Rows spacing="1u" align="center" alignY="center" style={{ height: '100%' }}>
                                    <LoadingIndicator size="small" />
                                  </Rows>
                                </Box>
                              )}
                            </Box>
                          </MasonryItem>
                        ))}
                      </Masonry>
                    </Rows>
                  )}

                  {/* Property Details */}
                  {detailedData.textFields && detailedData.textFields.length > 0 && (
                    <Rows spacing="2u">
                      {/* Bedrooms, Bathrooms, Car Spaces Row */}
                      {(() => {
                        const bedrooms = detailedData.textFields.find(f => f.field.toLowerCase().includes('bedroom'));
                        const bathrooms = detailedData.textFields.find(f => f.field.toLowerCase().includes('bathroom'));
                        const carSpaces = detailedData.textFields.find(f => f.field.toLowerCase().includes('garage'));
                        
                        if (bedrooms || bathrooms || carSpaces) {
                          return (
                            <Columns spacing="2u">
                              {bedrooms && (
                                <Column>
                                  <Text size="small" variant="bold">Bedrooms</Text>
                                  <TypographyCard
                                    onClick={() => handleTextFieldClick(bedrooms.value)}
                                    onDragStart={() => bedrooms.value}
                                    ariaLabel={`Add bedrooms: ${bedrooms.value}`}
                                  >
                                    {bedrooms.value}
                                  </TypographyCard>
                                </Column>
                              )}
                              {bathrooms && (
                                <Column>
                                  <Text size="small" variant="bold">Bathrooms</Text>
                                  <TypographyCard
                                    onClick={() => handleTextFieldClick(bathrooms.value)}
                                    onDragStart={() => bathrooms.value}
                                    ariaLabel={`Add bathrooms: ${bathrooms.value}`}
                                  >
                                    {bathrooms.value}
                                  </TypographyCard>
                                </Column>
                              )}
                              {carSpaces && (
                                <Column>
                                  <Text size="small" variant="bold">Car Spaces</Text>
                                  <TypographyCard
                                    onClick={() => handleTextFieldClick(carSpaces.value)}
                                    onDragStart={() => carSpaces.value}
                                    ariaLabel={`Add car spaces: ${carSpaces.value}`}
                                  >
                                    {carSpaces.value}
                                  </TypographyCard>
                                </Column>
                              )}
                            </Columns>
                          );
                        }
                        return null;
                      })()}

                      {/* Address */}
                      {(() => {
                        const address = detailedData.textFields.find(f => f.field.toLowerCase().includes('address'));
                        if (address) {
                          return (
                            <Rows spacing="0.5u">
                              <Text size="small" variant="bold">Address</Text>
                              <TypographyCard
                                onClick={() => handleTextFieldClick(address.value)}
                                onDragStart={() => address.value}
                                ariaLabel={`Add address: ${address.value}`}
                              >
                                {address.value}
                              </TypographyCard>
                            </Rows>
                          );
                        }
                        return null;
                      })()}

                      {/* Suburb, State, Postcode Row */}
                      {(() => {
                        const suburb = detailedData.textFields.find(f => f.field.toLowerCase().includes('suburb'));
                        const state = detailedData.textFields.find(f => f.field.toLowerCase().includes('state'));
                        const postcode = detailedData.textFields.find(f => f.field.toLowerCase().includes('postcode'));
                        
                        if (suburb || state || postcode) {
                          return (
                            <Columns spacing="2u">
                              {suburb && (
                                <Column>
                                  <Text size="small" variant="bold">Suburb</Text>
                                  <TypographyCard
                                    onClick={() => handleTextFieldClick(suburb.value)}
                                    onDragStart={() => suburb.value}
                                    ariaLabel={`Add suburb: ${suburb.value}`}
                                  >
                                    {suburb.value}
                                  </TypographyCard>
                                </Column>
                              )}
                              {state && (
                                <Column>
                                  <Text size="small" variant="bold">State</Text>
                                  <TypographyCard
                                    onClick={() => handleTextFieldClick(state.value)}
                                    onDragStart={() => state.value}
                                    ariaLabel={`Add state: ${state.value}`}
                                  >
                                    {state.value}
                                  </TypographyCard>
                                </Column>
                              )}
                              {postcode && (
                                <Column>
                                  <Text size="small" variant="bold">Postcode</Text>
                                  <TypographyCard
                                    onClick={() => handleTextFieldClick(postcode.value)}
                                    onDragStart={() => postcode.value}
                                    ariaLabel={`Add postcode: ${postcode.value}`}
                                  >
                                    {postcode.value}
                                  </TypographyCard>
                                </Column>
                              )}
                            </Columns>
                          );
                        }
                        return null;
                      })()}

                      {/* Other Fields */}
                      {detailedData.textFields
                        .filter(field => {
                          const fieldName = field.field.toLowerCase();
                          return !fieldName.includes('bedroom') && 
                                 !fieldName.includes('bathroom') && 
                                 !fieldName.includes('garage') && 
                                 !fieldName.includes('address') && 
                                 !fieldName.includes('suburb') && 
                                 !fieldName.includes('state') && 
                                 !fieldName.includes('postcode');
                        })
                        .map((field, index) => (
                          <Rows key={`${field.field}-${index}`} spacing="0.5u">
                            <Text size="small" variant="bold">{field.field}</Text>
                            <TypographyCard
                              onClick={() => handleTextFieldClick(field.value)}
                              onDragStart={() => field.value}
                              ariaLabel={`Add ${field.field}: ${field.value}`}
                            >
                              {field.value}
                            </TypographyCard>
                          </Rows>
                        ))}
                    </Rows>
                  )}
                </Rows>
              ) : (
                /* Non-listing tabs - keep original layout */
                <Rows spacing="1u">
                  {/* Text Fields for non-listing tabs */}
                  {detailedData.textFields && detailedData.textFields.length > 0 && (
                    <Rows spacing="1u">
                      <Text variant="bold">
                        {intl.formatMessage({
                          id: "searchable_tab.text_fields_label",
                          defaultMessage: "Text Fields:",
                          description: "Label for text fields section",
                        })}
                      </Text>
                      <Rows spacing="2u">
                        {detailedData.textFields.map((field, index) => (
                          <Rows key={`${field.field}-${index}`} spacing="0.5u">
                            <Text size="small" variant="bold">{field.field}</Text>
                            <TypographyCard
                              onClick={() => handleTextFieldClick(field.value)}
                              onDragStart={() => field.value}
                              ariaLabel={`Add ${field.field}: ${field.value}`}
                            >
                              {field.value}
                            </TypographyCard>
                          </Rows>
                        ))}
                      </Rows>
                    </Rows>
                  )}

                  {/* Images for non-listing tabs */}
                  {detailedData.images && detailedData.images.length > 0 && (
                    <Rows spacing="1u">
                      <Text variant="bold">
                        {intl.formatMessage({
                          id: "searchable_tab.images_label",
                          defaultMessage: "Photos:",
                          description: "Label for images section",
                        })}
                      </Text>
                      <Masonry targetRowHeightPx={200}>
                        {detailedData.images.map((image, index) => (
                          <MasonryItem 
                            key={`${image.field}-${index}`}
                            targetHeightPx={200}
                            targetWidthPx={200}
                          >
                            <Box position="relative">
                              <ImageCard
                                thumbnailUrl={image.url}
                                onClick={() => handleImageClick(image.url)}
                                alt={`${image.field} photo`}
                                ariaLabel={`Add ${image.field} photo to design`}
                                disabled={uploadingImages.has(image.url)}
                              />
                              {uploadingImages.has(image.url) && (
                                <Box
                                  position="absolute"
                                  top="0"
                                  left="0"
                                  width="full"
                                  height="full"
                                  background="neutralMid"
                                  borderRadius="standard"
                                  style={{ opacity: 0.8 }}
                                >
                                  <Rows spacing="1u" align="center" alignY="center" style={{ height: '100%' }}>
                                    <LoadingIndicator size="small" />
                                  </Rows>
                                </Box>
                              )}
                            </Box>
                          </MasonryItem>
                        ))}
                      </Masonry>
                    </Rows>
                  )}
                </Rows>
              )}
            </Rows>
          )}
        </Rows>
      )}

      {loading && (
        <Rows spacing="1u" align="center">
          <LoadingIndicator size="medium" />
          <Text variant="regular">
            {intl.formatMessage({
              id: "searchable_tab.searching",
              defaultMessage: "Searching...",
              description: "Loading text while searching",
            })}
          </Text>
        </Rows>
      )}
    </Rows>
  );
};