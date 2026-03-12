import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Users, TrendingDown, UserPlus, Award } from "lucide-react";

const headcountData = [
  { month: "Apr", count: 134 }, { month: "May", count: 139 }, { month: "Jun", count: 141 },
  { month: "Jul", count: 143 }, { month: "Aug", count: 148 }, { month: "Sep", count: 150 },
  { month: "Oct", count: 151 }, { month: "Nov", count: 153 }, { month: "Dec", count: 153 },
  { month: "Jan", count: 155 }, { month: "Feb", count: 157 }, { month: "Mar", count: 156 },
];

const deptData = [
  { dept: "Eng", count: 52 },
  { dept: "Sales", count: 28 },
  { dept: "HR", count: 15 },
  { dept: "Fin", count: 22 },
  { dept: "Ops", count: 39 },
];

const KPICard = ({ icon: Icon, label, value, change, positive = true, color }) => (
  <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
    <div className={`w-7 h-7 rounded-md ${color} flex items-center justify-center shrink-0`}>
      <Icon className="w-3.5 h-3.5 text-white" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] text-slate-400 font-medium truncate">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
    <span className={`text-[10px] font-semibold shrink-0 ${positive ? "text-emerald-500" : "text-red-400"}`}>{change}</span>
  </div>
);

export default function HRAnalyticsMockup() {
  return (
    <div className="bg-slate-50 p-3 h-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-800">HR Analytics</p>
          <p className="text-[10px] text-slate-400">FY 2025-26</p>
        </div>
        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-semibold rounded-full border border-indigo-100">
          AI Insights
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-2">
        <KPICard icon={Users} label="Total Headcount" value="156" change="+16.4%" color="bg-blue-500" />
        <KPICard icon={TrendingDown} label="Attrition Rate" value="8.2%" change="-1.1%" color="bg-indigo-500" />
        <KPICard icon={UserPlus} label="New Hires YTD" value="34" change="+12" color="bg-violet-500" />
        <KPICard icon={Award} label="Avg Tenure" value="3.2 yrs" change="+0.3" color="bg-blue-600" />
      </div>

      {/* Headcount Trend */}
      <div className="flex-1 min-h-0 bg-white rounded-lg border border-slate-100 p-2">
        <p className="text-[10px] text-slate-500 font-medium mb-1">Headcount Trend</p>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={headcountData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 9 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 9 }} tickLine={false} axisLine={false} domain={[125, 165]} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="url(#lineGrad)"
              strokeWidth={2.5}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Dept Breakdown */}
      <div className="bg-white rounded-lg border border-slate-100 p-2" style={{ height: 80 }}>
        <p className="text-[10px] text-slate-500 font-medium mb-1">By Department</p>
        <ResponsiveContainer width="100%" height="75%">
          <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
            <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 9 }} tickLine={false} axisLine={false} />
            <YAxis dataKey="dept" type="category" tick={{ fill: "#94a3b8", fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
            <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} maxBarSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
