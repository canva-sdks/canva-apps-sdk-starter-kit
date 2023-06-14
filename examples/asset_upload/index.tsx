import * as React from "react";
import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import "@canva/app-ui-kit/styles.css";

import { App } from "./app";

const root = createRoot(document.getElementById("root")!);
function render() {
  root.render(
    <AppUiProvider>
      <App />
    </AppUiProvider>
  );
}

render();

if (module.hot) {
  module.hot.accept("./app", render);
}
