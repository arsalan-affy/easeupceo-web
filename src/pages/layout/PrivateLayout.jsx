import { Outlet } from "react-router-dom";
import { LayoutProvider } from "./LayoutContext";
import PrivateSidebar from "./PrivateSidebar";
import PrivateNavbar from "./PrivateNavbar";

export default function PrivateLayout() {
  return (
    <LayoutProvider>
      <div className="flex h-screen overflow-hidden bg-slate-100">
        {/* Sidebar */}
        <PrivateSidebar />

        {/* Right side */}
        <div className="flex flex-1 flex-col">
          {/* Navbar */}
          <PrivateNavbar />

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
