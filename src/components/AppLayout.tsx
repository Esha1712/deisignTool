import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function AppLayout() {
  return (
    <>
      <Header />
      <div style={{ padding: 20 }}>
        <Outlet />
      </div>
    </>
  );
}
