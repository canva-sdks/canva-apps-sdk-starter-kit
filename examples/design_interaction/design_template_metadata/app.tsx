// For usage information, see the README.md file.
import {
  Button,
  Rows,
  FormField,
  Text,
  MultilineInput,
} from "@canva/app-ui-kit";
import {
  getDesignTemplateMetadata,
  type DesignTemplateMetadata,
} from "@canva/design";
import * as styles from "styles/components.css";
import React, { useState } from "react";

export const App = () => {
  // Creates state to store design template metadata
  const [designTemplateMetadata, setDesignTemplateMetadata] = useState<
    DesignTemplateMetadata | undefined
  >();

  // The getDesignTemplateMetadata function returns template metadata for the templates used in the design.
  // This includes keywords and template domain.
  const getDesignTemplateInfo = React.useCallback(async () => {
    const response = await getDesignTemplateMetadata();

    setDesignTemplateMetadata(response);
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can retrieve template metadata for
          the template that is being used by the design.
        </Text>
        <Button variant="primary" onClick={getDesignTemplateInfo}>
          Get design template metadata
        </Button>

        {/* Display the template metadata as formatted JSON */}
        <FormField
          label="Design template metadata"
          value={JSON.stringify(designTemplateMetadata, null, 2)}
          control={(props) => (
            <MultilineInput {...props} maxRows={12} autoGrow readOnly />
          )}
        />
      </Rows>
    </div>
  );
};
