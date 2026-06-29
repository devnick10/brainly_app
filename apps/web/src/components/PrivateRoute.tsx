import { getUser } from '@/api/getUser';
import { useQuery } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardSkeleton } from './skeltons/DashboardSkelton';

export default function PrivateRoute({ children }: { children: ReactElement }) {
  const token = localStorage.getItem('token');
  const { isLoading, data } = useQuery({
    queryFn: getUser,
    queryKey: ['user'],
  });

  if (!token) {
    <Navigate to="/signin" />;
    return;
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data?.user) {
    <Navigate to="/signin" />;
  }

  return children;
}
