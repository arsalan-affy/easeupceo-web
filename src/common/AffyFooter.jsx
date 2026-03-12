import React from "react";
import affyLogo from "../assets/affylogo.png";

export default function AffyFooter() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col items-center text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          © Copyright 2025 AUM Securities. All Rights Reserved.
        </p>

        <a
          href="https://affyclouditsolutions.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-90 transition group"
        >
          <img
            src={affyLogo}
            alt="Affy Cloud IT Solutions"
            className="h-6 w-auto object-contain"
          />

          <p className="text-sm text-gray-700 dark:text-gray-300">
            Developed by{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors group-hover:text-[#00B4B5]">
              Affy Cloud IT Solutions
            </span>
          </p>
        </a>
      </div>
    </footer>
  );
}
