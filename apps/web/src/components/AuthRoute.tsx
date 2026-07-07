import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { ACCESS_TOKEN_KEY } from '@/lib/constants';

export default function AuthRoute({ children }: { children: ReactElement }) {
  const isAuthenticated = localStorage.getItem(ACCESS_TOKEN_KEY);
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}
