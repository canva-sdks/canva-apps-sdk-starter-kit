import {
  Button,
  FormField,
  MultilineInput,
  Rows,
  Text,
  Title,
} from "@canva/app-ui-kit";
import { auth } from "@canva/user";
import React, { useState } from "react";
import styles from "styles/components.css";

const BACKEND_URL = `${BACKEND_HOST}/custom-route`;

type State = "idle" | "loading" | "success" | "error";

export const App = () => {
  const [state, setState] = useState<State>("idle");
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined
  );

  const sendGetRequest = async () => {
    try {
      setState("loading");
      const token = await auth.getCanvaUserToken();
      const res = await fetch(BACKEND_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const body = await res.json();
      setResponseBody(body);
      setState("success");
    } catch (error) {
      setState("error");
      console.error(error);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can securely communicate with their
          servers via the browser's Fetch API.
        </Text>
        {/* Idle and loading state */}
        {state !== "error" && (
          <>
            <Button
              variant="primary"
              onClick={sendGetRequest}
              loading={state === "loading"}
              stretch
            >
              Send GET request
            </Button>
            {state === "success" && responseBody && (
              <FormField
                label="Response"
                value={JSON.stringify(responseBody, null, 2)}
                control={(props) => (
                  <MultilineInput {...props} maxRows={5} autoGrow readOnly />
                )}
              />
            )}
          </>
        )}

        {/* Error state */}
        {state === "error" && (
          <Rows spacing="3u">
            <Rows spacing="1u">
              <Title size="small">Something went wrong</Title>
              <Text>To see the error, check the JavaScript Console.</Text>
            </Rows>
            <Button
              variant="secondary"
              onClick={() => {
                setState("idle");
              }}
              stretch
            >
              Reset
            </Button>
          </Rows>
        )}
      </Rows>
    </div>
  );
};
