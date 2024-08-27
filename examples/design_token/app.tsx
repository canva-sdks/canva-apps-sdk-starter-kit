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
import { auth } from "@canva/user";
import { getDefaultPageDimensions, getDesignToken } from "@canva/design";

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

  const getDesignData = async () => {
    setState("loading");
    setError(undefined);
    try {
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

  const saveDesignData = async () => {
    setState("loading");
    setError(undefined);
    try {
      const [designToken, authToken, dimensions] = await Promise.all([
        getDesignToken(),
        auth.getCanvaUserToken(),
        getDefaultPageDimensions(),
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
        <MultilineInput autoGrow readOnly value={JSON.stringify(designData)} />
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
