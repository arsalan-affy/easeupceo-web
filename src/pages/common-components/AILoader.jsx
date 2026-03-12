import { useEffect, useState } from "react"

const messages = [
  "Screening started…",
  "Fetching data from uploaded CVs",
  "Analyzing job description",
  "Extracting skills and experience",
  "Matching CVs with job requirements",
  "Calculating ATS scores",
  "Finalizing ranked candidates",
]

export default function AILoader() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) =>
        prev < messages.length - 1 ? prev + 1 : prev
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl px-10 py-8 w-full max-w-md text-center">
        {/* Spinner */}
        <div className="mx-auto mb-6 h-12 w-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />

        {/* AI Status */}
        <h2 className="text-lg font-semibold text-slate-900">
          AI Screening in Progress
        </h2>

        <p className="mt-3 text-sm text-slate-600">
          {messages[step]}
        </p>

        {/* Progress */}
        <div className="mt-6 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-slate-900 transition-all duration-700"
            style={{
              width: `${((step + 1) / messages.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
