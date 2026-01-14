import { Box, Rows } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { DATA_SOURCES } from "src/api/data_sources";
import { Footer, Header } from "src/components";

export const SelectSource = () => {
  const intl = useIntl();

  return (
    <Box paddingEnd="2u" paddingTop="2u">
      <Rows spacing="1u" align="start">
        <Header
          title={intl.formatMessage({
            defaultMessage: "What would you like to import? ",
            description: "The header text for the data source selection view",
          })}
          showBack={false}
        />
        {DATA_SOURCES.map((handler) => handler.selectionPage())}
        <Footer />
      </Rows>
    </Box>
  );
};
