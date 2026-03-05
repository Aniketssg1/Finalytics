import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute wraps authenticated-only routes.
 * Redirects to /login if no token is found.
 */
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('userToken');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
