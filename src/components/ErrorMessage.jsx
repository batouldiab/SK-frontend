import React from "react";
import { AlertCircle } from "lucide-react";

// 10. Error Message Component
const ErrorMessage = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
      <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
      <p className="text-center text-gray-800 font-medium mb-2">Error Loading Data</p>
      <p className="text-center text-sm text-gray-600">{message}</p>
    </div>
  </div>
);

export default ErrorMessage;