import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";

const pieData = [
  { name: "Paid", value: 1875000, color: "#3B82F6" },
  { name: "Outstanding", value: 420000, color: "#6366F1" },
  { name: "Overdue", value: 85000, color: "#F59E0B" },
];

const StatCard = ({ icon: Icon, label, value, color, textColor }) => (
  <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm flex-1 min-w-0">
    <div className={`w-7 h-7 rounded-md ${color} flex items-center justify-center shrink-0`}>
      <Icon className="w-3.5 h-3.5 text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-slate-400 font-medium truncate">{label}</p>
      <p className={`text-sm font-bold ${textColor || "text-slate-800"} leading-tight`}>{value}</p>
    </div>
  </div>
);

export default function InvoiceMockup() {
  return (
    <div className="bg-slate-50 p-3 h-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-800">Invoice Analytics</p>
          <p className="text-[10px] text-slate-400">Q1 2026</p>
        </div>
        <span className="px-2 py-0.5 bg-violet-50 text-violet-600 text-[10px] font-semibold rounded-full border border-violet-100">
          3 Overdue
        </span>
      </div>

      {/* Stats */}
      <div className="flex gap-2">
        <StatCard icon={CheckCircle} label="Paid" value="₹18.75L" color="bg-blue-500" />
        <StatCard icon={Clock} label="Outstanding" value="₹4.20L" color="bg-indigo-500" />
        <StatCard icon={AlertCircle} label="Overdue" value="₹85K" color="bg-amber-500" textColor="text-amber-600" />
      </div>

      {/* Chart + Legend */}
      <div className="bg-white rounded-lg border border-slate-100 p-2 flex items-center gap-3">
        <div className="w-20 h-20 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={22}
                outerRadius={36}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-slate-600">{item.name}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-800">
                ₹{(item.value / 100000).toFixed(2)}L
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice List */}
      <div className="flex-1 bg-white rounded-lg border border-slate-100 p-2">
        <p className="text-[10px] text-slate-500 font-medium mb-1.5">Recent Invoices</p>
        <div className="space-y-1.5">
          {[
            { id: "INV-2026-031", client: "Tata Consultancy", amount: "₹2,50,000", status: "Paid", color: "text-emerald-500" },
            { id: "INV-2026-030", client: "Infosys Ltd", amount: "₹1,80,000", status: "Paid", color: "text-emerald-500" },
            { id: "INV-2026-029", client: "Wipro Technologies", amount: "₹95,000", status: "Pending", color: "text-amber-500" },
            { id: "INV-2026-028", client: "HCL Technologies", amount: "₹3,10,000", status: "Overdue", color: "text-red-500" },
          ].map((inv) => (
            <div key={inv.id} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center">
                  <FileText className="w-3 h-3 text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-700 font-medium leading-tight">{inv.client}</p>
                  <p className="text-[9px] text-slate-400">{inv.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-800">{inv.amount}</p>
                <p className={`text-[9px] font-semibold ${inv.color}`}>{inv.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
