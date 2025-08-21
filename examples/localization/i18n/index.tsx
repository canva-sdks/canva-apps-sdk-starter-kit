import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "@canva/app-ui-kit/styles.css";
import { AppI18nProvider } from "@canva/app-i18n-kit";
import { requestOpenExternalUrl } from "@canva/platform";

const root = createRoot(document.getElementById("root") as Element);
function render() {
  root.render(
    <AppI18nProvider>
      <AppUiProvider>
        {/* Any Apps SDK method needs to be injected to the component, to avoid the need to mock it in tests */}
        <App requestOpenExternalUrl={requestOpenExternalUrl} />
      </AppUiProvider>
    </AppI18nProvider>,
  );
}

render();

if (module.hot) {
  module.hot.accept("./app", render);
}
