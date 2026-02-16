import type { UserRole } from "../types/user.types";
import { useAuth } from "../hooks/useAuth";

interface RoleGuardProps {
  allowed: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard = ({
  allowed,
  children,
  fallback,
}: RoleGuardProps) => {
  const { user } = useAuth();

  if (!user || !allowed.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: "20px",
        }}
      >
        <div
          style={{
            padding: "30px",
            background: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔒</div>
          <h2 style={{ color: "#856404", marginBottom: "10px" }}>
            Access Denied
          </h2>
          <p style={{ color: "#856404", marginBottom: "5px" }}>
            You don't have permission to access this content.
          </p>
          <p style={{ color: "#999", fontSize: "14px" }}>
            Required role: {allowed.join(" or ")}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
