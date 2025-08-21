import { createRoot } from "react-dom/client";
import { App } from "./app";
import "@canva/app-ui-kit/styles.css";
import { AppUiProvider } from "@canva/app-ui-kit";
import { addElementAtPoint } from "@canva/design";

const root = createRoot(document.getElementById("root") as Element);
function render() {
  root.render(
    <AppUiProvider>
      {/* Any Apps SDK method needs to be injected to the component, to avoid the need to mock it in tests */}
      <App
        onClick={() =>
          addElementAtPoint({
            type: "text",
            children: ["Hello world!"],
          })
        }
      />
    </AppUiProvider>,
  );
}

render();

if (module.hot) {
  module.hot.accept("./app", render);
}
