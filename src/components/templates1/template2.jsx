import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";

const ProfessionalResumeTemplate2 = ({ userData }) => {
  const { t } = useTranslation("resume-generator");
  const [profileImage, setProfileImage] = useState(null);
  
  // Handle both prop data and localStorage data
  const [resumeData, setResumeData] = useState({
    personal_data: {},
    experience_data: [],
    education_data: [],
    skill_data: [],
    achievements_data: [],
    project_data: []
  });

  // Load and consolidate data from both props and localStorage
  useEffect(() => {
    const loadData = () => {
      // Helper function to safely parse localStorage data
      const getLocalStorageData = (key, fallback = {}) => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            // Handle both array and object formats
            if (Array.isArray(parsed)) {
              return parsed;
            } else if (typeof parsed === 'object' && parsed !== null) {
              // Convert object with numeric keys to array
              if (Object.keys(parsed).every(key => !isNaN(key))) {
                return Object.values(parsed);
              }
              return parsed;
            }
          }
        } catch (error) {
          console.error(`Error parsing ${key} from localStorage:`, error);
        }
        return fallback;
      };

      // Load data from localStorage (primary source)
      const personal_data = getLocalStorageData('personal_information', {});
      const experience_data = getLocalStorageData('experience_information', []);
      const education_data = getLocalStorageData('education_information', []);
      const skill_data = getLocalStorageData('skill_information', []);
      const achievements_data = getLocalStorageData('achievement_information', []);
      const project_data = getLocalStorageData('project_information', []);

      // Merge with prop data if available (fallback)
      const mergedData = {
        personal_data: { ...personal_data, ...(userData?.personal_data || {}) },
        experience_data: experience_data.length > 0 ? experience_data : (userData?.experience_data || []),
        education_data: education_data.length > 0 ? education_data : (userData?.education_data || []),
        skill_data: skill_data.length > 0 ? skill_data : (userData?.skill_data || []),
        achievements_data: achievements_data.length > 0 ? achievements_data : (userData?.achievements_data || []),
        project_data: project_data.length > 0 ? project_data : (userData?.project_data || [])
      };

      setResumeData(mergedData);

      // Load profile image
      if (mergedData.personal_data.imagePreview) {
        setProfileImage(mergedData.personal_data.imagePreview);
      }
    };

    loadData();
  }, [userData]);

  // Helper function to safely access data
  const safeGet = (obj, key, fallback = '-') => {
    return obj && obj[key] ? obj[key] : fallback;
  };

  // Helper function to render array data
  const renderArrayData = (dataArray, renderItem) => {
    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      return <p className="text-sm text-gray-500 italic">{t("fallbacks.noDataAvailable")}</p>;
    }
    return dataArray.map((item, index) => renderItem(item, index));
  };

  return (
    <div className="max-w-4xl mx-auto overflow-hidden bg-white shadow-2xl">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-transparent to-transparent"></div>
          <div className="absolute top-4 right-4 w-32 h-32 border border-white opacity-20 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 border border-white opacity-20 rounded-full"></div>
        </div>
        
        <div className="relative z-10 px-8 py-10">
          <div className="flex items-center space-x-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={t("alts.profileAlt")}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-slate-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-16 h-16 text-slate-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            {/* Name and Title */}
            <div className="flex-grow">
              <h1 className="text-4xl font-bold mb-2 tracking-wide">
                {safeGet(resumeData.personal_data, 'firstName')} {safeGet(resumeData.personal_data, 'middleName', '')} {safeGet(resumeData.personal_data, 'lastName')}
              </h1>
              <h2 className="text-xl font-light mb-4 text-slate-200 uppercase tracking-widest">
                {safeGet(resumeData.personal_data, 'designation')}
              </h2>
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{safeGet(resumeData.personal_data, 'phone')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{safeGet(resumeData.personal_data, 'email')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{safeGet(resumeData.personal_data, 'address')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Column */}
        <div className="w-1/3 bg-slate-50 p-8">
          {/* About Me */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-600 uppercase tracking-wide">
              {t("sections.aboutMe")}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {safeGet(resumeData.personal_data, 'summary', t('fallbacks.noSummaryAvailable'))}
            </p>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-600 uppercase tracking-wide">
              {t("sections.skills")}
            </h3>
            <div className="space-y-3">
              {renderArrayData(resumeData.skill_data, (skill, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-800">
                      {typeof skill === 'string' ? skill : safeGet(skill, 'name', t('fallbacks.unnamedSkill'))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          {resumeData.achievements_data && resumeData.achievements_data.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-600 uppercase tracking-wide">
                {t("sections.achievements")}
              </h3>
              <div className="space-y-4">
                {renderArrayData(resumeData.achievements_data, (achievement, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-1">{safeGet(achievement, 'title')}</h4>
                    {achievement.date && (
                      <p className="text-xs text-slate-500 mb-2">{achievement.date}</p>
                    )}
                    {achievement.description && (
                      <p className="text-sm text-slate-600">{achievement.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resumeData.project_data && resumeData.project_data.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-600 uppercase tracking-wide">
                {t("sections.projects")}
              </h3>
              <div className="space-y-4">
                {renderArrayData(resumeData.project_data, (project, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-1">{safeGet(project, 'name')}</h4>
                    {project.link && (
                      <p className="text-xs text-blue-600 mb-2 break-all">{project.link}</p>
                    )}
                    {project.description && (
                      <p className="text-sm text-slate-600">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-2/3 p-8">
          {/* Experience */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-slate-300 uppercase tracking-wide">
              {t("sections.workExperience")}
            </h3>
            <div className="space-y-6">
              {renderArrayData(resumeData.experience_data, (experience, index) => (
                <div key={index} className="relative pl-8 border-l-2 border-slate-300">
                  {/* Timeline dot */}
                  <div className="absolute w-4 h-4 bg-slate-600 rounded-full -left-[9px] top-0"></div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{safeGet(experience, 'title')}</h4>
                        <h5 className="text-md font-semibold text-slate-600">{safeGet(experience, 'company')}</h5>
                        {experience.location && (
                          <p className="text-sm text-slate-500">{experience.location}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-slate-600 text-white text-xs font-medium rounded-full">
                          {safeGet(experience, 'startDate')} - {safeGet(experience, 'endDate', 'Present')}
                        </span>
                      </div>
                    </div>
                    {experience.description && (
                      <p className="text-sm text-slate-700 leading-relaxed">{experience.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-slate-300 uppercase tracking-wide">
              {t("sections.education")}
            </h3>
            <div className="space-y-6">
              {renderArrayData(resumeData.education_data, (education, index) => (
                <div key={index} className="relative pl-8 border-l-2 border-slate-300">
                  {/* Timeline dot */}
                  <div className="absolute w-4 h-4 bg-slate-600 rounded-full -left-[9px] top-0"></div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{safeGet(education, 'degree')}</h4>
                        <h5 className="text-md font-semibold text-slate-600">{safeGet(education, 'school')}</h5>
                        {education.city && (
                          <p className="text-sm text-slate-500">{education.city}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-slate-600 text-white text-xs font-medium rounded-full">
                          {safeGet(education, 'startDate')} - {safeGet(education, 'endDate', 'Present')}
                        </span>
                      </div>
                    </div>
                    {education.description && (
                      <p className="text-sm text-slate-700 leading-relaxed">{education.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalResumeTemplate2;