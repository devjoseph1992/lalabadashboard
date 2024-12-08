// src/pages/error/UnauthorizedPage.tsx

import React from "react";

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Unauthorized</h1>
        <p className="text-lg mt-4 text-gray-700">
          You do not have permission to view this page.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Go Back to Login
        </a>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
