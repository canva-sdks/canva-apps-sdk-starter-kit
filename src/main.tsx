import React from "react";
import { createRoot } from "react-dom/client";
import { AppUiProvider } from "@canva/app-ui-kit";
import { AppI18nProvider } from "@canva/app-i18n-kit";
import "@canva/app-ui-kit/styles.css";
import { App } from "./app";

const root = createRoot(document.getElementById("root") as Element);

function render() {
  root.render(
    <AppI18nProvider>
      <AppUiProvider>
        <App />
      </AppUiProvider>
    </AppI18nProvider>,
  );
}

render();
