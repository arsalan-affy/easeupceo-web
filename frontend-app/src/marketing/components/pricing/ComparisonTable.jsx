import React from "react";
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
  { category: "Core (Base Plan)", feature: "Employee management", base: true, payroll: true, attendance: true, leave: true },
  { category: "Core (Base Plan)", feature: "Contact management", base: true, payroll: true, attendance: true, leave: true },
  { category: "Core (Base Plan)", feature: "Items & Inventory", base: true, payroll: true, attendance: true, leave: true },
  { category: "Core (Base Plan)", feature: "Sales & Invoicing", base: true, payroll: true, attendance: true, leave: true },
  { category: "Core (Base Plan)", feature: "Purchases & Bills", base: true, payroll: true, attendance: true, leave: true },
  { category: "Core (Base Plan)", feature: "Accounting & Finance", base: true, payroll: true, attendance: true, leave: true },
  { category: "Core (Base Plan)", feature: "Reports & Settings", base: true, payroll: true, attendance: true, leave: true },
  { category: "Payroll Add-On", feature: "Salary processing", base: false, payroll: true, attendance: false, leave: false },
  { category: "Payroll Add-On", feature: "Payslip generation", base: false, payroll: true, attendance: false, leave: false },
  { category: "Payroll Add-On", feature: "Statutory compliance", base: false, payroll: true, attendance: false, leave: false },
  { category: "Payroll Add-On", feature: "Multiple salary components", base: false, payroll: true, attendance: false, leave: false },
  { category: "Attendance Add-On", feature: "Punch records", base: false, payroll: false, attendance: true, leave: false },
  { category: "Attendance Add-On", feature: "Shift management", base: false, payroll: false, attendance: true, leave: false },
  { category: "Attendance Add-On", feature: "Daily & monthly tracking", base: false, payroll: false, attendance: true, leave: false },
  { category: "Attendance Add-On", feature: "Overtime calculation", base: false, payroll: false, attendance: true, leave: false },
  { category: "Leave Add-On", feature: "Leave categories", base: false, payroll: false, attendance: false, leave: true },
  { category: "Leave Add-On", feature: "Request & approval workflows", base: false, payroll: false, attendance: false, leave: true },
  { category: "Leave Add-On", feature: "Balance tracking", base: false, payroll: false, attendance: false, leave: true },
  { category: "Leave Add-On", feature: "Leave policies", base: false, payroll: false, attendance: false, leave: true },
];

function CellValue({ value }) {
  if (value === true)
    return (
      <div className="flex justify-center">
        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-emerald-50">
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
      <h3 className="text-xl font-bold text-slate-900 text-center mb-8">What's Included in Each Module</h3>
      <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-[35%] text-slate-700 font-semibold py-4 pl-6">Feature</TableHead>
                <TableHead className="text-center font-semibold">
                  <div>
                    <span className="text-gradient-brand">Base Plan</span>
                    <p className="text-xs text-slate-400 font-normal">₹999/mo</p>
                  </div>
                </TableHead>
                <TableHead className="text-center text-slate-700 font-semibold">
                  <div>
                    Payroll
                    <p className="text-xs text-slate-400 font-normal">₹35/emp/mo</p>
                  </div>
                </TableHead>
                <TableHead className="text-center text-slate-700 font-semibold">
                  <div>
                    Attendance
                    <p className="text-xs text-slate-400 font-normal">₹18/emp/mo</p>
                  </div>
                </TableHead>
                <TableHead className="text-center text-slate-700 font-semibold">
                  <div>
                    Leave
                    <p className="text-xs text-slate-400 font-normal">₹12/emp/mo</p>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => {
                const showCategory = row.category !== lastCategory;
                lastCategory = row.category;
                return (
                  <React.Fragment key={i}>
                    {showCategory && (
                      <TableRow className="bg-slate-50/50">
                        <TableCell colSpan={5} className="pl-6 py-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            {row.category}
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-6 py-3.5 text-sm text-slate-700">{row.feature}</TableCell>
                      <TableCell className="text-center py-3.5 bg-blue-50/30">
                        <CellValue value={row.base} />
                      </TableCell>
                      <TableCell className="text-center py-3.5">
                        <CellValue value={row.payroll} />
                      </TableCell>
                      <TableCell className="text-center py-3.5">
                        <CellValue value={row.attendance} />
                      </TableCell>
                      <TableCell className="text-center py-3.5">
                        <CellValue value={row.leave} />
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AnimatedSection>
  );
}
