
import { useEffect, useState } from "react"
import HeaderTitle from "./common-components/HeaderTitle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AILoader from "./common-components/AILoader"


export default function AIScreening() {
const [job, setJob] = useState({
  title: "",
  description: "",
  skills: "",
  experience: "",
  location: "",
  employmentType: "",
})


  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const handleJobChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value })
  }

  const handleFileUpload = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const handleSubmit = () => {
    const formData = new FormData()

    formData.append("title", job.title)
    formData.append("description", job.description)
    formData.append("skills", job.skills)
    formData.append("experience", job.experience)
    formData.append("location", job.location)

    files.forEach((file) => {
      formData.append("cvs", file)
    })

    console.log("AI Screening Payload:")
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1])
    }

    // Start AI Loader
    setLoading(true)

    // Simulate AI processing time
    setTimeout(() => {
      setLoading(false)
      console.log("AI Screening Completed")
    }, 18000)
  }

  return (
    <>
      {/* Blur background when loading */}
      <div className={loading ? "blur-sm pointer-events-none" : ""}>
        <HeaderTitle title="AI Screening" />

        {/* Job JD Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Job Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 md:col-span-2">
              <Label>Job Title</Label>
              <Input
                name="title"
                placeholder="Frontend Developer"
                value={job.title}
                onChange={handleJobChange}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Job Description</Label>
              <Textarea
                name="description"
                rows={4}
                placeholder="Describe responsibilities and requirements"
                value={job.description}
                onChange={handleJobChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Required Skills</Label>
              <Input
                name="skills"
                placeholder="React, JavaScript, REST APIs"
                value={job.skills}
                onChange={handleJobChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Experience</Label>
              <Input
                name="experience"
                placeholder="2–4 years"
                value={job.experience}
                onChange={handleJobChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                name="location"
                placeholder="Remote / Bangalore"
                value={job.location}
                onChange={handleJobChange}
              />
            </div>
          </div>
        </div>

        {/* CV Upload Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Upload CVs (Bulk)
            </h2>
            <span className="text-sm text-slate-500">
              {files.length} files selected
            </span>
          </div>

          <div className="space-y-4">
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
            />

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="border rounded-xl divide-y">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {file.name}
                      </p>
                      <p className="text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB •{" "}
                        {file.type || "Unknown type"}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      CV
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Button
              disabled={files.length === 0}
              onClick={handleSubmit}
            >
              Run AI Screening
            </Button>
          </div>
        </div>
      </div>

      {/* AI Loader Modal */}
      {loading && <AILoader />}
    </>
  )
}
