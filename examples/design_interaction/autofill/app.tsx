// For usage information, see the README.md file.
import {
  Alert,
  Button,
  LoadingIndicator,
  Rows,
  Text,
  Title,
} from "@canva/app-ui-kit";
import type { DataField } from "@canva/design";
import {
  autofillDesign,
  getDesignMetadata,
  requestDataFieldMatching,
} from "@canva/design";
import { useCallback, useEffect, useState } from "react";
import * as styles from "styles/components.css";
import { buildDataTable, TEAM_MEMBERS } from "./data";

type Message = {
  text: string;
  tone: "positive" | "critical" | "warn";
};

export function App() {
  const [datasetFields, setDatasetFields] = useState<DataField[]>([]);
  const [isLoadingDataset, setIsLoadingDataset] = useState(true);
  const [isMatching, setIsMatching] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  // Fields tagged for Autofill can change while this panel stays open (the user
  // tags/untags fields, or runs field matching), so re-read them rather than
  // trusting a one-time snapshot.
  const refreshDatasetFields = useCallback(async () => {
    try {
      const metadata = await getDesignMetadata();
      setDatasetFields(metadata.dataset ?? []);
    } finally {
      setIsLoadingDataset(false);
    }
  }, []);

  useEffect(() => {
    void refreshDatasetFields();
  }, [refreshDatasetFields]);

  const handleMatchFields = async () => {
    setIsMatching(true);
    setMessage(null);
    try {
      // Offers this example's field labels as sample data the user can match
      // against tagged elements in the design.
      await requestDataFieldMatching({
        sampleData: buildDataTable(TEAM_MEMBERS),
      });
      await refreshDatasetFields();
      setMessage({ text: "Field matching updated.", tone: "positive" });
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Field matching failed.",
        tone: "critical",
      });
    } finally {
      setIsMatching(false);
    }
  };

  const handleAutofill = async () => {
    setIsAutofilling(true);
    setMessage(null);
    try {
      const response = await autofillDesign({
        dataTable: buildDataTable(TEAM_MEMBERS),
      });
      if (response.status === "success") {
        setMessage({
          text: "Design autofilled successfully!",
          tone: "positive",
        });
      } else {
        setMessage({
          text: "No fields in this design are tagged for Autofill. Tag fields using the design's Autofill panel, then try again.",
          tone: "warn",
        });
      }
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Autofill failed.",
        tone: "critical",
      });
    } finally {
      setIsAutofilling(false);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title>Autofill</Title>
        <Text>
          Match this app's data fields against the design's tagged elements,
          then autofill the design with a hardcoded data table.
        </Text>

        {isLoadingDataset ? (
          <LoadingIndicator size="small" />
        ) : datasetFields.length === 0 ? (
          <Text tone="secondary">
            No fields are tagged for Autofill in this design yet.
          </Text>
        ) : (
          <Rows spacing="0.5u">
            <Text size="small" tone="secondary">
              Tagged fields:
            </Text>
            {datasetFields.map((field) => (
              <Text key={field.label} size="small">
                {`• ${field.label} (${field.type})`}
              </Text>
            ))}
          </Rows>
        )}

        <Button
          variant="secondary"
          onClick={handleMatchFields}
          loading={isMatching}
          stretch
        >
          Match data fields
        </Button>

        <Button
          variant="primary"
          onClick={handleAutofill}
          loading={isAutofilling}
          stretch
        >
          Autofill design
        </Button>

        {message && <Alert tone={message.tone}>{message.text}</Alert>}
      </Rows>
    </div>
  );
}
