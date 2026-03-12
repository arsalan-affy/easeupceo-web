import { Check, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AnimatedSection from "../shared/AnimatedSection";

const rows = [
  { category: "Employees", feature: "Max employees", free: "10", starter: "50", enterprise: "Unlimited" },
  { category: "Attendance", feature: "Basic attendance tracking", free: true, starter: true, enterprise: true },
  { category: "Attendance", feature: "GPS & geo-fencing", free: false, starter: true, enterprise: true },
  { category: "Attendance", feature: "Biometric integration", free: false, starter: true, enterprise: true },
  { category: "Attendance", feature: "Shift scheduling", free: false, starter: true, enterprise: true },
  { category: "Payroll", feature: "Payroll processing", free: "Basic", starter: true, enterprise: true },
  { category: "Payroll", feature: "Statutory compliance (PF/ESI/TDS)", free: false, starter: true, enterprise: true },
  { category: "Payroll", feature: "Direct bank transfer", free: false, starter: true, enterprise: true },
  { category: "Invoicing", feature: "Invoice generation", free: false, starter: true, enterprise: true },
  { category: "Invoicing", feature: "GST compliance & GSTR reports", free: false, starter: true, enterprise: true },
  { category: "Analytics", feature: "Basic HR reports", free: true, starter: true, enterprise: true },
  { category: "Analytics", feature: "Advanced analytics & AI insights", free: false, starter: false, enterprise: true },
  { category: "Integration", feature: "API access", free: false, starter: false, enterprise: true },
  { category: "Support", feature: "Support level", free: "Email", starter: "Priority", enterprise: "Dedicated" },
  { category: "Compliance", feature: "Data backup & SLA", free: false, starter: "99.5%", enterprise: "99.9%" },
];

function CellValue({ value }) {
  if (value === true)
    return (
      <div className="flex justify-center">
        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
          <Check className="w-3 h-3 text-emerald-600" />
        </div>
      </div>
    );
  if (value === false)
    return (
      <div className="flex justify-center">
        <Minus className="w-4 h-4 text-slate-300" />
      </div>
    );
  return <span className="text-sm text-slate-700 font-medium">{value}</span>;
}

export default function ComparisonTable() {
  let lastCategory = null;

  return (
    <AnimatedSection className="mt-20">
      <h3 className="text-xl font-bold text-slate-900 text-center mb-8">Full Feature Comparison</h3>
      <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-[40%] text-slate-700 font-semibold py-4 pl-6">Feature</TableHead>
                <TableHead className="text-center text-slate-700 font-semibold">Free</TableHead>
                <TableHead className="text-center font-semibold">
                  <span className="text-gradient-brand">Starter</span>
                </TableHead>
                <TableHead className="text-center text-slate-700 font-semibold">Enterprise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => {
                const showCategory = row.category !== lastCategory;
                lastCategory = row.category;
                return (
                  <>
                    {showCategory && (
                      <TableRow key={`cat-${row.category}`} className="bg-slate-50/50">
                        <TableCell colSpan={4} className="pl-6 py-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            {row.category}
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-6 py-3.5 text-sm text-slate-700">{row.feature}</TableCell>
                      <TableCell className="text-center py-3.5">
                        <CellValue value={row.free} />
                      </TableCell>
                      <TableCell className="text-center py-3.5 bg-blue-50/30">
                        <CellValue value={row.starter} />
                      </TableCell>
                      <TableCell className="text-center py-3.5">
                        <CellValue value={row.enterprise} />
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AnimatedSection>
  );
}
