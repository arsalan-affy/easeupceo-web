import React from "react";

export default function AffyFooter() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col items-center text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Worklynx. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
