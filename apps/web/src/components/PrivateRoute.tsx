import { getUser } from '@/api/getUser';
import { useQuery } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardSkeleton } from './skeltons/DashboardSkelton';
import { ACCESS_TOKEN_KEY } from '@/lib/constants';

export default function PrivateRoute({ children }: { children: ReactElement }) {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const { isLoading, data } = useQuery({
    queryFn: getUser,
    queryKey: ['user'],
  });

  if (!token) {
    return <Navigate to="/signin" />;
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data?.user) {
    return <Navigate to="/signin" />;
  }

  return children;
}
