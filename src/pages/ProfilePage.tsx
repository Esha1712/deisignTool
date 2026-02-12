import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/auth.service";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
