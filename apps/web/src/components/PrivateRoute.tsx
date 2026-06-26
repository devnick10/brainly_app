import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }: { children: ReactElement }) {
    const isAuthenticated = localStorage.getItem('token')
    return isAuthenticated ? children : <Navigate to="/signin" />
}


