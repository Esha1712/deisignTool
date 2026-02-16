import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth";
import { showToast } from "./Toast";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
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
      showToast("An unexpected error occurred", "error");
    }
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    padding: "10px 20px",
    borderRadius: "25px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
  };

  return (
    <div
      style={{
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-50%",
          right: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "relative",
          zIndex: 1,
          cursor: "pointer",
        }}
      >
        <div>
          📊
        </div>
        <div
          style={{
            fontWeight: "800",
            fontSize: "24px",
            color: "white",
            letterSpacing: "-0.5px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          DesignTool
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Link
          to="/"
          style={linkStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Dashboard
        </Link>

        <Link
          to="/profile"
          style={linkStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Profile
        </Link>

        <div
          style={{
            padding: "10px 18px",
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "25px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "white",
            fontSize: "13px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              background: "#10b981",
              borderRadius: "50%",
              boxShadow: "0 0 10px #10b981",
            }}
          />
          {user.email.split("@")[0]}
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 22px",
            background: "rgba(239, 68, 68, 0.95)",
            color: "white",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "25px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "14px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(220, 38, 38, 1)";
            e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 6px 20px rgba(239, 68, 68, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.95)";
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow =
              "0 4px 15px rgba(239, 68, 68, 0.4)";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
