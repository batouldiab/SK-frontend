import React from "react";

const SkillItem = ({ skill, count, colorClass }) => (
  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
    <span className="text-sm">{skill}</span>
    <span className={`text-sm font-medium ${colorClass}`}>{count}</span>
  </div>
);

export default SkillItem;