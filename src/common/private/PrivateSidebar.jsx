import {
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  ChevronLeft,
  MessageCircle,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

export default function PrivateSidebar({ collapsed, setCollapsed }) {
  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      to: "",
    },
    {
      label: "Customers",
      icon: <Users size={20} />,
      to: "customer",
    },
    {
      label: "Expired",
      icon: <Ban size={20} />,
      to: "expired",
    },
     {
      label: "Send SMS",
      icon: <MessageCircle size={20} />,
      to: "pending",
    },
    {
      label: "Reports",
      icon: <Users size={20} />,
      to: "reports",
    },
    {
      label: "Settings",
      icon: <Settings size={20} />,
      to: "settings",
    },
  ];

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-screen z-40",
        "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-60",
        "flex flex-col select-none"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <span className="text-sm   font-bold text-gray-900 dark:text-white tracking-wide">
            AUM Securities
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex flex-col mt-3 px-1 space-y-1 text-sm font-medium">
        {menuItems.map(({ label, icon, to }) => (
          <NavLink
            key={label}
            to={to}
            end={to === ""}
            className={({ isActive }) =>
              clsx(
                "flex items-center space-x-3 px-4 py-2 rounded-md transition-colors duration-200",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                isActive
                  ? "bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-blue-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300",
                collapsed && "justify-center"
              )
            }
            title={collapsed ? label : undefined}
          >
            <span>{icon}</span>
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-4 py-4 border-t border-gray-200 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-600 select-none">
        {!collapsed && <span>© 2025 AUM Securities</span>}
      </div>
    </aside>
  );
}
