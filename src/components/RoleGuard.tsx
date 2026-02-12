import type { UserRole } from "../types/user.types";
import { useAuth } from "../hooks/useAuth";

export const RoleGuard = ({
  allowed,
  children,
}: {
  allowed: UserRole[];
  children: React.ReactNode;
}) => {
  const { user } = useAuth();

  console.log("RoleGuard logssssss", { user, allowed });

  if (!user || !allowed.includes(user.role)) {
    return <div>Access Denied</div>;
  }

  return <>{children}</>;
};
