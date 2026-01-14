import "@canva/app-ui-kit/styles.css";
import type { DesignEditorIntent } from "@canva/intents/design";
import { createRoot } from "react-dom/client";
import { App } from "./app";

async function render() {
  const root = createRoot(document.getElementById("root") as Element);

  root.render(<App />);
}

const designEditor: DesignEditorIntent = { render };
export default designEditor;

if (module.hot) {
  module.hot.accept("./app", render);
}
