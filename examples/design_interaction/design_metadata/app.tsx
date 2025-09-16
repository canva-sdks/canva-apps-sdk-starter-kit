// For usage information, see the README.md file.
import {
  Button,
  FormField,
  MultilineInput,
  Rows,
  Text,
} from "@canva/app-ui-kit";

import type { DesignMetadata } from "@canva/design";
import { getDesignMetadata } from "@canva/design";

import * as styles from "styles/components.css";
import React, { useState } from "react";

export const App = () => {
  // State to store the design metadata retrieved from the Canva Design API
  const [designMetadata, setDesignMetadata] = useState<
    DesignMetadata | undefined
  >();

  // Function to fetch design metadata using the Canva Design API
  const getDesignInfo = React.useCallback(async () => {
    // The getDesignMetadata function returns metadata about the current design
    // including title, dimensions, page count, and other properties
    const response = await getDesignMetadata();
    setDesignMetadata(response);
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can retrieve information about the
          design.
        </Text>
        <Button variant="primary" onClick={getDesignInfo} stretch>
          Get design metadata
        </Button>

        {/* Display the design metadata as formatted JSON */}
        <FormField
          label="Design metadata"
          value={JSON.stringify(designMetadata, null, 2)}
          control={(props) => (
            <MultilineInput {...props} maxRows={12} autoGrow readOnly />
          )}
        />
      </Rows>
    </div>
  );
};
