// For usage information, see the README.md file.
import {
  Button,
  FormField,
  MultilineInput,
  Rows,
  Text,
  TextInput,
} from "@canva/app-ui-kit";
import { useState, useEffect } from "react";
import * as styles from "styles/components.css";
// Canva SDKs for accessing user authentication and design metadata
import { auth } from "@canva/user";
import { getDesignMetadata, getDesignToken } from "@canva/design";

// Type definition for design data stored in the backend
type DesignData = {
  title: string;
  defaultDimensions: {
    width: number;
    height: number;
  };
};

export const App = () => {
  const [title, setTitle] = useState("");
  const [state, setState] = useState<"loading" | "idle">("idle");
  const [designData, setDesignData] = useState<DesignData | undefined>();
  const [error, setError] = useState<string | undefined>();

  // Retrieves design data from the backend using design tokens for secure access
  const getDesignData = async () => {
    setState("loading");
    setError(undefined);
    try {
      // Get both design token and user authentication token from Canva
      // Design tokens provide secure access to design-specific data
      // User tokens authenticate the current user
      const [designToken, authToken] = await Promise.all([
        getDesignToken(),
        auth.getCanvaUserToken(),
      ]);
      const response = await fetch(
        `${BACKEND_HOST}/design/${designToken.token}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      return response.json();
    } catch {
      setError("Failed to get design data from server.");
    } finally {
      setState("idle");
    }
  };

  // Saves design data to the backend using tokens and metadata from Canva
  const saveDesignData = async () => {
    setState("loading");
    setError(undefined);
    try {
      // Collect design token, user token, and current design metadata
      // getDesignMetadata() provides access to design properties like dimensions
      const [designToken, authToken, { defaultPageDimensions: dimensions }] =
        await Promise.all([
          getDesignToken(),
          auth.getCanvaUserToken(),
          getDesignMetadata(),
        ]);

      await fetch(`${BACKEND_HOST}/design/${designToken.token}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          designData: {
            title,
            dimensions,
          },
        }),
      });

      await refreshDesignData();
    } catch {
      setError("Failed to save design data to server.");
    } finally {
      setState("idle");
    }
  };

  const refreshDesignData = () => getDesignData().then(setDesignData);

  useEffect(() => {
    refreshDesignData();
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can use design tokens to save and
          retrieve data on a per-design basis.
        </Text>
        <Text>Data stored for this design:</Text>
        <MultilineInput
          autoGrow
          readOnly
          value={JSON.stringify(designData, null, 2)}
        />
        <Button
          loading={state === "loading"}
          disabled={state === "loading"}
          variant="primary"
          onClick={refreshDesignData}
        >
          Refresh
        </Button>
        <FormField
          control={(props) => <TextInput {...props} onChange={setTitle} />}
          label="Title"
        />
        <Button
          loading={state === "loading"}
          disabled={state === "loading"}
          variant="primary"
          onClick={saveDesignData}
        >
          Save
        </Button>
        {error && <Text tone="critical">{error}</Text>}
      </Rows>
    </div>
  );
};
