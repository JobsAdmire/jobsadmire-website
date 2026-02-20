import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";

const NurseResumeTemplate = ({ userData }) => {
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
    <div className="max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Left Column - Dark Blue */}
        <div className="w-full p-8 text-white bg-blue-800 md:w-1/3">
          {/* Profile Image and Name */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-40 h-40 mb-4 overflow-hidden bg-gray-200 border-4 border-gray-300 rounded-full">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={t("alts.profileAlt")}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 text-gray-500"
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
            <h1 className="mt-2 text-2xl font-bold text-center">
              {safeGet(resumeData.personal_data, 'firstName')} {safeGet(resumeData.personal_data, 'middleName', '')} {safeGet(resumeData.personal_data, 'lastName')}
            </h1>
            <p className="mt-1 italic text-center text-blue-300">
              {safeGet(resumeData.personal_data, 'designation')}
            </p>
          </div>

          {/* Contact Section */}
          <div className="mb-8">
            <h2 className="pb-2 mb-4 text-xl font-semibold border-b border-blue-600">
              {t("sections.contact")}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{safeGet(resumeData.personal_data, 'phone')}</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{safeGet(resumeData.personal_data, 'email')}</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{safeGet(resumeData.personal_data, 'address')}</span>
              </div>
            </div>
          </div>

          {/* About Me Section */}
          <div className="mb-8">
            <h2 className="pb-2 mb-4 text-xl font-semibold border-b border-blue-600">
              {t("sections.aboutMe")}
            </h2>
            <p className="text-sm leading-relaxed">
              {safeGet(resumeData.personal_data, 'summary', t('fallbacks.noSummaryAvailable'))}
            </p>
          </div>

          {/* Skills Section */}
          <div>
            <h2 className="pb-2 mb-4 text-xl font-semibold border-b border-blue-600">
              {t("sections.skills")}
            </h2>
            <ul className="pl-5 space-y-2 list-disc">
              {renderArrayData(resumeData.skill_data, (skill, index) => (
                <li key={index}>
                  {typeof skill === 'string' ? skill : safeGet(skill, 'name', t('fallbacks.unnamedSkill'))}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column - White */}
        <div className="w-full p-8 md:w-2/3">
          {/* Education Section */}
          <div className="mb-8">
            <h2 className="pb-2 mb-6 text-xl font-semibold text-blue-800 border-b border-gray-300">
              {t("sections.education")}
            </h2>
            {renderArrayData(resumeData.education_data, (education, index) => (
              <div key={index} className="relative pl-6 mb-6 border-l-2 border-blue-400">
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full -left-[7px] top-1.5"></div>
                <h3 className="text-base font-bold">{safeGet(education, 'degree')}</h3>
                <h4 className="text-blue-800">{safeGet(education, 'school')}</h4>
                <div className="text-sm font-medium text-right text-gray-600">
                  {safeGet(education, 'startDate')} - {safeGet(education, 'endDate', 'Present')}
                </div>
                {education.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {education.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Experience Section */}
          <div className="mb-8">
            <h2 className="pb-2 mb-6 text-xl font-semibold text-blue-800 border-b border-gray-300">
              {t("sections.experience")}
            </h2>
            {renderArrayData(resumeData.experience_data, (experience, index) => (
              <div key={index} className="relative pl-6 mb-6 border-l-2 border-blue-400">
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full -left-[7px] top-1.5"></div>
                <h3 className="text-base font-bold">{safeGet(experience, 'title')}</h3>
                <h4 className="text-blue-800">{safeGet(experience, 'company')}</h4>
                <div className="text-sm font-medium text-right text-gray-600">
                  {safeGet(experience, 'startDate')} - {safeGet(experience, 'endDate', 'Present')}
                </div>
                {experience.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {experience.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Projects Section */}
          {resumeData.project_data && resumeData.project_data.length > 0 && (
            <div className="mb-8">
              <h2 className="pb-2 mb-6 text-xl font-semibold text-blue-800 border-b border-gray-300">
                {t("sections.projects")}
              </h2>
              {renderArrayData(resumeData.project_data, (project, index) => (
                <div key={index} className="relative pl-6 mb-6 border-l-2 border-blue-400">
                  <div className="absolute w-3 h-3 bg-blue-400 rounded-full -left-[7px] top-1.5"></div>
                  <h3 className="text-base font-bold">{safeGet(project, 'name')}</h3>
                  {project.link && (
                    <p className="text-sm text-blue-600 break-all">{project.link}</p>
                  )}
                  {project.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Achievements Section */}
          {resumeData.achievements_data && resumeData.achievements_data.length > 0 && (
            <div className="mb-8">
              <h2 className="pb-2 mb-6 text-xl font-semibold text-blue-800 border-b border-gray-300">
                {t("sections.achievements")}
              </h2>
              {renderArrayData(resumeData.achievements_data, (achievement, index) => (
                <div key={index} className="relative pl-6 mb-6 border-l-2 border-blue-400">
                  <div className="absolute w-3 h-3 bg-blue-400 rounded-full -left-[7px] top-1.5"></div>
                  <h3 className="text-base font-bold">{safeGet(achievement, 'title')}</h3>
                  {achievement.date && (
                    <div className="text-sm font-medium text-right text-gray-600">
                      {achievement.date}
                    </div>
                  )}
                  {achievement.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {achievement.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* References Section */}
          <div>
            <h2 className="pb-2 mb-6 text-xl font-semibold text-blue-800 border-b border-gray-300">
              {t("sections.references")}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="mb-4">
                <h3 className="text-base font-bold">{t("fallbacks.availableUponRequest")}</h3>
                <p className="text-sm text-gray-600">{t("messages.referencesAvailableOnRequest")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ONLY CHANGE: Enhanced print CSS for natural page flow */}
      <style jsx>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            margin: 0.5in;
            size: A4;
          }

          .max-w-4xl {
            max-width: none !important;
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }

          .flex {
            display: flex !important;
          }

          .md\\:flex-row {
            flex-direction: row !important;
          }

          .md\\:w-1\\/3 {
            width: 33.333333% !important;
            flex: none !important;
          }

          .md\\:w-2\\/3 {
            width: 66.666667% !important;
            flex: none !important;
          }

          .bg-blue-800 {
            background-color: #1e40af !important;
          }

          .text-white {
            color: white !important;
          }

          .border-blue-600 {
            border-color: #2563eb !important;
          }

          .text-blue-300 {
            color: #93c5fd !important;
          }

          .text-blue-800 {
            color: #1e40af !important;
          }

          .bg-blue-400 {
            background-color: #60a5fa !important;
          }

          .border-blue-400 {
            border-color: #60a5fa !important;
          }

          .text-blue-600 {
            color: #2563eb !important;
          }

          /* Remove any height restrictions that prevent page flow */
          .overflow-hidden {
            overflow: visible !important;
          }

          /* Allow content to break across pages naturally */
          .mb-8, .mb-6, .mb-4 {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Ensure sections can span multiple pages if needed */
          .relative.pl-6.mb-6 {
            page-break-inside: auto;
            break-inside: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default NurseResumeTemplate;