import { initAppElement } from "@canva/design";
import {
  Button,
  FormField,
  NumberInput,
  Rows,
  Text,
  TextInput,
} from "@canva/app-ui-kit";
import * as styles from "styles/components.css";
import { useEffect, useState } from "react";

type AppElementData = {
  url: string;
  width: number;
  height: number;
};

type UIState = AppElementData;

const initialState: UIState = {
  url: "https://www.youtube.com/watch?v=o-YBDTqX_ZU",
  width: 640,
  height: 360,
};

const appElementClient = initAppElement<AppElementData>({
  render: (data) => {
    return [{ type: "embed", ...data, top: 0, left: 0 }];
  },
});

export const App = () => {
  const [state, setState] = useState<UIState>(initialState);
  const { url, width, height } = state;
  const disabled = url?.trim().length < 1 || !width || !height;

  useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      setState(appElement ? appElement.data : initialState);
    });
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can create embed elements inside
          app elements. This makes the element re-editable and lets apps control
          additional properties, such as the width and height.
        </Text>
        <FormField
          label="URL"
          value={url}
          control={(props) => (
            <TextInput
              {...props}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    url: value,
                  };
                });
              }}
            />
          )}
        />
        <FormField
          label="Width"
          value={width}
          control={(props) => (
            <NumberInput
              {...props}
              min={1}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    width: Number(value || 0),
                  };
                });
              }}
            />
          )}
        />
        <FormField
          label="Height"
          value={height}
          control={(props) => (
            <NumberInput
              {...props}
              min={1}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    height: Number(value || 0),
                  };
                });
              }}
            />
          )}
        />
        <Button
          variant="primary"
          stretch
          onClick={() => {
            appElementClient.addOrUpdateElement(state);
          }}
          disabled={disabled}
        >
          Add or update element
        </Button>
      </Rows>
    </div>
  );
};
