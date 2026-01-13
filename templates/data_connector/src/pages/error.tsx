import { Button, Rows, Text } from "@canva/app-ui-kit";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { Paths } from "src/routes/paths";
import * as styles from "styles/components.css";

/**
 * Bare bones Error Page, please add relevant information and behavior that your app requires.
 */
export const ErrorPage = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const onClick = () => {
    navigate(Paths.ENTRYPOINT);
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          <FormattedMessage
            defaultMessage="Something went wrong."
            description="A message to indicate that something went wrong, but no more information is available"
          />
        </Text>
        <Button variant="primary" onClick={onClick} stretch={true}>
          {intl.formatMessage({
            defaultMessage: "Start over",
            description:
              "A button label to clear the error and the prompt and start again",
          })}
        </Button>
      </Rows>
    </div>
  );
};
