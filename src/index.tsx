import React from "react";
import { createRoot } from "react-dom/client";
import { AppUiProvider } from "@canva/app-ui-kit";
import { AppI18nProvider } from "@canva/app-i18n-kit";
import { prepareDesignEditor } from "@canva/intents/design";
import "@canva/app-ui-kit/styles.css";
import { App } from "./app";

prepareDesignEditor({
  render: async () => {
    const rootElement = document.getElementById("root");
    const rootElementExists = rootElement instanceof Element;

    if (!rootElementExists) {
      throw new Error("Unable to find element with id of 'root'");
    }

    const root = createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <AppI18nProvider>
          <AppUiProvider>
            <App />
          </AppUiProvider>
        </AppI18nProvider>
      </React.StrictMode>,
    );
  },
});
