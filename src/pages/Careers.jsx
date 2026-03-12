import AddCandidate from "./AddCandidate";
import { Badge } from "@/components/ui/badge";

const jobs = [
  {
    id: "job-101",
    title: "Frontend Developer",
    location: "Remote",
    experience: "2–4 years",
    type: "Full-time",
  },
  {
    id: "job-102",
    title: "Backend Engineer",
    location: "Bangalore",
    experience: "3–5 years",
    type: "Full-time",
  },
  {
    id: "job-103",
    title: "UI/UX Designer",
    location: "Mumbai",
    experience: "1–3 years",
    type: "Contract",
  },
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Careers</h1>
          <p className="text-sm text-slate-600 mt-1">
            Join our team and help us build the future of hiring
          </p>
        </div>

        {/* Jobs */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-slate-300 hover:shadow-sm transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left */}
                <div>
                  <h2 className="text-base font-medium text-slate-900">
                    {job.title}
                  </h2>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {job.location}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {job.experience}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {job.type}
                    </Badge>
                  </div>
                </div>

                {/* Right */}
                <div className="shrink-0">
                  <AddCandidate label="Apply" jobId={job.id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 text-xs text-slate-500">
          We review every application carefully. Shortlisted candidates will be
          contacted by our team.
        </div>
      </div>
    </div>
  );
}
