import React, { useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Printer, Edit } from "lucide-react";
import { showInfo } from "@/lib/utils/toast";

const Resume = ({ userData }) => {
  const { t } = useTranslation(["common", "resume-generator"]);
  const resumeRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // This function would handle form submission to update resume
  const handleEdit = () => {
    // In a real app, this would navigate to an update form or open a modal
    showInfo("This would navigate to the resume update page");
  };

  const generatePDF = () => {
    setIsGenerating(true);

    const content = resumeRef.current;
    const buttons = content.querySelectorAll(".hide-for-pdf");

    // Hide buttons temporarily
    buttons.forEach((button) => (button.style.display = "none"));

    const options = {
      scale: 3,
      useCORS: true,
      allowTaint: true,
    };

    html2canvas(content, options).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("portrait", "px", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      pdf.save("Resume.pdf");

      // Show buttons again
      buttons.forEach((button) => (button.style.display = "block"));
      setIsGenerating(false);
    });
  };

  return (
    <div className="font-lato bg-gray-50 p-6">
      {/* Edit Button (Fixed Position) */}
      <button
        onClick={handleEdit}
        className="hide-for-pdf fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg z-50 hover:bg-gray-800 transition-colors"
        title={t("labels.general.updateResume")}
      >
        <Edit size={24} />
      </button>

      {/* Resume Content */}
      <div ref={resumeRef} className="max-w-4xl mx-auto bg-white shadow-md p-8">
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold uppercase">
              {userData.username}
            </h1>
          </div>

          <div className="text-sm mb-4">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <div>
                <span className="font-semibold">{t("labels.email")}: </span>
                <span>{userData.email}</span>
              </div>
              <div>
                <span className="font-semibold">{t("labels.phone")}: </span>
                <span>+{userData.phone}</span>
              </div>
              <div>
                <span className="font-semibold">{t("labels.address")}: </span>
                <span>{userData.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl uppercase font-semibold mb-2">
              {userData.position}
            </h2>
            <p className="text-gray-700">{userData.about}</p>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-3">
            {t("resume-generator:sections.experience")}
          </h3>
          <div className="mb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold">{userData.company}</div>
                <div className="text-gray-600">{userData.companyLocation}</div>
                <div className="text-gray-600 text-sm">
                  {userData.startDate} - {userData.endDate}
                </div>
              </div>
              <div>
                <div className="font-semibold">{userData.jobTitle}</div>
                <div className="text-gray-700">{userData.jobDescription}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-3">
            {t("resume-generator:sections.education")}
          </h3>
          <div className="mb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold">{userData.school}</div>
                <div className="text-gray-600">{userData.schoolLocation}</div>
                <div className="text-gray-600 text-sm">
                  {userData.graduationYear}
                </div>
              </div>
              <div>
                <div className="text-gray-700">{userData.studyDescription}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-3">
            {t("resume-generator:sections.skills")}
          </h3>
          <div className="mb-4">
            <div className="font-medium">
              {userData.skill} - {userData.skillLevel}
            </div>
          </div>
        </div>

        {/* Software Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-3">
            {t("sections.software")}
          </h3>
          <div className="mb-4">
            <div className="font-medium">
              {userData.software} - {userData.softwareLevel}
            </div>
          </div>
        </div>

        {/* Languages Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-3">
            {t("sections.languages")}
          </h3>
          <div className="mb-4">
            <div>
              <div className="font-medium">
                {userData.language1} - {userData.language1Level}
              </div>
              <div className="font-medium">
                {userData.language2} - {userData.language2Level}
              </div>
            </div>
          </div>
        </div>

        {/* Reference Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-3">
            {t("sections.reference")}
          </h3>
          <div className="mb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold">{userData.reference}</div>
                <div className="text-gray-600 text-sm">
                  {userData.referenceStart} - {userData.referenceEnd}
                </div>
              </div>
              <div>
                <div className="text-gray-700">{userData.referenceDetails}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Generation Button */}
      <div className="max-w-4xl mx-auto mt-6 flex justify-end">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="hide-for-pdf bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors disabled:bg-blue-300"
        >
          <Printer size={20} />
          {isGenerating ? t("labels.general.generatingPdf") : t("labels.general.generatePdf")}
        </button>
      </div>
    </div>
  );
};

export default Resume;
