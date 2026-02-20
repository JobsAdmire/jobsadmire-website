import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";

const HeaderStyleResume = ({ userData }) => {
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
      {/* Header Section - Blue with Profile */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 border border-white opacity-20 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 border border-white opacity-20 rounded-full -ml-24 -mb-24"></div>
        </div>
        
        <div className="relative z-10 px-8 py-10">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
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
                  <div className="flex items-center justify-center w-full h-full bg-blue-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-16 h-16 text-blue-600"
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
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-4xl font-bold mb-3 tracking-wide">
                {safeGet(resumeData.personal_data, 'firstName')} {safeGet(resumeData.personal_data, 'middleName', '')} {safeGet(resumeData.personal_data, 'lastName')}
              </h1>
              <h2 className="text-xl font-light text-blue-100 uppercase tracking-wider">
                {safeGet(resumeData.personal_data, 'designation')}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* About & Contact Section - Dark Gray */}
      <div className="bg-gray-800 text-white px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About Me */}
          <div>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-blue-400 uppercase tracking-wide">
              {t("sections.aboutMe")}
            </h2>
            <p className="text-sm leading-relaxed text-gray-300">
              {safeGet(resumeData.personal_data, 'summary', t('fallbacks.noSummaryAvailable'))}
            </p>
          </div>
          
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-blue-400 uppercase tracking-wide">
              {t("sections.contactMe")}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-sm">{safeGet(resumeData.personal_data, 'phone')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm break-all">{safeGet(resumeData.personal_data, 'email')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm">{safeGet(resumeData.personal_data, 'address')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - White Background */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Experience Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 uppercase tracking-wide">
              {t("sections.workExperience")}
            </h2>
            <div className="space-y-6">
              {renderArrayData(resumeData.experience_data, (experience, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                    <div className="flex-grow">
                      <h4 className="text-lg font-bold text-gray-800 mb-1">{safeGet(experience, 'title')}</h4>
                      <h5 className="text-md font-semibold text-blue-600 mb-1">{safeGet(experience, 'company')}</h5>
                      {experience.location && (
                        <p className="text-sm text-gray-500 mb-2">{experience.location}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0 mt-2 sm:mt-0">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {safeGet(experience, 'startDate')} - {safeGet(experience, 'endDate', 'Present')}
                      </span>
                    </div>
                  </div>
                  {experience.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">{experience.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 uppercase tracking-wide">
              {t("sections.education")}
            </h2>
            <div className="space-y-4">
              {renderArrayData(resumeData.education_data, (education, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-bold text-gray-800 mb-1">{safeGet(education, 'degree')}</h4>
                  <h5 className="font-semibold text-blue-600 mb-1">{safeGet(education, 'school')}</h5>
                  <div className="text-sm text-gray-600 mb-2">
                    {safeGet(education, 'startDate')} - {safeGet(education, 'endDate', 'Present')}
                  </div>
                  {education.city && (
                    <p className="text-sm text-gray-500 mb-2">{education.city}</p>
                  )}
                  {education.description && (
                    <p className="text-sm text-gray-700">{education.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 uppercase tracking-wide">
              {t("sections.skills")}
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {renderArrayData(resumeData.skill_data, (skill, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                  {typeof skill === 'string' ? skill : safeGet(skill, 'name', t('fallbacks.unnamedSkill'))}
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          {resumeData.project_data && resumeData.project_data.length > 0 && (
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 uppercase tracking-wide">
                {t("sections.projects")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderArrayData(resumeData.project_data, (project, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-2">{safeGet(project, 'name')}</h4>
                    {project.link && (
                      <p className="text-sm text-blue-600 mb-2 break-all">{project.link}</p>
                    )}
                    {project.description && (
                      <p className="text-sm text-gray-700">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Section */}
          {resumeData.achievements_data && resumeData.achievements_data.length > 0 && (
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 uppercase tracking-wide">
                {t("sections.achievements")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderArrayData(resumeData.achievements_data, (achievement, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800 mb-1">{safeGet(achievement, 'title')}</h4>
                      {achievement.date && (
                        <p className="text-xs text-gray-500 mb-1">{achievement.date}</p>
                      )}
                      {achievement.description && (
                        <p className="text-sm text-gray-700">{achievement.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* References Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 uppercase tracking-wide">
            {t("sections.references")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t("fallbacks.availableUponRequest")}</h3>
              <p className="text-sm text-gray-600">{t("messages.referencesAvailableOnRequest")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderStyleResume;