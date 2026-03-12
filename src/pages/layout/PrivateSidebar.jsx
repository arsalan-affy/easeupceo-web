import { NavLink } from "react-router-dom";

export default function PrivateSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="h-16 flex items-center px-6 text-lg font-semibold border-b border-slate-800">
        ATS Tool
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <NavLink
          to="/app/dashboard"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-2 text-sm transition ${
              isActive ? "bg-slate-800" : "hover:bg-slate-800/60"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/app/job"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-2 text-sm transition ${
              isActive ? "bg-slate-800" : "hover:bg-slate-800/60"
            }`
          }
        >
          Jobs
        </NavLink>
        <NavLink
          to="/app/ai-screening"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-2 text-sm transition ${
              isActive ? "bg-slate-800" : "hover:bg-slate-800/60"
            }`
          }
        >
          AI Screening
        </NavLink>
      </nav>
    </aside>
  );
}
