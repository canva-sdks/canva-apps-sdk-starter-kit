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
  const [designMetadata, setDesignMetadata] = useState<
    DesignMetadata | undefined
  >();

  const getDesignInfo = React.useCallback(async () => {
    const response = await getDesignMetadata();
    setDesignMetadata(response);
  }, [getDesignMetadata]);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can retrieve information about the
          design.
        </Text>
        <Button variant="primary" onClick={getDesignInfo} stretch>
          Get Design Metadata
        </Button>

        <FormField
          label="Design Metadata"
          value={JSON.stringify(designMetadata, null, 2)}
          control={(props) => (
            <MultilineInput {...props} maxRows={12} autoGrow readOnly />
          )}
        />
      </Rows>
    </div>
  );
};
