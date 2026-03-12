import HeaderTitle from "./common-components/HeaderTitle";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

const screenings = [
  {
    id: "scr-101",
    jobTitle: "Frontend Developer",
    cvsScreened: 15,
    topCandidate: "Rahul Mehta",
    topScore: 92,
    date: "Jan 26, 2026",
  },
  {
    id: "scr-102",
    jobTitle: "Backend Engineer",
    cvsScreened: 22,
    topCandidate: "Priya Singh",
    topScore: 89,
    date: "Jan 24, 2026",
  },
  {
    id: "scr-103",
    jobTitle: "UI/UX Designer",
    cvsScreened: 9,
    topCandidate: "Aman Sharma",
    topScore: 84,
    date: "Jan 21, 2026",
  },
  {
    id: "scr-104",
    jobTitle: "DevOps Engineer",
    cvsScreened: 18,
    topCandidate: "Neha Verma",
    topScore: 90,
    date: "Jan 18, 2026",
  },
];

const scoreBadge = (score) => {
  if (score >= 85) return "bg-emerald-100 text-emerald-700";
  if (score >= 70) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
};

export default function PastScreenings() {
  const navigate = useNavigate();

  return (
    <>
      <HeaderTitle title="Past Screenings" backButton />

      <div className="bg-white rounded-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-900">
            Screening History
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Previously completed AI screening sessions
          </p>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="px-4 py-2 text-[11px] uppercase text-slate-500">
                Job Title
              </TableHead>
              <TableHead className="px-4 py-2 text-[11px] uppercase text-slate-500">
                Date
              </TableHead>
              <TableHead className="px-4 py-2 text-[11px] uppercase text-slate-500">
                CVs Screened
              </TableHead>
              <TableHead className="px-4 py-2 text-[11px] uppercase text-slate-500">
                Top Candidate
              </TableHead>
              <TableHead className="px-4 py-2 text-[11px] uppercase text-slate-500">
                ATS Score
              </TableHead>
              <TableHead className="px-4 py-2 text-right text-[11px] uppercase text-slate-500">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {screenings.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50 transition">
                <TableCell className="px-4 py-2.5 font-medium text-sm">
                  {item.jobTitle}
                </TableCell>

                <TableCell className="px-4 py-2.5 text-sm text-slate-600">
                  {item.date}
                </TableCell>

                <TableCell className="px-4 py-2.5 text-sm text-slate-700">
                  {item.cvsScreened}
                </TableCell>

                <TableCell className="px-4 py-2.5 text-sm text-slate-700">
                  {item.topCandidate}
                </TableCell>

                <TableCell className="px-4 py-2.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${scoreBadge(
                      item.topScore,
                    )}`}
                  >
                    {item.topScore}%
                  </span>
                </TableCell>

                <TableCell className="px-4 py-2.5 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => navigate(`/ai-screening/${item.id}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
