import { useState } from "react";
import PrivateSidebar from "./PrivateSidebar";
import PrivateNavbar from "./PrivateNavbar";
import { Outlet } from "react-router-dom";
import clsx from "clsx";
import AffyFooter from "../AffyFooter";

export default function PrivateLayout() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex min-h-screen">
      <PrivateSidebar collapsed={collapsed} setCollapsed={setCollapsed} />{" "}
      <div
        className={clsx(
          "flex flex-col flex-1 transition-all duration-300",
          collapsed ? "pl-16" : "pl-60"
        )}
      >
        <PrivateNavbar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
        <AffyFooter />
      </div>
    </div>
  );
}
