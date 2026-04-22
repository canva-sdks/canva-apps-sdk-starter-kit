// For usage information, see the README.md file.
import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "@canva/app-ui-kit/styles.css";
import { AppI18nProvider } from "@canva/app-i18n-kit";
import type { DesignEditorIntent } from "@canva/intents/design";
import { prepareDesignEditor } from "@canva/intents/design";

async function render() {
  const root = createRoot(document.getElementById("root") as Element);

  root.render(
    <AppI18nProvider>
      <AppUiProvider>
        <App />
      </AppUiProvider>
    </AppI18nProvider>,
  );
}

const designEditor: DesignEditorIntent = { render };
prepareDesignEditor(designEditor);

// Hot Module Replacement for development (automatically reloads the app when changes are made)
if (module.hot) {
  module.hot.accept("./app", render);
}
