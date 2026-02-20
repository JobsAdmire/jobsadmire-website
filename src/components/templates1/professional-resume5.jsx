import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const DarkResume = ({ userData }) => {
  const { t } = useTranslation('resume-generator');
  const resumeRef = useRef(null);

  // Extract data with same structure as NurseResumeTemplate
  const personal_data = userData?.userData?.personal_data || userData || {};
  const experience_data = userData?.userData?.experience_data || userData?.experience || {};
  const education_data = userData?.userData?.education_data || userData?.education || {};
  const skill_data = userData?.userData?.skill_data || userData?.skills || {};
  const project_data = userData?.userData?.project_data || userData?.projects || {};
  const achievement_data = userData?.userData?.achievement_data || userData?.achievements || {};

  const generatePDF = () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size: 210mm x 297mm

    html2canvas(resumeRef.current, {
      scale: 2,
      useCORS: true
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight); // Full page without margins
      pdf.save("cv.pdf");
    });
  };

  return (
    <div className="p-6">
      <div 
        ref={resumeRef} 
        className="w-full max-w-5xl mx-auto mt-12 bg-white overflow-hidden min-h-[1000px]" 
        id="cv"
      >
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left Section */}
          <div className="bg-gray-900 text-white p-4 flex flex-col items-center relative">
            <div className="absolute top-0 left-0 right-0 h-16 bg-blue-500"></div>
            <img 
              src={personal_data?.image || personal_data?.profileImage || "/api/placeholder/200/200"} 
              alt={t('alts.profileAlt')} 
              className="w-32 h-32 rounded-full object-cover border-4 border-white mt-16 shadow-md"
            />
            <h1 className="text-xl font-bold mt-4 text-center">
              {personal_data?.firstName ?? ""} {personal_data?.middleName ?? ""} {personal_data?.lastName ?? ""} 
              {personal_data?.fullName ?? "-"}
            </h1>
            <p className="text-md uppercase font-semibold mt-2 text-blue-300">
              {personal_data?.designation ?? "-"}
            </p>

            <div className="mt-6 text-center w-full">
              <p className="bg-blue-700 p-2 rounded">
                📞 <span className="text-[15px]">{personal_data?.phone ?? "-"}</span>
              </p>
              <p className="bg-blue-700 p-2 rounded mt-2">
                ✉️ <span className="text-[15px]">{personal_data?.email ?? "-"}</span>
              </p>
              <p className="bg-blue-700 p-2 rounded mt-2">
                📍 <span className="text-[15px]">{personal_data?.address ?? "-"}</span>
              </p>
            </div>

            {/* Skills - Enhanced with safe data access */}
            {(skill_data && Object.keys(skill_data).length > 0) && (
              <div className="mt-8 w-full text-left">
                <h2 className="text-lg font-bold border-b-2 border-white pb-2">
                  {t("sections.skills")}
                </h2>
                <ul className="mt-3 list-none space-y-1 text-[13px]">
                  {Array.isArray(skill_data) 
                    ? skill_data.map((skill, index) => (
                        <li key={`skill-${index}`}>• {skill?.name ?? skill ?? "-"}</li>
                      ))
                    : Object.values(skill_data).map((skill, index) => (
                        <li key={`skill-${index}`}>• {skill?.name ?? skill ?? "-"}</li>
                      ))
                  }
                </ul>
              </div>
            )}
            
            {/* Achievements - Enhanced with safe data access */}
            {(achievement_data && Object.keys(achievement_data).length > 0) && (
              <div className="mt-8 w-full text-left">
                <h2 className="text-lg font-bold border-b-2 border-white pb-2">
                  {t("sections.achievements")}
                </h2>
                <ul className="mt-3 list-none space-y-2">
                  {Array.isArray(achievement_data) 
                    ? achievement_data.map((achievement, index) => (
                        <li key={`achievement-${index}`} className="text-[13px]">
                          • {achievement?.title ?? achievement ?? "-"}
                        </li>
                      ))
                    : Object.values(achievement_data).map((achievement, index) => (
                        <li key={`achievement-${index}`} className="text-[13px]">
                          • {achievement?.title ?? achievement?.name ?? achievement ?? "-"}
                        </li>
                      ))
                  }
                </ul>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="col-span-1 md:col-span-2 bg-gray-100 p-6 md:p-10 text-gray-900">
            <div className="mb-6">
              <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2">
                About
              </h2>
              <p className="mt-3 text-gray-700 leading-relaxed text-[13px]">
                {personal_data?.summary ?? ""}
              </p>
            </div>

            {/* Experience - Enhanced with safe data access */}
            {(experience_data && Object.keys(experience_data).length > 0) && (
              <div className="mt-6">
                <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2">
                  {t("sections.experience")}
                </h2>
                <ul className="mt-3 list-none space-y-2 text-gray-700 text-sm">
                  {Object.values(experience_data).map((exp, index) => (
                    <li key={`exp-${index}`} className="pl-4 border-l-2 border-blue-500">
                      <strong className="text-blue-600">{exp?.title ?? "-"}</strong> at {exp?.company ?? "-"}
                      <div className="text-gray-600">
                        {exp?.startDate ?? "-"} - {exp?.endDate ?? "Present"}
                        {exp?.period && ` | ${exp.period}`}
                      </div>
                      <p className="mt-1">{exp?.description ?? "-"}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Education - Enhanced with safe data access */}
            {(education_data && Object.keys(education_data).length > 0) && (
              <div className="mt-6">
                <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2">
                  {t("sections.education")}
                </h2>
                <ul className="mt-3 list-none space-y-2 text-sm">
                  {Object.values(education_data).map((edu, index) => (
                    <li key={`edu-${index}`} className="pl-4 border-l-2 border-blue-500">
                      <strong className="text-blue-600">{edu?.degree ?? "-"}</strong> from {edu?.school ?? edu?.institution ?? "-"}
                      <div className="text-gray-600">
                        {edu?.startDate ?? "-"} - {edu?.endDate ?? "Present"}
                        {edu?.period && ` | ${edu.period}`}
                      </div>
                      <p className="mt-1">{edu?.description ?? "-"}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Projects - Enhanced with safe data access */}
            {(project_data && Object.keys(project_data).length > 0) && (
              <div className="mt-6">
                <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2">
                  Projects
                </h2>
                <ul className="mt-3 list-none space-y-2 text-gray-700">
                  {Object.values(project_data).map((project, index) => (
                    <li key={`project-${index}`} className="pl-4 border-l-2 border-blue-500">
                      <strong className="text-blue-600">{project?.name ?? project?.title ?? "-"}</strong>
                      <div className="text-gray-600">{project?.technologies ?? project?.tech ?? "-"}</div>
                      <p className="mt-1">{project?.description ?? "-"}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* References Section - Same as NurseResumeTemplate */}
            <div className="mt-6">
              <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2">
                {t("sections.references")}
              </h2>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-800">Harumi Kobayashi</h3>
                  <p className="text-sm text-gray-600">Wardiere Inc. / CEO</p>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> 123-456-7890
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    hello@reallygreatsite.com
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">Bailey Dupont</h3>
                  <p className="text-sm text-gray-600">Wardiere Inc. / CEO</p>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> 123-456-7890
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    hello@reallygreatsite.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6 text-center">
        <button
          onClick={generatePDF}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Download CV
        </button>
      </div>
    </div>
  );
};

export default DarkResume;