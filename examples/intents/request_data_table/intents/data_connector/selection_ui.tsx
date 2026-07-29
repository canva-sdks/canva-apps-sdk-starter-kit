// For usage information, see the README.md file.
import { Alert, Button, Rows, Text, Title } from "@canva/app-ui-kit";
import type { RenderSelectionUiRequest } from "@canva/intents/data";
import { useState } from "react";
import * as styles from "styles/components.css";
import { TEAM_MEMBERS } from "../../data";

const TEAM_DATA_SOURCE_REF = {
  source: "team_members",
  title: "Team members",
};

export function SelectionUI({ updateDataRef }: RenderSelectionUiRequest) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadData = async () => {
    setIsLoading(true);
    setError(null);
    const result = await updateDataRef(TEAM_DATA_SOURCE_REF);
    if (result.status !== "completed") {
      setError("Failed to load data.");
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title>Team directory</Title>
        <Text>
          A fixed set of {TEAM_MEMBERS.length} team members. Loading them makes
          this table available to `requestDataTable` in the design editor.
        </Text>
        <Button
          variant="primary"
          onClick={handleLoadData}
          loading={isLoading}
          stretch
        >
          Load team data
        </Button>
        {error && <Alert tone="critical">{error}</Alert>}
      </Rows>
    </div>
  );
}
