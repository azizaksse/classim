import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;
