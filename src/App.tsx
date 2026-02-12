import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleGuard } from "./components/RoleGuard";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DiagramEditorPage from "./pages/DiagramEditorPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/diagram/:id"
        element={
          <ProtectedRoute>
            <DiagramEditorPage />
          </ProtectedRoute>
        }
      />

      {/* Example: Editor Only Route (Optional) */}
      <Route
        path="/diagram/new"
        element={
          <ProtectedRoute>
            <RoleGuard allowed={["editor"]}>
              <DiagramEditorPage />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
