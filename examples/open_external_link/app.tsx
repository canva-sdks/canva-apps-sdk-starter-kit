import { Button, Link, Rows, Text, Title } from "@canva/app-ui-kit";
import { requestOpenExternalUrl } from "@canva/platform";
import React from "react";
import styles from "styles/components.css";

const DOCS_URL =
  "https://www.canva.dev/docs/apps/api/platform-request-open-external-url/";
const GUIDELINES_URL =
  "https://www.canva.dev/docs/apps/design-guidelines/external-links/";
const ACCEPTING_PAYMENTS_URL =
  "https://www.canva.dev/docs/apps/accepting-payments/";

export const App = () => {
  const openExternalUrl = async (url: string) => {
    const response = await requestOpenExternalUrl({
      url,
    });

    if (response.status === "ABORTED") {
      // user decided not to navigate to the link
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="1u">
        <Text>
          To learn more about how to open external URLs in your app, head over
          to the{" "}
          <Link
            href={DOCS_URL}
            requestOpenExternalUrl={() => openExternalUrl(DOCS_URL)}
            title="Canva Apps SDK docs"
          >
            docs
          </Link>
          .
        </Text>
        <Title>Guidelines:</Title>
        <Text>Be sure to checkout the below guidelines</Text>
        <Button
          variant="secondary"
          onClick={() => openExternalUrl(GUIDELINES_URL)}
        >
          Design Guidelines
        </Button>
        <Button
          variant="secondary"
          onClick={() => openExternalUrl(ACCEPTING_PAYMENTS_URL)}
        >
          Payment links
        </Button>
      </Rows>
    </div>
  );
};
