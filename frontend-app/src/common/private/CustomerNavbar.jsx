import React from "react";
import aumLogo from "../../assets/aum-logo.png";
import {
  LogOut,
  Menu,
  PhoneCall,
  FileText,
  ArrowRightCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  {
    label: "Support",
    href: "https://aumsecurities.in/support-center",
    icon: PhoneCall,
    external: true,
    type: "link",
  },
  {
    label: "Terms & Conditions",
    href: "/terms-and-conditions",
    icon: FileText,
    external: true,
    type: "link",
  },
  {
    label: "Open Your Account",
    href: "https://openaccount.aumsecurities.in/",
    icon: ArrowRightCircle,
    external: true,
    type: "button",
  },
];

export default function CustomerNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/customer/login");
  };

  return (
    <header className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-5 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <img src={aumLogo} alt="Logo" className="h-10 w-auto object-contain" />
      </div>

      <DesktopNav navLinks={navLinks} handleLogout={handleLogout} />
      <MobileNav navLinks={navLinks} handleLogout={handleLogout} />
    </header>
  );
}

function DesktopNav({ navLinks, handleLogout }) {
  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
      {navLinks.map((item, index) => {
        const Icon = item.icon;

        if (item.type === "button") {
          return (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white px-4 py-2 rounded-md shadow-sm transition"
              style={{
                background: "linear-gradient(45deg, #1C6A9D 0%, #7A356B 98%)",
              }}
            >
              <Icon size={18} />
              {item.label}
            </a>
          );
        }

        return (
          <a
            key={index}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-2"
          >
            <Icon size={18} />
            {item.label}
          </a>
        );
      })}

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </nav>
  );
}

function MobileNav({ navLinks, handleLogout }) {
  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-52 mt-2"
        >
          {navLinks.map((item, index) => {
            const Icon = item.icon;

            if (item.type === "button") {
              return (
                <DropdownMenuItem asChild key={index}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-white"
                    style={{
                      background:
                        "linear-gradient(45deg, #1C6A9D 0%, #7A356B 98%)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </a>
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem asChild key={index}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </a>
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 dark:text-red-400 cursor-pointer flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
