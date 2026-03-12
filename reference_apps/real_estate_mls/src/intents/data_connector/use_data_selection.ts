/**
 * State management hook for the Data Connector selection UI.
 *
 * Handles the full lifecycle of a data selection:
 *  1. Restores previous selections from `invocationContext` (Canva
 *     passes this when the user re-opens the selection UI).
 *  2. Tracks the user's filter choices in local state.
 *  3. Calls `updateDataRef` to serialize the selection and kick off
 *     Bulk Create — Canva fetches the data table via `getDataTable`
 *     and generates one design per row.
 *
 * The `invocationContext.reason` tells us why the selection UI was
 * opened — it could be a fresh selection, a refresh of stale data,
 * or a retry after a previous error.
 *
 * @see https://www.canva.dev/docs/apps/data-connector/
 */
import type { RenderSelectionUiRequest } from "@canva/intents/data";
import { useEffect, useState } from "react";
import type { IntlShape } from "react-intl";
import { useIntl } from "react-intl";
import type { ListingsDataConfig } from "./data_table";

const REASON_DATA_SELECTION = "data_selection";
const REASON_OUTDATED_SOURCE_REF = "outdated_source_ref";
const REASON_APP_ERROR = "app_error";

type SelectionState = {
  propertyTypes: string[];
  error: string | null;
  loading: boolean;
  success: boolean;
};

// Maps the invocationContext reason to an initial state patch. Canva
// tells us why the selection UI was opened so we can restore previous
// selections or show the appropriate error message.
function resolveInvocationContext(
  ctx: RenderSelectionUiRequest["invocationContext"],
  intl: IntlShape,
): Partial<SelectionState> | undefined {
  if (ctx.reason === REASON_DATA_SELECTION && ctx.dataSourceRef) {
    try {
      const saved = JSON.parse(ctx.dataSourceRef.source) as ListingsDataConfig;
      return { propertyTypes: saved.propertyTypes ?? [] };
    } catch {
      return {
        error: intl.formatMessage({
          defaultMessage: "Failed to load saved selection",
          description: "Error when saved data connector config is invalid",
        }),
      };
    }
  }

  if (ctx.reason === REASON_OUTDATED_SOURCE_REF) {
    return {
      error: intl.formatMessage({
        defaultMessage:
          "Your previously selected data is no longer available. Please make a new selection.",
        description: "Error when data connector source ref is outdated",
      }),
    };
  }

  if (ctx.reason === REASON_APP_ERROR) {
    return {
      error:
        ctx.message ??
        intl.formatMessage({
          defaultMessage: "An error occurred with your data",
          description: "Generic data connector error message",
        }),
    };
  }
}

export function useDataSelection(request: RenderSelectionUiRequest) {
  const intl = useIntl();
  const [state, setState] = useState<SelectionState>({
    propertyTypes: [],
    error: null,
    loading: false,
    success: false,
  });

  // Reducer-style updater: merges a partial patch into state so callers
  // don't need to spread the previous state at every call site.
  const updateSelection = (patch: Partial<SelectionState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    const patch = resolveInvocationContext(request.invocationContext, intl);
    if (patch) {
      updateSelection(patch);
    }
  }, [request.invocationContext, intl]);

  // Serialize the current selection and send it to Canva via
  // `updateDataRef`. This triggers Canva to call `getDataTable` with
  // the new `dataSourceRef`. The `source` string is opaque to Canva —
  // it's passed back verbatim, so you can store any JSON you need.
  async function loadData() {
    updateSelection({ loading: true, error: null, success: false });
    try {
      const result = await request.updateDataRef({
        source: JSON.stringify({
          propertyTypes: state.propertyTypes,
        } satisfies ListingsDataConfig),
        title: intl.formatMessage({
          defaultMessage: "MLS Property Listings",
          description: "Title for the data connector data source",
        }),
      });
      if (result.status === "completed") {
        updateSelection({ success: true });
      } else {
        const message =
          result.status === "app_error" && "message" in result
            ? result.message
            : null;
        updateSelection({
          error:
            message ??
            intl.formatMessage({
              defaultMessage: "An error occurred",
              description: "Generic error loading data",
            }),
        });
      }
    } catch {
      updateSelection({
        error: intl.formatMessage({
          defaultMessage: "Failed to update data",
          description: "Error when data connector update fails",
        }),
      });
    } finally {
      updateSelection({ loading: false });
    }
  }

  return {
    ...state,
    setPropertyTypes: (propertyTypes: string[]) =>
      updateSelection({ propertyTypes }),
    loadData,
  };
}
