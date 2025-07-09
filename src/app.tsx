import React from "react";
import { QrWorkflowProvider } from "./hooks/use_qr_workflow";
import { Layout } from "./components/layout";

export function App() {
  return (
    <QrWorkflowProvider>
      <Layout />
    </QrWorkflowProvider>
  );
}
