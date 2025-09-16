// For usage information, see the README.md file.
import { Button, Link, Rows, Text, Title } from "@canva/app-ui-kit";
import { requestOpenExternalUrl } from "@canva/platform";
import * as styles from "styles/components.css";

const DOCS_URL =
  "https://www.canva.dev/docs/apps/api/platform-request-open-external-url/";
const GUIDELINES_URL =
  "https://www.canva.dev/docs/apps/design-guidelines/external-links/";
const ACCEPTING_PAYMENTS_URL =
  "https://www.canva.dev/docs/apps/accepting-payments/";

export const App = () => {
  const openExternalUrl = async (url: string) => {
    // requestOpenExternalUrl requires user consent before opening external URLs
    // This ensures users are aware they're leaving the Canva environment
    const response = await requestOpenExternalUrl({
      url,
    });

    // Handle user consent response - users can abort the navigation
    if (response.status === "aborted") {
      // User decided not to navigate to the external link
      // In production apps, you might want to show feedback or alternative actions
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="1u">
        <Text>
          To learn more about how to open external URLs in your app, head over
          to the{" "}
          {/* Link component with requestOpenExternalUrl prop handles external navigation */}
          <Link
            href={DOCS_URL}
            requestOpenExternalUrl={() => openExternalUrl(DOCS_URL)}
            ariaLabel="Canva Apps SDK docs"
          >
            docs
          </Link>
          .
        </Text>
        <Title>Guidelines</Title>
        <Text>Be sure to check out the guidelines below</Text>
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
