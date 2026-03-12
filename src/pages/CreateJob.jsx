import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    experience: "",
    location: "",
    type: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title) newErrors.title = "Job title is required";
    if (!form.description)
      newErrors.description = "Job description is required";
    if (!form.skills) newErrors.skills = "At least one skill is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    console.log("Create Job Payload:", form);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">+ Create Job</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[760px] p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b">
          <DialogTitle className="text-xl font-semibold">
            Create Job
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            Add a new role and start receiving applications
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-0 space-y-6">
          {/* Section: Basics */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Job Title *</Label>
              <Input
                name="title"
                placeholder="Frontend Developer"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Job Description *</Label>
              <Textarea
                name="description"
                rows={5}
                placeholder="Describe responsibilities, expectations, and impact of this role"
                value={form.description}
                onChange={handleChange}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Section: Requirements */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Requirements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Required Skills *</Label>
                <Input
                  name="skills"
                  placeholder="React, JavaScript, REST APIs"
                  value={form.skills}
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-500">
                  Separate skills with commas
                </p>
                {errors.skills && (
                  <p className="text-xs text-red-500">{errors.skills}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Experience</Label>
                <Input
                  name="experience"
                  placeholder="2–4 years"
                  value={form.experience}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  name="location"
                  placeholder="Remote / Bangalore"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Employment Type</Label>

                <Select
                  value={form.type}
                  onValueChange={(value) => setForm({ ...form, type: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-slate-50">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>Create Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
