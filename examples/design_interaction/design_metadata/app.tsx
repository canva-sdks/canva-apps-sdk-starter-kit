// For usage information, see the README.md file.
import {
  Button,
  FormField,
  MultilineInput,
  Rows,
  Text,
} from "@canva/app-ui-kit";

import type { DesignMetadata, PageMetadata } from "@canva/design";
import { getCurrentPageMetadata, getDesignMetadata } from "@canva/design";

import * as styles from "styles/components.css";
import React, { useState } from "react";

export const App = () => {
  // State to store the design metadata retrieved from the Canva Design API
  const [designMetadata, setDesignMetadata] = useState<
    DesignMetadata | undefined
  >();
  // State to store metadata for the page the user is currently viewing
  const [currentPageMetadata, setCurrentPageMetadata] = useState<
    PageMetadata | undefined
  >();

  // Function to fetch design metadata using the Canva Design API
  const getDesignInfo = React.useCallback(async () => {
    // The getDesignMetadata function returns metadata about the current design
    // including title, dimensions, and pageMetadata. Absolute pages include a
    // stable id (PageId) that uniquely identifies the page within the design.
    const response = await getDesignMetadata();
    setDesignMetadata(response);
  }, []);

  // Function to fetch metadata for the current page
  const getCurrentPageInfo = React.useCallback(async () => {
    // getCurrentPageMetadata returns metadata for the page the user is on,
    // including a stable id when the page type is "absolute".
    const response = await getCurrentPageMetadata();
    setCurrentPageMetadata(response);
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can retrieve information about the
          design and its pages, including stable page IDs.
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

        <Button variant="primary" onClick={getCurrentPageInfo} stretch>
          Get current page metadata
        </Button>

        {/* Display the current page metadata as formatted JSON */}
        <FormField
          label="Current page metadata"
          value={JSON.stringify(currentPageMetadata, null, 2)}
          control={(props) => (
            <MultilineInput {...props} maxRows={8} autoGrow readOnly />
          )}
        />
      </Rows>
    </div>
  );
};
