import React from "react";

export default function PageLoader({pageName}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg">Loading {pageName}...</p>
      </div>
    </div>
  );
}
