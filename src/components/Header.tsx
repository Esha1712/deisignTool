import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <div style={{ fontWeight: "bold" }}>DesignTool</div>

      <div style={{ display: "flex", gap: 20 }}>
        <Link to="/">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
