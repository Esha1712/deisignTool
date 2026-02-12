import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/auth.service";
import { useTheme } from "../context/ThemeContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
