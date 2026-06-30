import { Navigate, Outlet, useOutletContext } from "react-router-dom";

export const ProtectedRoute = () => {
  const context = useOutletContext();

  if (!context || !context.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={context} />;
};

