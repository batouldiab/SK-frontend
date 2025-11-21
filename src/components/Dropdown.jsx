import React from "react";

// 1. Dropdown Component
const Dropdown = ({ label, options, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);
export default Dropdown;