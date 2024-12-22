import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        navigate(redirectTo, {
          state: { from: window.location.pathname },
        });
      }
    }
  }, [isAuthenticated, loading, navigate, redirectTo, requireAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A9FF]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
