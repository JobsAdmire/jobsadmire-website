import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const TealResume = ({ userData }) => {
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
        className="max-w-5xl w-full bg-white flex flex-col md:flex-row mx-auto mt-12 shadow-lg overflow-hidden min-h-[1000px]"
        id="cv"
      >
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-teal-700 text-white p-6">
          <div className="text-center">
            <img 
              src={personal_data?.image || personal_data?.profileImage || "/api/placeholder/200/200"} 
              alt={t('alts.profileAlt')} 
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white"
            />
            <h2 className="text-2xl font-bold mt-4">
              {personal_data?.firstName ?? ""} {personal_data?.middleName ?? ""} {personal_data?.lastName ?? ""} 
              {personal_data?.fullName ?? "-"}
            </h2>
            <p className="">{personal_data?.designation ?? "-"}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold">{t("sections.contact")}</h3>
            <p className="mt-2 text-[15px]">📞 {personal_data?.phone ?? "-"}</p>
            <p className="text-[15px]">✉️ {personal_data?.email ?? "-"}</p>
            <p className="text-[15px]">📍 {personal_data?.address ?? "-"}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold">{t("sections.aboutMe")}</h3>
            <p className="mt-2 text-[13px]">{personal_data?.summary ?? ""}</p>
          </div>
          
          {/* Skills - Enhanced with safe data access */}
          {(skill_data && Object.keys(skill_data).length > 0) && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">{t("sections.skills")}</h3>
              <ul className="mt-2 text-[13px]">
                {Array.isArray(skill_data) 
                  ? skill_data.map((skill, index) => (
                      <li key={`skill-${index}`} className="flex items-start mb-1">
                        <span className="mr-2">✔️</span> {skill?.name ?? skill ?? "-"}
                      </li>
                    ))
                  : Object.values(skill_data).map((skill, index) => (
                      <li key={`skill-${index}`} className="flex items-start mb-1">
                        <span className="mr-2">✔️</span> {skill?.name ?? skill ?? "-"}
                      </li>
                    ))
                }
              </ul>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3 bg-white p-6 md:p-10 rounded-r-2xl text-gray-900">
          {/* Achievements - Enhanced with safe data access */}
          {(achievement_data && Object.keys(achievement_data).length > 0) && (
            <div className="mt-4 md:mt-8">
              <h2 className="text-2xl font-bold border-b-2 border-teal-700 pb-2">Achievements</h2>
              <ul className="mt-3 list-disc pl-6 space-y-1">
                {Array.isArray(achievement_data) 
                  ? achievement_data.map((achievement, index) => (
                      <li key={`achievement-${index}`} className="text-[13px]">
                        {achievement?.title ?? achievement ?? "-"}
                      </li>
                    ))
                  : Object.values(achievement_data).map((achievement, index) => (
                      <li key={`achievement-${index}`} className="text-[13px]">
                        {achievement?.title ?? achievement?.name ?? achievement ?? "-"}
                      </li>
                    ))
                }
              </ul>
            </div>
          )}
          
          {/* Experience - Enhanced with safe data access */}
          {(experience_data && Object.keys(experience_data).length > 0) && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold border-b-2 border-teal-700 pb-2">{t("sections.experience")}</h2>
              <ul className="mt-3 list-disc pl-6 space-y-3">
                {Object.values(experience_data).map((exp, index) => (
                  <li key={`exp-${index}`} className="text-[13px]">
                    <div className="font-semibold">{exp?.title ?? "-"}</div>
                    <div className="text-teal-700">{exp?.company ?? "-"}</div>
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
            <div className="mt-8">
              <h2 className="text-2xl font-bold border-b-2 border-teal-700 pb-2">{t("sections.education")}</h2>
              <ul className="mt-3 list-disc pl-6 space-y-3">
                {Object.values(education_data).map((edu, index) => (
                  <li key={`edu-${index}`} className="text-[13px]">
                    <div className="font-semibold">{edu?.degree ?? "-"}</div>
                    <div className="text-teal-700">{edu?.school ?? edu?.institution ?? "-"}</div>
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
            <div className="mt-8">
              <h2 className="text-2xl font-bold border-b-2 border-teal-700 pb-2">Projects</h2>
              <ul className="mt-3 list-disc pl-6 space-y-3">
                {Object.values(project_data).map((project, index) => (
                  <li key={`project-${index}`} className="text-[13px]">
                    <div className="font-semibold">{project?.name ?? project?.title ?? "-"}</div>
                    <div className="text-teal-700">{project?.technologies ?? project?.tech ?? "-"}</div>
                    <p className="mt-1">{project?.description ?? "-"}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* References Section - Same as NurseResumeTemplate */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold border-b-2 border-teal-700 pb-2">{t("sections.references")}</h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <h3 className="text-base font-bold">Harumi Kobayashi</h3>
                <p className="text-sm text-gray-600">Wardiere Inc. / CEO</p>
                <p className="mt-2 text-sm">
                  <span className="font-medium">Phone:</span> 123-456-7890
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{" "}
                  hello@reallygreatsite.com
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold">Bailey Dupont</h3>
                <p className="text-sm text-gray-600">Wardiere Inc. / CEO</p>
                <p className="mt-2 text-sm">
                  <span className="font-medium">Phone:</span> 123-456-7890
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{" "}
                  hello@reallygreatsite.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6 text-center">
        <button
          onClick={generatePDF}
          className="px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition-colors"
        >
          Download CV
        </button>
      </div>
    </div>
  );
};

export default TealResume;