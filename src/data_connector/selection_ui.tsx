import type { RenderSelectionUiRequest } from "@canva/intents/data";
import {
  Alert,
  Button,
  Rows,
  Text,
  Title,
  Select,
  FormField,
  SearchInputMenu,
  Menu,
  MenuItem,
  LoadingIndicator,
  CheckboxGroup,
  Box,
} from "@canva/app-ui-kit";
import { useEffect, useState, useCallback, useRef } from "react";
import * as styles from "styles/components.css";
import type { DataSourceConfig } from "./data_transformer";
import { getAvailableFields } from "./data_transformer";

interface SearchResult {
  id: string;
  displayValue: string;
  secondaryValue?: string;
}

export const SelectionUI = (request: RenderSelectionUiRequest) => {
  const [dataType, setDataType] = useState<"agent" | "listing" | "market-data">("agent");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Track the auth token
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Search debounce
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchControllerRef = useRef<AbortController | null>(null);

  // Base API URL
  const baseUrl = "https://api.theagencymiddleware.io/v1";

  // Handle invocation context to respond to how the app was loaded
  useEffect(() => {
    const { reason } = request.invocationContext;
    switch (reason) {
      case "data_selection":
        // If there's an existing selection, pre-populate the UI
        if (request.invocationContext.dataSourceRef) {
          try {
            const savedParams = JSON.parse(
              request.invocationContext.dataSourceRef.source
            ) as DataSourceConfig;
            setDataType(savedParams.dataType || "agent");
            if (savedParams.selectedFields) {
              setSelectedFields(savedParams.selectedFields);
            }
            // Set selected item based on saved data
            if (savedParams.agentEmail) {
              setSelectedItem({ id: savedParams.agentEmail, displayValue: savedParams.agentEmail });
              setSearchQuery(savedParams.agentEmail);
            } else if (savedParams.listingId) {
              setSelectedItem({ id: savedParams.listingId, displayValue: `Listing ${savedParams.listingId}` });
              setSearchQuery(savedParams.listingId);
            } else if (savedParams.suburbPostcode) {
              setSelectedItem({ id: savedParams.suburbPostcode, displayValue: savedParams.suburbPostcode });
              setSearchQuery(savedParams.suburbPostcode);
            }
          } catch {
            setError("Failed to load saved selection");
          }
        }
        break;
      case "outdated_source_ref":
        setError(
          "Your previously selected data is no longer available. Please make a new selection."
        );
        break;
      case "app_error":
        setError(
          request.invocationContext.message ||
            "An error occurred with your data"
        );
        break;
      default:
        break;
    }
  }, [request.invocationContext]);

  // Get auth token from app storage (simplified - in production this would integrate with your auth service)
  useEffect(() => {
    // For the data connector, we'll need to handle authentication
    // This is a placeholder - the actual implementation will depend on how auth is passed
    const storedToken = localStorage.getItem("middleware_api_token");
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  const searchAPI = useCallback(async (query: string, type: "agent" | "listing" | "market-data") => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Cancel any existing search request
    if (searchControllerRef.current) {
      searchControllerRef.current.abort();
    }

    const controller = new AbortController();
    searchControllerRef.current = controller;

    setSearching(true);
    try {
      let endpoint = "";
      if (type === "agent") {
        endpoint = `/agent/list?search=${encodeURIComponent(query)}`;
      } else if (type === "listing") {
        endpoint = `/api/listing/search?search=${encodeURIComponent(query)}`;
      } else if (type === "market-data") {
        endpoint = `/market/search?search=${encodeURIComponent(query)}`;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "GET",
        signal: controller.signal,
        headers,
      });

      if (controller.signal.aborted) return;

      if (!response.ok) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      const data = await response.json();
      let resultArray: Record<string, unknown>[] = [];

      // Handle different response structures
      if (data?.result && Array.isArray(data.result)) {
        resultArray = data.result;
      } else if (data?.response && Array.isArray(data.response)) {
        resultArray = data.response;
      }

      // Transform results based on type
      const results: SearchResult[] = resultArray.map((item, index) => {
        if (type === "agent") {
          const name = (item.name as string) || (item.displayName as string) || "Unknown Agent";
          const email = (item.email as string) || (item.emailAddress as string) || "";
          return {
            id: email || `agent-${index}`,
            displayValue: name,
            secondaryValue: email,
          };
        } else if (type === "listing") {
          const id = (item.external_id as string) || (item.id as string) || `listing-${index}`;
          const address = (item.address as string) || "Unknown Address";
          const status = (item.status as string) || "";
          return {
            id,
            displayValue: address,
            secondaryValue: status,
          };
        } else {
          const suburbPostcode = (item.suburbpostcode as string) || "";
          return {
            id: suburbPostcode || `location-${index}`,
            displayValue: suburbPostcode,
          };
        }
      });

      if (!controller.signal.aborted) {
        setSearchResults(results);
        setShowResults(true);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error("Search error:", err);
        setSearchResults([]);
        setShowResults(false);
      }
    } finally {
      if (!controller.signal.aborted) {
        setSearching(false);
      }
    }
  }, [authToken, baseUrl]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchAPI(value, dataType);
    }, 300);
  }, [searchAPI, dataType]);

  const handleItemSelect = useCallback((item: SearchResult) => {
    setSelectedItem(item);
    setSearchQuery(item.displayValue);
    setShowResults(false);
    setSearchResults([]);
  }, []);

  const handleDataTypeChange = useCallback((value: string) => {
    setDataType(value as "agent" | "listing" | "market-data");
    setSelectedItem(null);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setSelectedFields([]);
  }, []);

  // Load data and update the data reference
  const loadData = async () => {
    if (!selectedItem) {
      setError("Please select an item first");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Build the data source config
      const config: DataSourceConfig = {
        dataType,
        selectedFields: selectedFields.length > 0 ? selectedFields : undefined,
      };

      // Set the appropriate ID based on data type
      if (dataType === "agent") {
        config.agentEmail = selectedItem.id;
      } else if (dataType === "listing") {
        config.listingId = selectedItem.id;
      } else if (dataType === "market-data") {
        config.suburbPostcode = selectedItem.id;
      }

      // Get title based on data type
      let title = "";
      if (dataType === "agent") {
        title = `Agent: ${selectedItem.displayValue}`;
      } else if (dataType === "listing") {
        title = `Listing: ${selectedItem.displayValue}`;
      } else {
        title = `Market Data: ${selectedItem.displayValue}`;
      }

      const result = await request.updateDataRef({
        source: JSON.stringify(config),
        title,
      });

      if (result.status === "completed") {
        setSuccess(true);
      } else {
        setError(
          result.status === "app_error" && "message" in result
            ? result.message || "An error occurred"
            : `Error: ${result.status}`
        );
      }
    } catch {
      setError("Failed to update data");
    } finally {
      setLoading(false);
    }
  };

  const availableFields = getAvailableFields(dataType);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title size="large">Data Autofill</Title>

        {error && <Alert tone="critical" title={error} />}
        {success && (
          <Alert tone="positive" title="Data preview loaded successfully!" />
        )}

        <Text>
          Select data from your agency to autofill into your Canva designs.
        </Text>

        {/* Data Type Selection */}
        <FormField
          label="Data Type"
          value={dataType}
          control={(props) => (
            <Select
              {...props}
              value={dataType}
              onChange={handleDataTypeChange}
              options={[
                { value: "agent", label: "Agent Profile" },
                { value: "listing", label: "Property Listing" },
                { value: "market-data", label: "Market Data" },
              ]}
              stretch
            />
          )}
        />

        {/* Search Input */}
        <FormField
          label={
            dataType === "agent"
              ? "Search Agents"
              : dataType === "listing"
              ? "Search Listings"
              : "Search Suburb/Postcode"
          }
          control={() => (
            <SearchInputMenu
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={() => {
                setSearchQuery("");
                setSelectedItem(null);
                setSearchResults([]);
                setShowResults(false);
              }}
              placeholder={
                dataType === "agent"
                  ? "Search by name or email..."
                  : dataType === "listing"
                  ? "Search by address..."
                  : "Search suburb or postcode..."
              }
              ariaLabel={`Search ${dataType}`}
              onOutsidePointerDown={() => setShowResults(false)}
            >
              {showResults && searchResults.length > 0 && (
                <Menu ariaLabel="Search results">
                  {searchResults.map((result) => (
                    <MenuItem
                      key={result.id}
                      label={result.displayValue}
                      description={result.secondaryValue}
                      onClick={() => handleItemSelect(result)}
                    />
                  ))}
                </Menu>
              )}
            </SearchInputMenu>
          )}
        />

        {searching && (
          <Rows spacing="1u" align="center">
            <LoadingIndicator size="small" />
            <Text size="small">Searching...</Text>
          </Rows>
        )}

        {/* Selected Item Display */}
        {selectedItem && (
          <Box background="neutralLow" padding="2u" borderRadius="standard">
            <Rows spacing="1u">
              <Text variant="bold">Selected:</Text>
              <Text>{selectedItem.displayValue}</Text>
              {selectedItem.secondaryValue && (
                <Text size="small" tone="tertiary">{selectedItem.secondaryValue}</Text>
              )}
            </Rows>
          </Box>
        )}

        {/* Field Selection */}
        {selectedItem && availableFields.length > 0 && (
          <FormField
            label="Fields to Include (optional)"
            description="Leave empty to include all available fields"
            control={(props) => (
              <CheckboxGroup
                {...props}
                value={selectedFields}
                options={availableFields.map((field) => ({
                  label: field.label,
                  value: field.key,
                }))}
                onChange={setSelectedFields}
              />
            )}
          />
        )}

        {/* Load Data Button */}
        <Button
          variant="primary"
          onClick={loadData}
          loading={loading}
          disabled={!selectedItem}
          stretch
        >
          Load Data
        </Button>
      </Rows>
    </div>
  );
};
