import React from "react";
import SkillItem from "./SkillItem";

// 6. Skill Category Component (for hard/soft skills section)
const SkillCategory = ({ title, skills, colorClass }) => (
  <div>
    <h4 className="font-medium mb-3 text-gray-700">{title}</h4>
    {skills.length > 0 ? (
      <div className="space-y-2">
        {skills.map((skill, idx) => (
          <SkillItem 
            key={idx} 
            skill={skill.Skill} 
            count={skill.count}
            colorClass={colorClass}
          />
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500">No data available</p>
    )}
  </div>
);

export default SkillCategory;