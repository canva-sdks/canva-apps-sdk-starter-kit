import { selection as designSelection } from "@canva/design";
import { SelectionEvent, SelectionScope } from "@canva/design";
import React from "react";

/**
 * Returns a selection event, representing a user selection of the specified content type. The
 * event contains methods to read a snapshot of the selected content, and optionally mutate it.
 * This is a reactive value. Calling this multiple times will return different instances
 * representing the same selection.
 * @param scope The type of content to listen for selection changes on
 */
export function useSelection<S extends SelectionScope>(
  scope: S
): SelectionEvent<S> {
  const [selection, setSelection] = React.useState<SelectionEvent<S>>({
    scope,
    count: 0,
    read() {
      return Promise.resolve({
        contents: Object.freeze([]),
        save() {
          return Promise.resolve();
        },
      });
    },
  });

  React.useEffect(() => {
    const disposer = designSelection.registerOnChange({
      scope,
      onChange: setSelection,
    });
    return disposer;
  }, [scope]);

  return selection;
}
