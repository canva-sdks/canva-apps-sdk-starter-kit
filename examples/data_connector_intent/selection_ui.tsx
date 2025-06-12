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

  // handle the invocation context to respond to how the app was loaded
  // there may be an existing data source to load or an error to display
  useEffect(() => {
    const { reason } = request.invocationContext;
    switch (reason) {
      case "data_selection":
        // If there's an existing selection, pre-populate the UI
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
        // data source reference persisted in Canva is outdated. Prompt users to reselect data.
        setError(
          "Your previously selected data is no longer available. Please make a new selection.",
        );
        break;
      case "app_error":
        setError(
          request.invocationContext.message ||
            "An error occurred with your data",
        );
        break;
      default:
        // this should never happen
        break;
    }
  }, [request.invocationContext]);

  // use updateDataRef to set the new query config
  // this will trigger the getDataTable callback for this connector
  const loadData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
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
          Total construction project sales in each release stage
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
            Load Data
          </Button>
        </Rows>
      </Rows>
    </div>
  );
};
