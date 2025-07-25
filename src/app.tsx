import React from "react";
import { useMicrosoftAuth } from "./hooks/use_microsoft_auth";
import { LoginPage } from "./components/login_page";
import { ProtectedApp } from "./components/protected_app";

export const DOCS_URL = "https://www.canva.dev/docs/apps/";

export const App = () => {
  const { isAuthenticated, loading } = useMicrosoftAuth();

  // Show login page if not authenticated or still loading
  if (!isAuthenticated || loading) {
    return <LoginPage />;
  }

  // Show main app if authenticated
  return <ProtectedApp />;
};
