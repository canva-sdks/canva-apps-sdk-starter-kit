import { Alert } from "@canva/app-ui-kit";
import { useAppContext } from "src/context";

export const AppError = () => {
  const { loadingApp, creditsError, appError, setAppError } = useAppContext();
  if (loadingApp || (!appError && !creditsError)) {
    return null;
  }

  return (
    <Alert
      tone="critical"
      onDismiss={creditsError ? undefined : () => setAppError("")}
    >
      {creditsError || appError}
    </Alert>
  );
};
