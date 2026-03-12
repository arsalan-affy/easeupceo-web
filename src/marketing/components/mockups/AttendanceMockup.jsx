import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Users, Clock, TrendingUp, CheckCircle } from "lucide-react";

const data = [
  { day: "1", present: 138 }, { day: "3", present: 142 }, { day: "5", present: 135 },
  { day: "7", present: 148 }, { day: "9", present: 144 }, { day: "11", present: 151 },
  { day: "13", present: 139 }, { day: "15", present: 146 }, { day: "17", present: 153 },
  { day: "19", present: 142 }, { day: "21", present: 149 }, { day: "23", present: 156 },
  { day: "25", present: 144 }, { day: "27", present: 148 }, { day: "29", present: 152 },
];

const StatCard = ({ icon: Icon, label, value, change, color }) => (
  <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm flex-1 min-w-0">
    <div className={`w-7 h-7 rounded-md ${color} flex items-center justify-center shrink-0`}>
      <Icon className="w-3.5 h-3.5 text-white" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] text-slate-400 font-medium truncate">{label}</p>
      <p className="text-sm font-bold text-slate-800 leading-tight">{value}</p>
    </div>
    <span className="text-[10px] text-emerald-500 font-semibold shrink-0">{change}</span>
  </div>
);

export default function AttendanceMockup() {
  return (
    <div className="bg-slate-50 p-3 h-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-800">Attendance Overview</p>
          <p className="text-[10px] text-slate-400">March 2026</p>
        </div>
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-full border border-emerald-100">
          Live
        </span>
      </div>

      {/* Stat Cards */}
      <div className="flex gap-2">
        <StatCard icon={Users} label="Present Today" value="152" change="+3%" color="bg-blue-500" />
        <StatCard icon={Clock} label="On Leave" value="8" change="-2" color="bg-amber-500" />
        <StatCard icon={TrendingUp} label="Rate" value="94.6%" change="+1.2%" color="bg-indigo-500" />
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 bg-white rounded-lg border border-slate-100 p-2">
        <p className="text-[10px] text-slate-500 font-medium mb-1">Daily Attendance — This Month</p>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 9 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 9 }} tickLine={false} axisLine={false} domain={[120, 160]} />
            <Area
              type="monotone"
              dataKey="present"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#blueGrad)"
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Check-ins */}
      <div className="bg-white rounded-lg border border-slate-100 p-2">
        <p className="text-[10px] text-slate-500 font-medium mb-1.5">Recent Check-ins</p>
        <div className="space-y-1">
          {[
            { name: "Arjun Sharma", time: "09:02 AM", status: "On time" },
            { name: "Priya Nair", time: "09:15 AM", status: "On time" },
            { name: "Rahul Dev", time: "09:45 AM", status: "Late" },
          ].map((e) => (
            <div key={e.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-600">
                  {e.name[0]}
                </div>
                <span className="text-[10px] text-slate-700 font-medium">{e.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-slate-400">{e.time}</span>
                <span className={`text-[9px] font-semibold ${e.status === "Late" ? "text-amber-500" : "text-emerald-500"}`}>
                  {e.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
