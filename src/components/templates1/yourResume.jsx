import React, { useRef } from "react";
import { useTranslation } from "next-i18next";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Edit } from "lucide-react";
import { showInfo } from "@/lib/utils/toast";

const TraditionalResume = ({ userData }) => {
  const { t } = useTranslation(["common", "resume-generator"]);
  const resumeRef = useRef(null);

  const handleEdit = () => {
    // In a real app, this would navigate to an update form or open a modal
    showInfo("This would navigate to the resume update page");
  };

  const generatePDF = () => {
    // Hide the button
    const button = document.querySelector(".myBtn");
    if (button) button.style.display = "none";

    const opt = {
      margin: 1,
      unit: "px",
      filename: "Resume.pdf",
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 3,
      },
      jsPDF: {
        unit: "px",
        format: "a4",
        orientation: "portrait",
      },
    };

    // Get the content element
    const contentElement = resumeRef.current;
    const originalHeight = contentElement.style.height;
    contentElement.style.height = "auto";

    // Wait for a short duration to let the content adjust
    setTimeout(() => {
      html2canvas(contentElement, opt.html2canvas).then((canvas) => {
        // Reset the height of the content
        contentElement.style.height = originalHeight;

        const pdf = new jsPDF(
          opt.jsPDF.orientation,
          opt.jsPDF.unit,
          opt.jsPDF.format
        );
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
        pdf.save(opt.filename);

        // Show the button again
        if (button) button.style.display = "block";
      });
    }, 500);
  };

  return (
    <div className="font-ubuntu p-6">
      {/* Edit Button (Fixed Position) */}
      <button
        onClick={handleEdit}
        className="fixed bottom-12 right-2.5 bg-black text-white p-3 rounded-full shadow-lg z-50 hover:bg-gray-800 transition-colors"
        title={t("labels.general.updateResume")}
        id="edit"
      >
        <Edit size={24} />
      </button>

      {/* Resume Content */}
      <div
        ref={resumeRef}
        className="w-[210mm] min-h-[297mm] p-[20mm] mx-auto bg-white overflow-hidden"
        id="myContent"
      >
        {/* Sidebar */}
        <div className="w-[30%] float-left p-5 bg-[rgb(27,20,119)] border-r border-ddd text-center text-white">
          <div className="sidebar_top">
            <h1 className="text-center text-lg font-bold">
              {userData.fullName}
            </h1>
            <img
              className="w-full max-w-[150px] h-auto block mx-auto my-2.5"
              src={userData.image || "https://via.placeholder.com/150"}
              alt={userData.fullName}
            />
          </div>

          <div className="details">
            <h3 className="text-base font-bold mt-4 uppercase">{t("labels.phone", { ns: "resume-generator" }).toUpperCase()}</h3>
            <p>
              <i className="fas fa-phone pr-2"></i>
              <a href={`tel:${userData.phone}`} className="text-white">
                {userData.phone}
              </a>
            </p>

            <h3 className="text-base font-bold mt-4 uppercase">{t("labels.email", { ns: "resume-generator" }).toUpperCase()}</h3>
            <p>
              <i className="fas fa-envelope pr-1"></i>
              <a href={`mailto:${userData.email}`} className="text-white">
                {userData.email}
              </a>
            </p>

            <h3 className="text-base font-bold mt-4 uppercase">{t("labels.address", { ns: "resume-generator" }).toUpperCase()}</h3>
            <p>
              <i className="fas fa-map-marker-alt pr-1"></i> {userData.address}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-[68%] p-5 inline-block align-top">
          <div className="content w-full">
            {/* Profile Section */}
            <div className="company mb-6">
              <h3 className="text-lg font-bold mb-2.5 text-gray-800">
                {t("sections.profile", { ns: "resume-generator" })}
              </h3>
              <div className="company_details">
                <p>{userData.summary}</p>
              </div>
            </div>

            {/* Previous Employment Section */}
            <div className="company mb-6">
              <h3 className="text-lg font-bold mb-2.5 text-gray-800">
                {t("sections.previousEmployment", { ns: "resume-generator" })}
              </h3>
              {userData.experience.map((exp, index) => (
                <div key={`exp-${index}`} className="company_details mb-2.5">
                  <h4 className="font-semibold">
                    {exp.company} <span>{exp.period}</span>
                  </h4>
                  <h6 className="text-sm">{exp.title}</h6>
                  <p>{exp.description}</p>
                </div>
              ))}
            </div>

            {/* Professional Skills Section */}
            <div className="skills mb-6">
              <h3 className="text-lg font-bold mb-2.5 text-gray-800">
                {t("resume-generator:sections.professionalSkills")}
              </h3>
              <div className="skill_list">
                <div className="skill1">
                  <h4 className="font-semibold">{t("sections.software", { ns: "resume-generator" })}</h4>
                  <ul className="pl-4 list-disc">
                    {userData.software && (
                      <li>
                        {userData.software} - {userData.softwareLevel}
                      </li>
                    )}
                  </ul>
                </div>
                <div className="skill2">
                  <h4 className="font-semibold">{t("sections.languages", { ns: "resume-generator" })}</h4>
                  <ul className="pl-4 list-disc">
                    {userData.skills.map((skill, index) => (
                      <li key={`skill-${index}`}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>

            {/* Education Section */}
            <div className="education mb-6">
              <h3 className="text-lg font-bold mb-2.5 text-gray-800">
                {t("resume-generator:sections.education")}
              </h3>
              {userData.education.map((edu, index) => (
                <div key={`edu-${index}`} className="education_details mb-2.5">
                  <h4 className="font-semibold">
                    {edu.institution} <span>{edu.period}</span>
                  </h4>
                  <h6 className="text-sm">{edu.degree}</h6>
                  <p>{edu.description}</p>
                </div>
              ))}
            </div>

            {/* Languages Section */}
            <div className="company mb-6">
              <h3 className="text-lg font-bold mb-2.5 text-gray-800">
                {t("sections.languages", { ns: "resume-generator" })}
              </h3>
              <div className="company_details">
                {userData.languages?.map((lang, index) => (
                  <p
                    key={`lang-${index}`}
                    className={index === 0 ? "pb-5" : ""}
                  >
                    {lang.name} - {lang.level}
                  </p>
                ))}
              </div>
            </div>

            {/* Reference Section */}
            <div className="company mb-6">
              <h3 className="text-lg font-bold mb-2.5 text-gray-800">
                {t("sections.reference", { ns: "resume-generator" })}
              </h3>
              {userData.references.map((ref, index) => (
                <div key={`ref-${index}`} className="company_details">
                  <h4 className="font-semibold">
                    {ref.name} from {ref.title}
                    <span>{ref.period}</span>
                  </h4>
                  <p>
                    {ref.phone} - {ref.email}
                  </p>
                  <p>{ref.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generate PDF Button */}
      <div className="text-center mt-4">
        <button
          onClick={generatePDF}
          className="btn btn-info myBtn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          title={t("labels.general.generatePdf")}
        >
          {t("labels.general.generatePdf")}
        </button>
      </div>
    </div>
  );
};

export default TraditionalResume;
