import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "shared/libs/authHelpers";
import PropTypes from "prop-types";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/authentication/sign-in" replace state={{ from: location }} />;
  }

  return children;
}

ProtectedRoute.propTypes = { children: PropTypes.any };
