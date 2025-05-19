import type {
  RenderSelectionUiParams,
  UpdateDataRefResult,
} from "@canva/intents/data";
import {
  Alert,
  Button,
  Rows,
  Text,
  CheckboxGroup,
  FormField,
  Title,
} from "@canva/app-ui-kit";
import type { AlertProps } from "@canva/app-ui-kit/dist/cjs/ui/apps/developing/ui_kit/components/alert/alert";
import { useEffect, useState } from "react";
import * as styles from "styles/components.css";
import { suburbOptions, type RealEstateDataConfig } from "./data";

export const DataSelectionUI = (props: RenderSelectionUiParams) => {
  const [dataRef, setDataRef] = useState<RealEstateDataConfig>();
  const [result, setResult] = useState<UpdateDataRefResult>();
  const [loading, setLoading] = useState<boolean>(false);
  const alertProps = getAlertProps(result);

  // handle the invocation context to respond to how the app was loaded
  // there may be an existing data source to load or an error to display
  useEffect(() => {
    const { reason } = props.invocationContext;
    switch (reason) {
      case "data_selection":
        if (props.invocationContext.dataSourceRef != null) {
          setDataRef(JSON.parse(props.invocationContext.dataSourceRef.source));
        }
        break;
      case "outdated_source_ref":
        // data source reference persisted in Canva is outdated. Prompt users to reselect data.
        setResult({
          status: "app_error",
          message: "Data source reference is outdated. Please reselect data.",
        });
        break;
      case "app_error":
        setResult({
          status: "app_error",
          message: props.invocationContext.message,
        });
        break;
      default:
        // this should never happen
        break;
    }
  }, [props.invocationContext]);

  // use updateDataRef to set the new query config
  // this will trigger the fetchDataTable callback for this connector
  const loadData = async () => {
    let result: UpdateDataRefResult;
    setLoading(true);
    const dataRefString = JSON.stringify(dataRef);
    if (dataRef) {
      result = await props.updateDataRef({
        source: dataRefString,
      });
    } else {
      result = await props.updateDataRef({
        source: "app_error",
      });
    }
    setResult(result);
    setLoading(false);
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title size="large">Recent Sales</Title>
        <Text variant="bold">Sydney property sales for last year</Text>
        <Rows spacing="1u">
          <FormField
            label="Suburb"
            control={(props) => (
              <CheckboxGroup
                id={props.id}
                value={dataRef?.selectedSuburbFilter}
                options={suburbOptions.map((suburb) => {
                  return {
                    label: suburb,
                    value: suburb,
                  };
                })}
                onChange={(value) => {
                  setDataRef((prev) => {
                    return {
                      ...(prev != null ? prev : {}),
                      selectedSuburbFilter: value.sort(),
                    };
                  });
                }}
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
        {alertProps != null && !loading && <Alert {...alertProps} />}
      </Rows>
    </div>
  );
};

function getAlertProps(result?: UpdateDataRefResult): AlertProps | null {
  if (!result) {
    return null;
  }

  if (result.status === "completed") {
    return {
      tone: "positive",
      title: "Done!",
    };
  }

  let title = result.status;
  if (result.status === "app_error" && result.message) {
    title += `:${result.message}`;
  }

  return {
    title,
    tone: "critical",
  };
}
