import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const MinimalResume = ({ userData }) => {
  const { t } = useTranslation('resume-generator');
  const resumeRef = useRef(null);

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
        className="w-full max-w-[1200px] mx-auto mt-12 shadow-lg overflow-hidden min-h-[1000px] p-10 bg-white" 
        id="cv"
      >
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-extrabold text-gray-900">
            {userData.fullName}
          </h1>
          <p className="text-xl text-gray-600 uppercase font-semibold mt-4">
            {userData.designation}
          </p>
          <hr className="my-6 border-gray-300" />
        </div>

        {/* Photo & Contact */}
        <div className="flex flex-col items-center">
          <img 
            src={userData.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_960_720.png"} 
            alt="" 
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-300 shadow-md"
          />

          <div className="mt-6 text-center text-gray-700">
            <p><strong>{t("labels.phone")}:</strong> {userData.phone}</p>
            <p><strong>{t("labels.email")}:</strong> {userData.email}</p>
            <p><strong>{t("labels.address")}:</strong> {userData.address}</p>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">About</h2>
          <p className="mt-3 text-gray-700 leading-relaxed text-sm">
            {userData.summary}
          </p>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">{t("sections.skills")}</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-1 text-sm">
            {userData.skills.map((skill, index) => (
              <li key={`skill-${index}`}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* Achievements */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">Achievements</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-1 text-sm">
            {userData.achievements.map((achievement, index) => (
              <li key={`achievement-${index}`}>{achievement}</li>
            ))}
          </ul>
        </div>

        {/* Education */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">{t("sections.education")}</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-3">
            {userData.education.map((edu, index) => (
              <li key={`edu-${index}`} className="text-sm">
                <strong>{edu.degree}</strong> from {edu.institution}
                <div className="text-gray-600">{edu.period}</div>
                <p>{edu.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">{t("sections.experience")}</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-3">
            {userData.experience.map((exp, index) => (
              <li key={`exp-${index}`} className="text-sm">
                <strong>{exp.title}</strong> at {exp.company}
                <div className="text-gray-600">{exp.period}</div>
                <p>{exp.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Projects */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">Projects</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-3">
            {userData.projects.map((project, index) => (
              <li key={`project-${index}`} className="text-sm">
                <strong>{project.name}</strong>
                <div className="text-gray-600">{project.technologies}</div>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto mt-6 text-center">
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

export default MinimalResume;