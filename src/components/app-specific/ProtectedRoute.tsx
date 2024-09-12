import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useSession } from '@/context/SessionContext.tsx';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session, isLoading } = useSession();

  if (session === null && !isLoading) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
