import { Rows, FormField, Button, Slider } from "@canva/app-ui-kit";
import * as React from "react";
import styles from "styles/components.css";
import { appProcess } from "@canva/platform";
import { useOverlay } from "utils/use_overlay_hook";
import { LaunchParams } from "./app";
import type { CloseOpts } from "./overlay";

type UIState = {
  brushSize: number;
};
const initialState: UIState = {
  brushSize: 7,
};

export const ObjectPanel = () => {
  const {
    canOpen,
    isOpen,
    open,
    close: closeOverlay,
  } = useOverlay<"image_selection", CloseOpts>("image_selection");
  const [state, setState] = React.useState<UIState>(initialState);

  const openOverlay = async () => {
    open({
      launchParameters: {
        brushSize: state.brushSize,
      } satisfies LaunchParams,
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        {isOpen ? (
          <>
            <FormField
              label="Brush size"
              value={state.brushSize}
              control={(props) => (
                <Slider
                  {...props}
                  defaultValue={initialState.brushSize}
                  min={5}
                  max={20}
                  step={1}
                  value={state.brushSize}
                  onChange={(value) =>
                    setState((prevState) => {
                      return {
                        ...prevState,
                        brushSize: value,
                      };
                    })
                  }
                  onChangeComplete={(_, value) =>
                    appProcess.broadcastMessage({
                      ...state,
                      brushSize: value,
                    })
                  }
                />
              )}
            />
            <Button
              variant="primary"
              onClick={() => closeOverlay({ reason: "completed" })}
              stretch
            >
              Save Overlay
            </Button>
            <Button
              variant="primary"
              onClick={() => closeOverlay({ reason: "aborted" })}
              stretch
            >
              Cancel Overlay
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={openOverlay}
              disabled={!canOpen}
              stretch
            >
              Open Overlay
            </Button>
          </>
        )}
      </Rows>
    </div>
  );
};
