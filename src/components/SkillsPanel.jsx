import React, { useMemo } from "react";
import SkillCategory from "./SkillCategory";

// 7. Skills Panel Component
const SkillsPanel = ({ skills, country, city, scope }) => {
  const hardSkills = useMemo(() => {
    return skills
      .filter(s => s.SkillType === 'ST1')
      .reduce((acc, s) => {
        const existing = acc.find(x => x.Skill === s.Skill);
        if (existing) {
          existing.count += s.count;
        } else {
          acc.push({ Skill: s.Skill, count: s.count });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [skills]);

  const softSkills = useMemo(() => {
    return skills
      .filter(s => s.SkillType === 'ST2')
      .reduce((acc, s) => {
        const existing = acc.find(x => x.Skill === s.Skill);
        if (existing) {
          existing.count += s.count;
        } else {
          acc.push({ Skill: s.Skill, count: s.count });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [skills]);

  if (hardSkills.length === 0 && softSkills.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">
        Skills — <span className="text-blue-600">{country}</span> • {scope}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkillCategory 
          title="Top 10 — Hard Skills" 
          skills={hardSkills}
          colorClass="text-blue-600"
        />
        <SkillCategory 
          title="Top 10 — Soft Skills" 
          skills={softSkills}
          colorClass="text-green-600"
        />
      </div>
    </div>
  );
};
export default SkillsPanel;