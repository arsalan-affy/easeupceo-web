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
import CreateJob from "./CreateJob";
import { useNavigate } from "react-router-dom";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    location: "Remote",
    applicants: 45,
    status: "Open",
  },
  {
    id: 2,
    title: "Backend Engineer",
    location: "Bangalore",
    applicants: 32,
    status: "Open",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    location: "Mumbai",
    applicants: 18,
    status: "Closed",
  },
];

export default function JobsList() {
  const navigate = useNavigate();

  return (
    <>
      <HeaderTitle title="Jobs" />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 border-b">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Job Listings
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage and review all active and closed job openings
            </p>
          </div>

          <CreateJob />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Job Role
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Location
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Applicants
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-slate-50 transition">
                  <TableCell className="px-6 py-5">
                    <div className="font-medium text-slate-900">
                      {job.title}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      Job ID: #{job.id}
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5 text-slate-700">
                    {job.location}
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                      {job.applicants} Applicants
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        job.status === "Open"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-5 text-right">
                    <Button
                      variant="outline"
                      className="px-4"
                      onClick={() => navigate(`${job.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
