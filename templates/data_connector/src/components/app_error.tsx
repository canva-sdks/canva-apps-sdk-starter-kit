import { Alert } from "@canva/app-ui-kit";
import { useAppContext } from "src/context";

export const AppError = () => {
  const { appError, setAppError } = useAppContext();
  if (!appError) {
    return null;
  }

  return (
    <Alert tone="critical" onDismiss={() => setAppError("")}>
      {appError}
    </Alert>
  );
};
