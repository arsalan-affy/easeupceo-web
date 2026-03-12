import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function BackButton({ text = "Back" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-100 text-lg"
    >
      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
        <ChevronLeft className="w-3 h-3" />
      </span>
      {text}
    </button>
  );
}
