import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/auth.service";
import { useTheme } from "../context/ThemeContext";
import { showToast } from "../components/Toast";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const result = await logout();

      if (result.success) {
        showToast("Logged out successfully", "success");
        navigate("/login");
      } else {
        showToast(result.error || "Failed to log out", "error");
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast("An unexpected error occurred during logout", "error");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return <LoadingSpinner fullScreen message="Loading profile..." />;
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>Profile</h2>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              color: "#666",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            Email
          </label>
          <div
            style={{
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "6px",
              border: "1px solid #e9ecef",
            }}
          >
            {user.email}
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              color: "#666",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            Role
          </label>
          <div
            style={{
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "6px",
              border: "1px solid #e9ecef",
              display: "inline-block",
            }}
          >
            <span
              style={{
                background: user.role === "editor" ? "#28a745" : "#ffc107",
                color: "white",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {user.role}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              color: "#666",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            Theme
          </label>
          <button
            onClick={toggleTheme}
            style={{
              padding: "10px 20px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>

        <div
          style={{
            borderTop: "1px solid #e9ecef",
            paddingTop: "25px",
            marginTop: "25px",
          }}
        >
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              padding: "12px 24px",
              background: isLoggingOut ? "#ccc" : "#d63031",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: isLoggingOut ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "600",
              width: "100%",
            }}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
