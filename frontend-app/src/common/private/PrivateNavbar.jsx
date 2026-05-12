import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

// Get title from the current path
function getTitleFromPath(path) {
  const formatted = path.split("/").filter(Boolean).join(" / ");
  return formatted
    ? formatted.charAt(0).toUpperCase() + formatted.slice(1)
    : "Dashboard";
}

export default function PrivateNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = getTitleFromPath(location.pathname);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [mounted, setMounted] = useState(false);
  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/app/login");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    setMounted(true);
  }, []);
  const segments = location.pathname.split("/").filter(Boolean);
  const formatSegment = (seg) => seg.charAt(0).toUpperCase() + seg.slice(1);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b shadow-sm bg-white dark:bg-gray-900 dark:border-gray-800">
      {/* <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h1> */}
      <nav
        aria-label="breadcrumb"
        className="flex space-x-1 text-gray-800 dark:text-white"
      >
        {segments.length === 0 && <span>Dashboard</span>}

        {segments.map((segment, index) => {
          const to = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <span key={to} className="flex items-center text-xs">
              {isLast ? (
                <span
                  className="font-semibold max-w-[150px] truncate inline-block align-bottom"
                  title={segment}
                >
                  {formatSegment(segment)}
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => navigate(to)}
                    className="hover:underline focus:outline-none max-w-[100px] truncate inline-block align-bottom"
                    title={segment}
                  >
                    {formatSegment(segment)}
                  </button>
                  <span className="mx-1">/</span>
                </>
              )}
            </span>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="/user.jpg" alt="User" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem onClick={logout} className="text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
