import { useEffect, useState } from "react";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { showToast } from "../components/Toast";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async () => {
    if (!email.trim()) {
      showToast("Please enter your email", "warning");
      return;
    }

    if (!password) {
      showToast("Please enter your password", "warning");
      return;
    }

    setIsLoggingIn(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        showToast("Login successful! Redirecting...", "success");
      } else {
        showToast(result.error || "Login failed", "error");
      }
    } catch (error) {
      console.error("Login failed:", error);
      showToast("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoggingIn) {
      handleLogin();
    }
  };

  if (authLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
          }}
        >
          Welcome Back
        </h2>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoggingIn}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoggingIn}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          style={{
            width: "100%",
            padding: "12px",
            background: isLoggingIn ? "#ccc" : "#667eea",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isLoggingIn ? "not-allowed" : "pointer",
            transition: "background 0.3s ease",
          }}
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
