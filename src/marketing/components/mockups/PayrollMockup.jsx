import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { IndianRupee, Users, Wallet, TrendingUp } from "lucide-react";

const data = [
  { month: "Oct", amount: 21.2 },
  { month: "Nov", amount: 22.8 },
  { month: "Dec", amount: 23.1 },
  { month: "Jan", amount: 22.5 },
  { month: "Feb", amount: 24.1 },
  { month: "Mar", amount: 24.85 },
];

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm flex-1 min-w-0">
    <div className={`w-7 h-7 rounded-md ${color} flex items-center justify-center shrink-0`}>
      <Icon className="w-3.5 h-3.5 text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-slate-400 font-medium truncate">{label}</p>
      <p className="text-sm font-bold text-slate-800 leading-tight">{value}</p>
      {sub && <p className="text-[9px] text-slate-400">{sub}</p>}
    </div>
  </div>
);

export default function PayrollMockup() {
  return (
    <div className="bg-slate-50 p-3 h-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-800">Payroll Summary</p>
          <p className="text-[10px] text-slate-400">March 2026 · Processed</p>
        </div>
        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-full border border-blue-100">
          Processed
        </span>
      </div>

      {/* Stats */}
      <div className="flex gap-2">
        <StatCard icon={IndianRupee} label="Total Disbursed" value="₹24.85L" color="bg-indigo-500" />
        <StatCard icon={Users} label="Employees" value="156" sub="Active" color="bg-blue-500" />
        <StatCard icon={Wallet} label="Avg Salary" value="₹15,929" color="bg-violet-500" />
      </div>

      {/* Bar Chart */}
      <div className="flex-1 min-h-0 bg-white rounded-lg border border-slate-100 p-2">
        <p className="text-[10px] text-slate-500 font-medium mb-1">Monthly Payroll (₹ Lakhs)</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 9 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 9 }} tickLine={false} axisLine={false} />
            <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg border border-slate-100 p-2">
        <p className="text-[10px] text-slate-500 font-medium mb-1.5">Recent Payments</p>
        <div className="space-y-1">
          {[
            { name: "Anita Singh", role: "Senior Dev", amount: "₹85,000" },
            { name: "Vikram Patel", role: "Product Manager", amount: "₹1,10,000" },
            { name: "Meera Joshi", role: "HR Lead", amount: "₹72,000" },
          ].map((e) => (
            <div key={e.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-600">
                  {e.name[0]}
                </div>
                <div>
                  <p className="text-[10px] text-slate-700 font-medium leading-tight">{e.name}</p>
                  <p className="text-[9px] text-slate-400">{e.role}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-800">{e.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
