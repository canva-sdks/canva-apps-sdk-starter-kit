// For usage information, see the README.md file.

import type { RenderSelectionUiRequest } from "@canva/intents/data";
import {
  Alert,
  Button,
  Rows,
  Text,
  CheckboxGroup,
  FormField,
  Title,
} from "@canva/app-ui-kit";
import { useEffect, useState } from "react";
import * as styles from "styles/components.css";
import { saleStageOptions, type RealEstateDataConfig } from "./data";

export const SelectionUI = (request: RenderSelectionUiRequest) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<string[]>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle different invocation contexts (data selection, errors, outdated references)
  // This determines how to initialize the UI based on why the data connector was opened
  useEffect(() => {
    const { reason } = request.invocationContext;
    switch (reason) {
      case "data_selection":
        // Pre-populate UI with existing data source configuration if available
        if (request.invocationContext.dataSourceRef) {
          try {
            const savedParams = JSON.parse(
              request.invocationContext.dataSourceRef.source,
            ) as RealEstateDataConfig;
            setSelectedStageFilter(savedParams.selectedStageFilter || []);
          } catch {
            setError("Failed to load saved selection");
          }
        }
        break;
      case "outdated_source_ref":
        // The data source reference stored in Canva is no longer valid
        setError(
          "Your previously selected data is no longer available. Please make a new selection.",
        );
        break;
      case "app_error":
        // Display error message from previous data fetch attempt
        setError(
          request.invocationContext.message ||
            "An error occurred with your data",
        );
        break;
      default:
        break;
    }
  }, [request.invocationContext]);

  // Sends the selected data configuration to Canva and triggers data preview
  // This calls the getDataTable function with the current selection
  const loadData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Call Canva's updateDataRef with the current configuration
      const result = await request.updateDataRef({
        source: JSON.stringify({ selectedStageFilter }),
        title: "Sydney construction project sales in each release stage",
      });

      if (result.status === "completed") {
        setSuccess(true);
      } else {
        setError(
          result.status === "app_error" && "message" in result
            ? result.message || "An error occurred"
            : `Error: ${result.status}`,
        );
      }
    } catch {
      setError("Failed to update data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title size="large">Project Sales</Title>
        {error && <Alert tone="critical" title={error} />}
        {success && (
          <Alert tone="positive" title="Data preview loaded successfully!" />
        )}
        <Text variant="bold">
          Sydney construction project sales in each release stage
        </Text>
        <Rows spacing="1u">
          <FormField
            label="Release Stage"
            control={(props) => (
              <CheckboxGroup
                {...props}
                value={selectedStageFilter}
                options={saleStageOptions.map((stage) => {
                  return {
                    label: stage,
                    value: stage,
                  };
                })}
                onChange={setSelectedStageFilter}
              />
            )}
          />
          <Button
            variant="primary"
            onClick={loadData}
            loading={loading}
            stretch
          >
            Load data
          </Button>
        </Rows>
      </Rows>
    </div>
  );
};
