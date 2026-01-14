import { Button, Rows } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { useAppContext } from "src/context";

export const Footer = () => {
  const { isAuthenticated, logout } = useAppContext();
  const intl = useIntl();

  return (
    <Rows spacing="1u">
      {isAuthenticated && (
        <Button
          variant="tertiary"
          onClick={async () => {
            logout();
          }}
        >
          {intl.formatMessage({
            defaultMessage: "Log Out",
            description: "Button for logging out of the data source",
          })}
        </Button>
      )}
    </Rows>
  );
};
