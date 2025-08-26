import { Outlet } from "react-router";
import { AuthProvider } from "~/contexts/AuthContext";

export default function ProtectedLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
