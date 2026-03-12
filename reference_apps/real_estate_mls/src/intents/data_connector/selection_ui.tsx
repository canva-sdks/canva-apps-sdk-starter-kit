import type { RenderSelectionUiRequest } from "@canva/intents/data";
import {
  Alert,
  Box,
  Button,
  CheckboxGroup,
  FormField,
  Rows,
  Scrollable,
  Text,
} from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { propertyTypeOptions } from "./data_table";
import { useDataSelection } from "./use_data_selection";

/**
 * Selection UI for the Data Connector intent.
 *
 * Canva renders this panel so the user can choose which data to turn
 * into designs. The user's choices are serialized into a `dataSourceRef`
 * (via `updateDataRef` in use_data_selection) so Canva can replay
 * `getDataTable` later without showing this UI again.
 *
 * TODO: Replace the checkbox filter with controls that match your
 * data source (e.g. search, date range, category picker).
 *
 * @see https://www.canva.dev/docs/apps/data-connector/
 */
export const SelectionUi = (request: RenderSelectionUiRequest) => {
  const intl = useIntl();
  const { propertyTypes, setPropertyTypes, error, loading, success, loadData } =
    useDataSelection(request);

  return (
    <Scrollable>
      <Box paddingY="2u">
        <Rows spacing="3u">
          <Text size="small" tone="tertiary">
            {intl.formatMessage({
              defaultMessage:
                "Select which property types to include in your design.",
              description: "Helper text for the data connector selection UI",
            })}
          </Text>
          {error && <Alert tone="critical" title={error} />}
          {success && (
            <Alert
              tone="positive"
              title={intl.formatMessage({
                defaultMessage: "Data loaded successfully",
                description: "Success message after loading data",
              })}
            />
          )}
          <FormField
            label={intl.formatMessage({
              defaultMessage: "Property type",
              description: "Label for property type filter",
            })}
            control={(props) => (
              <CheckboxGroup
                {...props}
                value={propertyTypes}
                options={propertyTypeOptions.map((type) => ({
                  label: type,
                  value: type,
                }))}
                onChange={setPropertyTypes}
              />
            )}
          />
          <Button
            variant="primary"
            onClick={loadData}
            loading={loading}
            stretch
          >
            {intl.formatMessage({
              defaultMessage: "Load data",
              description: "Button label to load listing data",
            })}
          </Button>
        </Rows>
      </Box>
    </Scrollable>
  );
};
