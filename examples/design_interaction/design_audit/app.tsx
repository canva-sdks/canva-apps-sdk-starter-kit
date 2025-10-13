// For usage information, see the README.md file.
import { Alert, Button, Rows, Text } from "@canva/app-ui-kit";
import { openDesign, type DesignEditing } from "@canva/design";
import { useState } from "react";
import * as styles from "styles/components.css";

type FixResult = {
  totalElementsFixed: number; // Total number of elements that were repositioned
  totalPagesModified: number; // Total number of pages that had at least one element modified
};

type AppState = {
  isLoading: boolean; // Whether we're currently processing the design
  lastFixResult?: FixResult; // Results from the last fix operation, undefined if never run
  errorMessage?: string; // Error message from the last operation, undefined if no error
};

const SAFE_DISTANCE = 100; // Minimum safe distance from page edges in pixels

const initialState: AppState = {
  isLoading: false,
};

export const App = () => {
  const [state, setState] = useState<AppState>(initialState);

  // Helper function to check if an element is too close to page edges and fix its position
  const checkAndFixElement = (
    element: DesignEditing.AbsoluteElement, // The element to check and potentially fix
    pageDimensions: { width: number; height: number } | undefined, // The page's dimensions
  ): boolean => {
    // Skip unsupported element types that can't be positioned
    if (element.type === "unsupported") {
      return false;
    }

    // Skip pages with unbounded dimensions (like whiteboards)
    // Pages with unbounded dimensions don't have a dimensions property
    if (!pageDimensions) {
      return false;
    }

    // Calculate how far the element is from each edge of the page
    const distanceFromRight =
      pageDimensions.width - (element.left + element.width);
    const distanceFromBottom =
      pageDimensions.height - (element.top + element.height);

    let wasFixed = false;

    // Fix the position by moving element to minimum safe distance from edges
    // Note: We can directly modify element properties - changes will be applied when session.sync() is called

    // Fix top/bottom positioning
    if (element.top < SAFE_DISTANCE) {
      element.top = SAFE_DISTANCE;
      wasFixed = true;
    } else if (distanceFromBottom < SAFE_DISTANCE) {
      element.top = pageDimensions.height - element.height - SAFE_DISTANCE;
      wasFixed = true;
    }

    // Fix left/right positioning
    if (element.left < SAFE_DISTANCE) {
      element.left = SAFE_DISTANCE;
      wasFixed = true;
    } else if (distanceFromRight < SAFE_DISTANCE) {
      element.left = pageDimensions.width - element.width - SAFE_DISTANCE;
      wasFixed = true;
    }

    // Return whether the element needed fixing
    return wasFixed;
  };

  // Main function demonstrating multi-page design editing with openDesign API
  // This showcases the key patterns for working with all pages in a design:
  // 1. Opening design with "all_pages" context
  // 2. Iterating through page refs
  // 3. Opening individual pages for editing
  // 4. Making element modifications
  // 5. Syncing all changes atomically
  const fixPositioningIssues = async () => {
    // Update UI to show we're processing and clear any previous error
    setState((prev) => ({
      ...prev,
      isLoading: true,
      errorMessage: undefined,
    }));

    try {
      // Track our results across all pages
      let totalElementsFixed = 0;
      let totalPagesModified = 0;

      // Open the design with multi-page access
      // The "all_pages" context gives us access to all pages in the design
      // The "all_pages" context is currently in preview and may change
      await openDesign({ type: "all_pages" }, async (session) => {
        // Get refs for all pages in the design
        // session.pageRefs is a List containing basic info about each page
        for (const pageRef of session.pageRefs.toArray()) {
          // Filter out pages we can't or shouldn't edit
          // Only process "absolute" pages (pages with fixed or unbounded dimensions)
          // Skip locked pages as they can't be modified
          if (pageRef.type !== "absolute" || pageRef.locked) {
            continue;
          }

          // Open each individual page for editing
          // session.helpers.openPage gives us access to the page's full content
          await session.helpers.openPage(pageRef, async (pageResult) => {
            let elementsFixedOnPage = 0;

            // Process all elements on the page
            // pageResult.page.elements is a List containing all elements on this page
            pageResult.page.elements.forEach((element) => {
              // Skip locked elements as they can't be modified
              if (element.locked) {
                return;
              }

              // Check and fix the element's position
              if (checkAndFixElement(element, pageResult.page.dimensions)) {
                elementsFixedOnPage++;
              }
            });

            // Track totals
            totalElementsFixed += elementsFixedOnPage;
            if (elementsFixedOnPage > 0) {
              totalPagesModified++;
            }
          });
        }

        // Apply all changes to the live design
        // Changes are only applied when session.sync() is called
        // All modifications across all pages are applied atomically
        await session.sync();
      });

      // Update UI with results
      setState((prev) => ({
        ...prev,
        isLoading: false,
        lastFixResult: { totalElementsFixed, totalPagesModified },
      }));
    } catch (error) {
      // Handle errors gracefully
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        errorMessage,
      }));
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This app automatically fixes elements that are positioned too close to
          the edges of pages.
        </Text>

        <Button
          variant="primary"
          onClick={fixPositioningIssues}
          disabled={state.isLoading}
        >
          Fix element positioning
        </Button>

        {state.lastFixResult && (
          <Alert tone="positive">
            Fixed {state.lastFixResult.totalElementsFixed} element(s) across{" "}
            {state.lastFixResult.totalPagesModified} pages.
          </Alert>
        )}

        {state.errorMessage && (
          <Alert tone="critical">{state.errorMessage}</Alert>
        )}
      </Rows>
    </div>
  );
};
