import { useEffect, useState } from "react";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // ✅ Add state
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // ✅ Navigate after auth state updates
  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
