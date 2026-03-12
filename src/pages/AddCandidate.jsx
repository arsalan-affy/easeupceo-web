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
import { Label } from "@/components/ui/label";

export default function AddCandidate({ label = "+ Add Candidate", jobId }) {
  const isApplyFlow = label.toLowerCase().includes("apply");

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    cv: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });

    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.mobile) newErrors.mobile = "Mobile is required";
    if (!form.cv) newErrors.cv = "CV is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("mobile", form.mobile);
    formData.append("cv", form.cv);

    console.log(isApplyFlow ? "Apply Job Payload:" : "Add Candidate Payload:");

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{label}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b">
          <DialogTitle className="text-xl font-semibold">
            {isApplyFlow ? "Apply for Job" : "Add Candidate"}
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            {isApplyFlow
              ? "Submit your profile for this position"
              : "Add candidate details for ATS evaluation"}
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input name="name" placeholder="John Doe" onChange={handleChange} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email *</Label>
            <Input
              type="email"
              name="email"
              placeholder="john.doe@email.com"
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Mobile *</Label>
            <Input
              name="mobile"
              placeholder="9876543210"
              onChange={handleChange}
            />
            {errors.mobile && (
              <p className="text-xs text-red-500">{errors.mobile}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Upload CV *</Label>
            <Input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
            />
            <p className="text-xs text-slate-500">
              PDF, DOC, or DOCX (max 5MB)
            </p>
            {errors.cv && <p className="text-xs text-red-500">{errors.cv}</p>}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-slate-50">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>
            {isApplyFlow ? "Apply Now" : "Add Candidate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
