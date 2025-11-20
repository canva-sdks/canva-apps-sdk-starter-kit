import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { prepareDesignEditor } from "@canva/intents/design";
import { App } from "./app";
import "@canva/app-ui-kit/styles.css";
import { AppI18nProvider } from "@canva/app-i18n-kit";

prepareDesignEditor({
  render: async () => {
    const rootElement = document.getElementById("root");
    if (!(rootElement instanceof Element)) {
      throw new Error("Unable to find root element");
    }

    const root = createRoot(rootElement);

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

    if (module.hot) {
      module.hot.accept("./app", render);
    }
  },
});
