// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Menu,
//   X,
//   Home,
//   Info,
//   BookOpen,
//   DollarSign,
//   Phone,
//   Sun,
//   Moon,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

// export default function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(
//     () => localStorage.getItem("theme") === "dark"
//   );

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     document.documentElement.classList.toggle("dark", newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//   };

//   const navLinks = [
//     { name: "Home", path: "/", icon: <Home className="w-4 h-4 mr-2" /> },
//     { name: "About", path: "/about", icon: <Info className="w-4 h-4 mr-2" /> },
//     // {
//     //   name: "Blogs",
//     //   path: "/blogs",
//     //   icon: <BookOpen className="w-4 h-4 mr-2" />,
//     // },
//     {
//       name: "Pricing",
//       type: "scroll",
//       path: "/#pricing",
//       icon: <DollarSign className="w-4 h-4 mr-2" />,
//     },
//     {
//       name: "Contact",
//       path: "/contact",
//       icon: <Phone className="w-4 h-4 mr-2" />,
//     },
//   ];

//   const hasToken = localStorage.getItem("accessToken");

//   return (
//     <header className="sticky top-4 z-50 w-[95%] mx-auto rounded-full shadow-md bg-background/80 backdrop-blur border border-border">
//       <div className="flex items-center justify-between px-6 py-3">
//         <Link to="/" className="text-2xl font-bold tracking-tight">
//           Meta<span className="text-primary">Mind</span>
//         </Link>

//         {/* Desktop Links */}
//         <nav className="hidden md:flex items-center gap-6">
//           {/* {navLinks.map((link) => (
//             <Link
//               key={link.name}
//               to={link.path}
//               className="flex items-center text-sm font-medium hover:text-primary transition"
//             >
//               {link.icon}
//               {link.name}
//             </Link>
//           ))} */}
//           {navLinks.map((link) =>
//             link.type === "scroll" ? (
//               <a
//                 key={link.name}
//                 href={link.path}
//                 className="flex items-center text-sm font-medium hover:text-primary transition"
//               >
//                 {link.icon}
//                 {link.name}
//               </a>
//             ) : (
//               <Link
//                 key={link.name}
//                 to={link.path}
//                 className="flex items-center text-sm font-medium hover:text-primary transition"
//               >
//                 {link.icon}
//                 {link.name}
//               </Link>
//             )
//           )}
//         </nav>

//         <div className="flex items-center gap-3">
//           <Button variant="ghost" size="icon" onClick={toggleTheme}>
//             {darkMode ? (
//               <Sun className="w-5 h-5" />
//             ) : (
//               <Moon className="w-5 h-5" />
//             )}
//           </Button>

//           {/* {!hasToken ? (
//             <button
//               className="w-full px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors duration-200"
//               type="button"
//             >
//               Get Started
//             </button>
//           ) : (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Avatar className="cursor-pointer">
//                   <AvatarImage src="https://github.com/shadcn.png" />
//                   <AvatarFallback>KH</AvatarFallback>
//                 </Avatar>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem>Profile</DropdownMenuItem>
//                 <DropdownMenuItem>Settings</DropdownMenuItem>
//                 <DropdownMenuItem>Logout</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )} */}
//           {!hasToken ? (
//             <button
//               className="w-full px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors duration-200"
//               type="button"
//                onClick={() => {
//                     localStorage.clear();
//                     window.location.href = "/login";
//                   }}
//             >
//               Get Started
//             </button>
//           ) : (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Avatar className="cursor-pointer">
//                   <AvatarImage src="https://github.com/shadcn.png" />
//                   <AvatarFallback>KH</AvatarFallback>
//                 </Avatar>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem
//                   onClick={() => {
//                     window.location.href = "/user";
//                   }}
//                 >
//                   Dashboard
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => {
//                     window.location.href = "/user/settings";
//                   }}>Settings</DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={() => {
//                     localStorage.clear();
//                     window.location.href = "/";
//                   }}
//                 >
//                   Logout
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}

//           {/* Hamburger for mobile */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="md:hidden"
//             onClick={() => setMobileOpen(!mobileOpen)}
//           >
//             {mobileOpen ? (
//               <X className="w-5 h-5" />
//             ) : (
//               <Menu className="w-5 h-5" />
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Mobile Drawer */}
//       {mobileOpen && (
//         <div className="md:hidden border-t bg-background px-6 py-3">
//           <nav className="flex flex-col space-y-3">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 to={link.path}
//                 onClick={() => setMobileOpen(false)}
//                 className="flex items-center text-sm font-medium hover:text-primary transition"
//               >
//                 {link.icon}
//                 {link.name}
//               </Link>
//             ))}
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Info,
  DollarSign,
  Phone,
  Sun,
  Moon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "About", path: "/about", icon: <Info className="w-4 h-4 mr-2" /> },
    {
      name: "Pricing",
      type: "scroll",
      path: "/#pricing",
      icon: <DollarSign className="w-4 h-4 mr-2" />,
    },
    {
      name: "Contact",
      path: "/contact",
      icon: <Phone className="w-4 h-4 mr-2" />,
    },
  ];

  const hasToken = localStorage.getItem("accessToken");

  return (
    <header className="sticky top-4 z-50 w-[95%] mx-auto rounded-full shadow-md bg-background/80 backdrop-blur border border-border">
      <div className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Meta<span className="text-primary">Mind</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.type === "scroll" ? (
              <a
                key={link.name}
                href={link.path}
                className="flex items-center text-sm font-medium hover:text-primary transition"
              >
                {link.icon}
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center text-sm font-medium hover:text-primary transition"
              >
                {link.icon}
                {link.name}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {!hasToken ? (
            <button
              className="w-full px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors duration-200"
              type="button"
              onClick={() => {
                navigate("/login");
              }}
            >
              Get Started
            </button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>KH</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/user">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/user/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-6 py-3">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center text-sm font-medium hover:text-primary transition"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
