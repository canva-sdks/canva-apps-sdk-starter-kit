// For usage information, see the README.md file.
import { Alert, Button, Rows, Text } from "@canva/app-ui-kit";
import { addElementAtPoint } from "@canva/design";
import * as styles from "styles/components.css";
import { useFeatureSupport } from "utils/use_feature_support";

export const App = () => {
  const isSupported = useFeatureSupport();
  // Check if the addElementAtPoint API is supported in the current design type
  // Group elements are not supported in certain design types such as docs
  const isRequiredFeatureSupported = isSupported(addElementAtPoint);

  const handleClick = () => {
    // Group elements allow multiple child elements to be positioned relative to each other
    // and treated as a single unit within the Canva design
    addElementAtPoint({
      type: "group",
      children: [
        {
          // First embed element positioned at the top-left of the group
          type: "embed",
          url: "https://www.youtube.com/watch?v=LLFhKaqnWwk",
          width: 100,
          height: 100,
          top: 0,
          left: 0,
        },
        {
          // Second embed element positioned to the right of the first
          // Child element positions are relative to the group's coordinate system
          type: "embed",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          width: 100,
          height: 100,
          top: 0,
          left: 100,
        },
      ],
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can create groups of elements.
        </Text>
        <Button
          variant="primary"
          onClick={handleClick}
          // GroupElement is not supported in certain design types such as docs.
          disabled={!isRequiredFeatureSupported}
          stretch
        >
          Add group element
        </Button>
        {!isRequiredFeatureSupported && <UnsupportedAlert />}
      </Rows>
    </div>
  );
};

const UnsupportedAlert = () => (
  <Alert tone="warn">
    Sorry, the required features are not supported in the current design.
  </Alert>
);
