import HeaderTitle from "./common-components/HeaderTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddCandidate from "./AddCandidate";

const job = {
  title: "Frontend Developer",
  location: "Remote",
  experience: "2–4 years",
  employmentType: "Full-time",
  skills: ["React", "JavaScript", "REST APIs"],
};

const candidates = [
  {
    id: 1,
    name: "Aman Sharma",
    email: "aman.sharma@gmail.com",
    mobile: "9876543210",
    score: 82,
  },
  {
    id: 2,
    name: "Neha Verma",
    email: "neha.verma@gmail.com",
    mobile: "9123456789",
    score: 74,
  },
  {
    id: 3,
    name: "Rahul Mehta",
    email: "rahul.mehta@gmail.com",
    mobile: "9988776655",
    score: 91,
  },
  {
    id: 4,
    name: "Karan Patel",
    email: "karan.p@gmail.com",
    mobile: "9090909090",
    score: 68,
  },
  {
    id: 5,
    name: "Priya Singh",
    email: "priya.s@gmail.com",
    mobile: "9812345678",
    score: 88,
  },
  {
    id: 6,
    name: "Mohit Jain",
    email: "mohit.j@gmail.com",
    mobile: "9797979797",
    score: 59,
  },
  {
    id: 7,
    name: "Sneha Iyer",
    email: "sneha.i@gmail.com",
    mobile: "9666555444",
    score: 76,
  },
  {
    id: 8,
    name: "Rohit Kumar",
    email: "rohit.k@gmail.com",
    mobile: "9555444333",
    score: 84,
  },
  {
    id: 9,
    name: "Anjali Desai",
    email: "anjali.d@gmail.com",
    mobile: "9888777666",
    score: 72,
  },
  {
    id: 10,
    name: "Vikas Malhotra",
    email: "vikas.m@gmail.com",
    mobile: "9444333222",
    score: 90,
  },
];

export default function JobDetails() {
  return (
    <>
      <HeaderTitle title={job.title} backButton />

      {/* Job Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Job Details
              </h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {job.location}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {job.experience}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {job.employmentType}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-slate-900 px-2.5 py-1 text-xs text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <AddCandidate />
        </div>
      </div>

      {/* Candidates Section */}
      <div className="bg-white rounded-2xl border border-slate-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 border-b">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Applied Candidates
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Candidates ranked by ATS relevance score
            </p>
          </div>

          <Input
            placeholder="Search by name or email"
            className="sm:max-w-xs"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Candidate
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Contact
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  ATS Score
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {candidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  className="hover:bg-slate-50 transition"
                >
                  <TableCell className="px-6 py-6">
                    <div className="font-medium text-slate-900">
                      {candidate.name}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      {candidate.email}
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-6 text-slate-700">
                    {candidate.mobile}
                  </TableCell>

                  <TableCell className="px-6 py-6">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        candidate.score >= 80
                          ? "bg-emerald-100 text-emerald-700"
                          : candidate.score >= 60
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {candidate.score}%
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-6 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        console.log("View CV for:", candidate.name)
                      }
                    >
                      View CV
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
