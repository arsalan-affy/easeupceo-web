import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  LayoutDashboard,
  Clock,
  IndianRupee,
  FileText,
  BarChart2,
  Settings,
  Bell,
  Search,
} from "lucide-react";

const chartData = [
  { day: "1", present: 138 }, { day: "4", present: 142 }, { day: "7", present: 148 },
  { day: "10", present: 144 }, { day: "13", present: 151 }, { day: "16", present: 147 },
  { day: "19", present: 153 }, { day: "22", present: 149 }, { day: "25", present: 155 },
  { day: "28", present: 152 }, { day: "31", present: 156 },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Clock, label: "Attendance", active: true },
  { icon: IndianRupee, label: "Payroll", active: false },
  { icon: FileText, label: "Invoices", active: false },
  { icon: BarChart2, label: "Reports", active: false },
];

const checkIns = [
  { name: "Arjun Sharma", dept: "Engineering", time: "09:02", status: "on-time" },
  { name: "Priya Nair", dept: "Product", time: "09:14", status: "on-time" },
  { name: "Rahul Dev", dept: "Sales", time: "09:48", status: "late" },
  { name: "Anita Joshi", dept: "HR", time: "08:58", status: "on-time" },
];

export default function AttendanceMockup() {
  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* Left sidebar */}
      <div className="w-[44px] shrink-0 bg-slate-900 flex flex-col items-center py-3 gap-1 border-r border-slate-800">
        {/* App icon */}
        <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center mb-2">
          <span className="text-[10px] font-black text-white tracking-tighter">EU</span>
        </div>
        {navItems.map((item) => (
          <div
            key={item.label}
            title={item.label}
            className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-default transition-colors ${
              item.active
                ? "bg-blue-600/20 text-blue-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <item.icon className="w-4 h-4" strokeWidth={item.active ? 2 : 1.5} />
          </div>
        ))}
        <div className="mt-auto">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500">
            <Settings className="w-4 h-4" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="h-10 border-b border-slate-100 flex items-center px-4 gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-50 rounded-md border border-slate-200 px-2.5 h-6 flex-1 max-w-[160px]">
            <Search className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-[10px] text-slate-400">Search employees...</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Bell className="w-3.5 h-3.5 text-slate-500" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-700">
              AR
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-3 flex flex-col gap-3 bg-slate-50/50">
          {/* Page title + date */}
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xs font-bold text-slate-800">Attendance</h2>
              <p className="text-[10px] text-slate-400">March 2026</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-500 font-medium">Live</span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-2 shrink-0">
            {[
              { label: "Present", value: "152", change: "+3", positive: true },
              { label: "On Leave", value: "8", change: "-2", positive: true },
              { label: "Attendance", value: "94.6%", change: "+1.2%", positive: true },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-lg p-2.5 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium mb-1">{s.label}</p>
                <p className="text-sm font-bold text-slate-900 leading-none">{s.value}</p>
                <p className="text-[9px] text-emerald-600 font-semibold mt-1">{s.change}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="flex-1 bg-white rounded-lg border border-slate-100 p-3 min-h-0">
            <p className="text-[10px] font-semibold text-slate-600 mb-2">Daily attendance — March</p>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 0, left: -22 }}>
                <defs>
                  <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 8 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 8 }} tickLine={false} axisLine={false} domain={[130, 160]} />
                <Area
                  type="monotone"
                  dataKey="present"
                  stroke="#3B82F6"
                  strokeWidth={1.5}
                  fill="url(#attendanceGrad)"
                  dot={false}
                  activeDot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent check-ins */}
          <div className="bg-white rounded-lg border border-slate-100 p-2.5 shrink-0">
            <p className="text-[10px] font-semibold text-slate-600 mb-2">Recent check-ins</p>
            <div className="space-y-1.5">
              {checkIns.map((e) => (
                <div key={e.name} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-600 shrink-0">
                    {e.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-slate-800 leading-none truncate">{e.name}</p>
                    <p className="text-[9px] text-slate-400">{e.dept}</p>
                  </div>
                  <span className="text-[9px] text-slate-500">{e.time}</span>
                  <span className={`text-[9px] font-semibold ${e.status === "late" ? "text-amber-500" : "text-emerald-500"}`}>
                    {e.status === "late" ? "Late" : "On time"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
