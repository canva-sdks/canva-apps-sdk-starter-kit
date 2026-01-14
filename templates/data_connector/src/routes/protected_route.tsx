import type { ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Paths } from "src/routes/paths";
import { useAppContext } from "../context";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * A component that protects routes from unauthorized access.
 * If the user is not authenticated, they will be redirected to the login page.
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(Paths.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  return <>{children}</>;
};
