import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const OrangeAccentResume = ({ userData }) => {
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
        className="max-w-5xl w-full bg-white shadow-xl flex flex-col md:flex-row mx-auto mt-12 shadow-lg overflow-hidden min-h-[1000px]"
        id="cv"
      >
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-gray-900 text-white p-6 flex flex-col items-center">
          <img 
            src={personal_data?.image || personal_data?.profileImage || "/api/placeholder/200/200"} 
            className="w-32 h-32 rounded-full border-4 border-orange-500 shadow-md object-cover" 
            alt={t('alts.profileAlt')}
          />
          <h1 className="text-2xl font-bold mt-4 text-orange-500">
            {personal_data?.firstName ?? ""} {personal_data?.middleName ?? ""} {personal_data?.lastName ?? ""} 
            {personal_data?.fullName ?? "-"}
          </h1>
          <p className="text-gray-400">{personal_data?.designation ?? "-"}</p>
          <hr className="my-4 border-gray-700 w-full" />
          <h2 className="text-lg font-semibold mb-2">{t("sections.contactMe")}</h2>
          <p className="">📍 <span className="text-[15px]">{personal_data?.address ?? "-"}</span></p>
          <p className="">📧 <span className="text-[13px]">{personal_data?.email ?? "-"}</span></p>
          <p className="">📞 <span className="text-[15px]">{personal_data?.phone ?? "-"}</span></p>
          <hr className="my-4 border-gray-700 w-full" />
          
          {/* Skills - Enhanced with safe data access */}
          {(skill_data && Object.keys(skill_data).length > 0) && (
            <>
              <h2 className="text-lg font-semibold mb-2">{t("sections.proSkills")}</h2>
              <div className="w-full">
                <ul className="space-y-2">
                  {Array.isArray(skill_data) 
                    ? skill_data.map((skill, index) => (
                        <li key={`skill-${index}`} className="text-[13px]">
                          {skill?.name ?? skill ?? "-"}
                        </li>
                      ))
                    : Object.values(skill_data).map((skill, index) => (
                        <li key={`skill-${index}`} className="text-[13px]">
                          {skill?.name ?? skill ?? "-"}
                        </li>
                      ))
                  }
                </ul>
              </div>
            </>
          )}
        </div>
        
        {/* Main Content */}
        <div className="w-full md:w-2/3 p-8">
          <h2 className="text-2xl font-semibold text-orange-500 border-orange-500 inline-block">
            {t("sections.aboutMe")}
          </h2>
          <p className="text-gray-600 mt-2 text-[13px]">
            {personal_data?.summary ?? ""}
          </p>
          
          {/* Education - Enhanced with safe data access */}
          {(education_data && Object.keys(education_data).length > 0) && (
            <>
              <h2 className="text-2xl font-semibold text-orange-500 border-orange-500 inline-block mt-6">
                {t("sections.education")}
              </h2>
              <div className="mt-4 space-y-3">
                {Object.values(education_data).map((edu, index) => (
                  <div key={`edu-${index}`} className="border-l-2 border-orange-500 pl-4">
                    <div className="font-semibold text-gray-800">{edu?.degree ?? "-"}</div>
                    <div className="text-orange-500">{edu?.school ?? edu?.institution ?? "-"}</div>
                    <div className="text-gray-600 text-sm">
                      {edu?.startDate ?? "-"} - {edu?.endDate ?? "Present"}
                      {edu?.period && ` | ${edu.period}`}
                    </div>
                    <p className="text-gray-600 text-[13px] mt-1">{edu?.description ?? "-"}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Experience - Enhanced with safe data access */}
          {(experience_data && Object.keys(experience_data).length > 0) && (
            <>
              <h2 className="text-2xl font-semibold text-orange-500 border-orange-500 inline-block mt-6">
                {t("sections.experience")}
              </h2>
              <div className="mt-4 space-y-3">
                {Object.values(experience_data).map((exp, index) => (
                  <div key={`exp-${index}`} className="border-l-2 border-orange-500 pl-4">
                    <div className="font-semibold text-gray-800">{exp?.title ?? "-"}</div>
                    <div className="text-orange-500">{exp?.company ?? "-"}</div>
                    <div className="text-gray-600 text-sm">
                      {exp?.startDate ?? "-"} - {exp?.endDate ?? "Present"}
                      {exp?.period && ` | ${exp.period}`}
                    </div>
                    <p className="text-gray-600 text-[13px] mt-1">{exp?.description ?? "-"}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Projects - Enhanced with safe data access */}
          {(project_data && Object.keys(project_data).length > 0) && (
            <>
              <h2 className="text-2xl font-semibold text-orange-500 border-orange-500 inline-block mt-6">
                Projects
              </h2>
              <div className="mt-4 space-y-3">
                {Object.values(project_data).map((project, index) => (
                  <div key={`project-${index}`} className="border-l-2 border-orange-500 pl-4">
                    <div className="font-semibold text-gray-800">{project?.name ?? project?.title ?? "-"}</div>
                    <div className="text-orange-500">{project?.technologies ?? project?.tech ?? "-"}</div>
                    <p className="text-gray-600 text-[13px] mt-1">{project?.description ?? "-"}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Achievements - Enhanced with safe data access */}
          {(achievement_data && Object.keys(achievement_data).length > 0) && (
            <>
              <h2 className="text-2xl font-semibold text-orange-500 border-orange-500 inline-block mt-6">
                Achievements
              </h2>
              <div className="mt-4 space-y-3">
                <ul className="list-disc pl-5">
                  {Array.isArray(achievement_data) 
                    ? achievement_data.map((achievement, index) => (
                        <li key={`achievement-${index}`} className="text-gray-600 text-[13px]">
                          {achievement?.title ?? achievement ?? "-"}
                        </li>
                      ))
                    : Object.values(achievement_data).map((achievement, index) => (
                        <li key={`achievement-${index}`} className="text-gray-600 text-[13px]">
                          {achievement?.title ?? achievement?.name ?? achievement ?? "-"}
                        </li>
                      ))
                  }
                </ul>
              </div>
            </>
          )}

          {/* References Section - Same as NurseResumeTemplate */}
          <h2 className="text-2xl font-semibold text-orange-500 border-orange-500 inline-block mt-6">
            References
          </h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="w-full max-w-5xl mx-auto mt-6 text-center">
        <button
          onClick={generatePDF}
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Download CV
        </button>
      </div>
    </div>
  );
};

export default OrangeAccentResume;