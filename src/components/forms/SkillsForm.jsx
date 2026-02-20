// src/components/forms/SkillsForm.js
import React from 'react';
import { useTranslation } from 'next-i18next';
import { Plus, Trash2 } from 'lucide-react';

const SkillsForm = ({ cvData, updateSkills, addSkill, removeSkill }) => {
  const { t } = useTranslation('resume-generator');
  return (
    <div className="space-y-4">
      {cvData.skills.map((skill, index) => (
        <div key={skill.id} className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={skill.skill}
              onChange={(e) => updateSkills(skill.id, 'skill', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('forms.skillsPlaceholder')}
            />
          </div>
          <div className="w-32">
            <select
              value={skill.level}
              onChange={(e) => updateSkills(skill.id, 'level', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Beginner">{t('forms.beginner')}</option>
              <option value="Intermediate">{t('forms.intermediate')}</option>
              <option value="Advanced">{t('forms.advanced')}</option>
              <option value="Expert">{t('forms.expert')}</option>
            </select>
          </div>
          <button
            onClick={() => removeSkill(skill.id)}
            className="text-red-500 hover:text-red-700"
            disabled={cvData.skills.length === 1}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        onClick={addSkill}
        className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <Plus size={16} className="mr-2" />
        {t('forms.addSkill')}
      </button>
    </div>
  );
};

export default SkillsForm;