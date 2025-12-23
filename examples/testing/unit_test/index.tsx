import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "@canva/app-ui-kit/styles.css";
import type { DesignEditorIntent } from "@canva/intents/design";
import { prepareDesignEditor } from "@canva/intents/design";

async function render() {
  const root = createRoot(document.getElementById("root") as Element);

  root.render(
    <AppUiProvider>
      <App />
    </AppUiProvider>,
  );
}

const designEditor: DesignEditorIntent = { render };
prepareDesignEditor(designEditor);

// Hot Module Replacement for development (automatically reloads the app when changes are made)
if (module.hot) {
  module.hot.accept("./app", render);
}
