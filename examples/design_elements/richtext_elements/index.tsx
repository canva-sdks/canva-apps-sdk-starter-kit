// For usage information, see the README.md file.
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "@canva/app-ui-kit/styles.css";
import { AppUiProvider } from "@canva/app-ui-kit";

const root = createRoot(document.getElementById("root") as Element);
function render() {
  root.render(
    <AppUiProvider>
      <App />
    </AppUiProvider>,
  );
}

render();

// Hot Module Replacement for development (automatically reloads the app when changes are made)
if (module.hot) {
  module.hot.accept("./app", render);
}
