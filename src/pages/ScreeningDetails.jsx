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

const jobDetails = {
  title: "Frontend Developer",
  description:
    "We are looking for a Frontend Developer to build modern UI components and collaborate with backend teams.",
  skills: ["React", "JavaScript", "REST APIs"],
  experience: "2–4 years",
  location: "Remote",
};

const uploadedCVsCount = 5;

const candidates = [
  { id: 1, name: "Rahul Mehta", score: 92 },
  { id: 2, name: "Priya Singh", score: 88 },
  { id: 3, name: "Aman Sharma", score: 85 },
  { id: 4, name: "Neha Verma", score: 74 },
  { id: 5, name: "Rohit Kumar", score: 63 },
];

// Sort by score DESC
const sortedCandidates = [...candidates].sort((a, b) => b.score - a.score);

// Best matches = all strong matches
const bestMatches = sortedCandidates.filter((c) => c.score >= 85);

const getMatchMeta = (score) => {
  if (score >= 85) {
    return {
      label: "Strong Match",
      badge: "bg-emerald-100 text-emerald-700",
      row: "bg-emerald-50/50",
      card: "bg-emerald-50 border-emerald-200",
    };
  }
  if (score >= 70) {
    return {
      label: "Good Match",
      badge: "bg-amber-100 text-amber-700",
      row: "",
      card: "",
    };
  }
  return {
    label: "Low Match",
    badge: "bg-rose-100 text-rose-700",
    row: "",
    card: "",
  };
};

export default function ScreeningDetails() {
  return (
    <>
      <HeaderTitle title="Screening Results" backButton />

      {/* 1️⃣ Job Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {jobDetails.title}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Job overview and screening context
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-sm mb-5">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            📍 {jobDetails.location}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            ⏱ {jobDetails.experience}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            📄 {uploadedCVsCount} CVs screened
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-700 mb-5 max-w-3xl leading-relaxed">
          {jobDetails.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {jobDetails.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 2️⃣ Best Matching Candidates */}
      {bestMatches.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Best Matching Candidates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bestMatches.map((candidate) => {
              const meta = getMatchMeta(candidate.score);

              return (
                <div
                  key={candidate.id}
                  className={`rounded-2xl border p-5 flex items-center justify-between ${meta.card}`}
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {candidate.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      {meta.label} based on AI screening
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-4 py-1 text-sm font-semibold ${meta.badge}`}
                    >
                      {candidate.score}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3️⃣ All Candidates */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-6 py-5 border-b">
          <h2 className="text-lg font-semibold text-slate-900">
            All Candidates
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Ranked by ATS relevance score
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="px-4 py-2 text-[11px] uppercase text-slate-500">
                Candidate
              </TableHead>
              <TableHead className="px-4 py-2 text-[11px] uppercase text-slate-500">
                Match Level
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
            {sortedCandidates.map((candidate) => {
              const meta = getMatchMeta(candidate.score);

              return (
                <TableRow key={candidate.id} className={meta.row}>
                  <TableCell className="px-4 py-2.5 font-medium text-sm">
                    {candidate.name}
                  </TableCell>

                  <TableCell className="px-4 py-2.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.badge}`}
                    >
                      {meta.label}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-2.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.badge}`}
                    >
                      {candidate.score}%
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-2.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => console.log("View CV:", candidate.name)}
                    >
                      View CV
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
