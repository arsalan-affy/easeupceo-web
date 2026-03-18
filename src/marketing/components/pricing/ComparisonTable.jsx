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
  { category: "Core HR", feature: "Max employees", starter: "50", growth: "50", enterprise: "50+" },
  { category: "Core HR", feature: "Employee management", starter: true, growth: true, enterprise: true },
  { category: "Core HR", feature: "Employee onboarding", starter: true, growth: true, enterprise: true },
  { category: "Core HR", feature: "Document management", starter: true, growth: true, enterprise: true },
  { category: "Core HR", feature: "Leave management", starter: true, growth: true, enterprise: true },
  { category: "Core HR", feature: "Self-service portal", starter: true, growth: true, enterprise: true },
  { category: "Core HR", feature: "HR reports", starter: "Basic", growth: "Advanced", enterprise: "Custom" },
  { category: "Payroll", feature: "Payroll processing", starter: false, growth: true, enterprise: true },
  { category: "Payroll", feature: "Salary processing & payslips", starter: false, growth: true, enterprise: true },
  { category: "Payroll", feature: "Statutory compliance (PF/ESI/TDS)", starter: false, growth: true, enterprise: true },
  { category: "Attendance", feature: "Attendance tracking", starter: false, growth: true, enterprise: true },
  { category: "Attendance", feature: "Shift management", starter: false, growth: true, enterprise: true },
  { category: "Attendance", feature: "GPS & geo-fencing", starter: false, growth: true, enterprise: true },
  { category: "Analytics", feature: "HR analytics dashboard", starter: false, growth: true, enterprise: true },
  { category: "Analytics", feature: "Role-based access control", starter: false, growth: true, enterprise: true },
  { category: "Analytics", feature: "HR lifecycle management", starter: false, growth: true, enterprise: true },
  { category: "Advanced", feature: "Multi-location management", starter: false, growth: false, enterprise: true },
  { category: "Advanced", feature: "Workflow automation", starter: false, growth: false, enterprise: true },
  { category: "Advanced", feature: "Custom HR reports", starter: false, growth: false, enterprise: true },
  { category: "Integration", feature: "API integrations", starter: false, growth: false, enterprise: true },
  { category: "Security", feature: "Advanced security controls", starter: false, growth: false, enterprise: true },
  { category: "Support", feature: "Support level", starter: "Email", growth: "Priority", enterprise: "Priority+" },
  { category: "Support", feature: "Data SLA", starter: "99.5%", growth: "99.5%", enterprise: "99.9%" },
];

function CellValue({ value, isGrowth }) {
  if (value === true)
    return (
      <div className="flex justify-center">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isGrowth ? "bg-blue-100" : "bg-emerald-50"}`}>
          <Check className={`w-3 h-3 ${isGrowth ? "text-blue-600" : "text-emerald-600"}`} />
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
                <TableHead className="text-center text-slate-700 font-semibold">Starter</TableHead>
                <TableHead className="text-center font-semibold bg-blue-50/40">
                  <span className="text-gradient-brand">Growth</span>
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
                        <CellValue value={row.starter} />
                      </TableCell>
                      <TableCell className="text-center py-3.5 bg-blue-50/30">
                        <CellValue value={row.growth} isGrowth />
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
