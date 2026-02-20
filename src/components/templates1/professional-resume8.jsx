import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ReverseLayoutResume = ({ userData }) => {
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
        className="max-w-4xl w-full bg-white shadow-lg flex flex-col md:flex-row mx-auto mt-12 overflow-hidden min-h-[1000px]"
        id="cv"
      >
        {/* Left Section */}
        <div className="w-full md:w-2/3 p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              {personal_data?.firstName ?? ""} {personal_data?.middleName ?? ""} {personal_data?.lastName ?? ""} 
              {personal_data?.fullName ?? "-"}
            </h1>
            <p className="text-red-500 text-lg font-semibold mt-4">{personal_data?.designation ?? "-"}</p>
          </div>

          {/* Contact Me */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-red-500">{t("sections.contactMe")}</h2>
            <p className="text-gray-600">📞 <span className="text-[15px]">{personal_data?.phone ?? "-"}</span></p>
            <p className="text-gray-600">✉️ <span className="text-[15px]">{personal_data?.email ?? "-"}</span></p>
            <p className="text-gray-600">📍 <span className="text-[15px]">{personal_data?.address ?? "-"}</span></p>
          </div>

          {/* Job Experience - Enhanced with safe data access */}
          {(experience_data && Object.keys(experience_data).length > 0) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-red-500">{t("sections.jobExperience")}</h2>
              <div className="mt-3">
                {Object.values(experience_data).map((exp, index) => (
                  <div key={`exp-${index}`} className="mb-4">
                    <div className="font-semibold text-gray-800">{exp?.title ?? "-"}</div>
                    <div className="text-red-500">{exp?.company ?? "-"}</div>
                    <div className="text-gray-600 text-sm">
                      {exp?.startDate ?? "-"} - {exp?.endDate ?? "Present"}
                      {exp?.period && ` | ${exp.period}`}
                    </div>
                    <p className="text-gray-600 text-[13px] mt-1">{exp?.description ?? "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education - Enhanced with safe data access */}
          {(education_data && Object.keys(education_data).length > 0) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-red-500">{t("sections.education")}</h2>
              <div className="mt-3">
                {Object.values(education_data).map((edu, index) => (
                  <div key={`edu-${index}`} className="mb-4">
                    <div className="font-semibold text-gray-800">{edu?.degree ?? "-"}</div>
                    <div className="text-red-500">{edu?.school ?? edu?.institution ?? "-"}</div>
                    <div className="text-gray-600 text-sm">
                      {edu?.startDate ?? "-"} - {edu?.endDate ?? "Present"}
                      {edu?.period && ` | ${edu.period}`}
                    </div>
                    <p className="text-gray-600 text-[13px] mt-1">{edu?.description ?? "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References Section - Same as NurseResumeTemplate */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-red-500">{t("sections.references")}</h2>
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

        {/* Right Section */}
        <div className="w-full md:w-1/3 bg-gray-900 text-white p-6">
          {/* Profile Image */}
          <div className="flex justify-center mb-4">
            <img 
              className="w-24 h-24 rounded-full border-4 border-red-500 object-cover" 
              src={personal_data?.image || personal_data?.profileImage || "/api/placeholder/200/200"} 
              alt={t('alts.profileAlt')}
            />
          </div>

          {/* About Me */}
          <div>
            <h2 className="text-lg font-semibold text-red-500">{t("sections.aboutMe")}</h2>
            <p className="text-gray-300 mt-2 text-[13px]">{personal_data?.summary ?? ""}</p>
          </div>

          {/* Projects - Enhanced with safe data access */}
          {(project_data && Object.keys(project_data).length > 0) && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-green-400">Projects</h2>
              <div className="mt-2">
                {Object.values(project_data).map((project, index) => (
                  <div key={`project-${index}`} className="mb-3">
                    <div className="font-semibold text-white">{project?.name ?? project?.title ?? "-"}</div>
                    <div className="text-green-300 text-sm">{project?.technologies ?? project?.tech ?? "-"}</div>
                    <p className="text-gray-300 text-[13px]">{project?.description ?? "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements - Enhanced with safe data access */}
          {(achievement_data && Object.keys(achievement_data).length > 0) && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-green-400">Achievements</h2>
              <ul className="mt-2 list-disc pl-5">
                {Array.isArray(achievement_data) 
                  ? achievement_data.map((achievement, index) => (
                      <li key={`achievement-${index}`} className="text-gray-300 text-[13px] mb-1">
                        {achievement?.title ?? achievement ?? "-"}
                      </li>
                    ))
                  : Object.values(achievement_data).map((achievement, index) => (
                      <li key={`achievement-${index}`} className="text-gray-300 text-[13px] mb-1">
                        {achievement?.title ?? achievement?.name ?? achievement ?? "-"}
                      </li>
                    ))
                }
              </ul>
            </div>
          )}

          {/* Skills - Enhanced with safe data access */}
          {(skill_data && Object.keys(skill_data).length > 0) && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-orange-400">{t("sections.skills")}</h2>
              <ul className="mt-2 list-disc pl-5">
                {Array.isArray(skill_data) 
                  ? skill_data.map((skill, index) => (
                      <li key={`skill-${index}`} className="text-gray-300 text-[13px] mb-1">
                        {skill?.name ?? skill ?? "-"}
                      </li>
                    ))
                  : Object.values(skill_data).map((skill, index) => (
                      <li key={`skill-${index}`} className="text-gray-300 text-[13px] mb-1">
                        {skill?.name ?? skill ?? "-"}
                      </li>
                    ))
                }
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto mt-6 text-center">
        <button
          onClick={generatePDF}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Download CV
        </button>
      </div>
    </div>
  );
};

export default ReverseLayoutResume;