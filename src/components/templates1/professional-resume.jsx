import React, { useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Phone, Mail, Globe, Facebook, Instagram, MapPin } from "lucide-react";

const SkillBasedResume = ({ userData }) => {
  const { t } = useTranslation("resume-generator");
  const resumeRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = () => {
    setIsGenerating(true);

    const content = resumeRef.current;
    const buttons = document.querySelectorAll(".hide-for-pdf");

    // Hide buttons temporarily
    buttons.forEach((button) => (button.style.display = "none"));

    html2canvas(content, {
      scale: 2,
      useCORS: true,
      logging: false,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > 297) {
        // If content exceeds one page, split into multiple pages
        const totalPages = Math.ceil(imgHeight / 297);
        for (let i = 0; i < totalPages; i++) {
          pdf.addImage(imgData, "JPEG", 0, -i * 297, imgWidth, imgHeight);
          if (i < totalPages - 1) pdf.addPage();
        }
      } else {
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      }

      pdf.save("Resume.pdf");

      // Show buttons again
      buttons.forEach((button) => (button.style.display = "block"));
      setIsGenerating(false);
    });
  };

  const SkillBar = ({ title, percentage }) => {
    return (
      <li className="mb-3">
        <p className="mb-1 text-sm text-white uppercase">{title}</p>
        <div className="w-full h-1.5 bg-blue-200 bg-opacity-40 rounded-full">
          <div
            className="h-full bg-blue-400 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </li>
    );
  };

  const ReferenceItem = ({ name, title, phone, email }) => {
    return (
      <div className="mb-4">
        <h6 className="text-lg font-medium text-white">{name}</h6>
        <p className="mb-2 text-sm text-gray-300">{title}</p>
        <ul>
          <li className="flex items-center mb-1 text-gray-400">
            <Phone size={16} className="mr-2 text-blue-400" />
            {phone}
          </li>
          <li className="flex items-center text-gray-400">
            <Mail size={16} className="mr-2 text-blue-400" />
            {email}
          </li>
        </ul>
      </div>
    );
  };

  const TimelineItem = ({ company, period, position, description }) => {
    return (
      <div className="grid grid-cols-1 mb-6 md:grid-cols-2">
        <div>
          <h5 className="text-xl font-semibold text-gray-800">{company}</h5>
          <p className="text-gray-600">{period}</p>
        </div>
        <div className="relative pl-6 border-l border-gray-300">
          <div className="absolute w-3 h-3 bg-blue-400 rounded-full -left-1.5 top-2"></div>
          <h5 className="text-xl font-semibold text-blue-400">{position}</h5>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-blue-200 font-poppins md:p-8">
      <button
        onClick={generatePDF}
        disabled={isGenerating}
        className="px-4 py-2 mb-4 text-white transition-colors bg-blue-500 rounded-md hide-for-pdf hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isGenerating ? t("actions.generatingPdf") : t("actions.generatePdf")}
      </button>

      <main
        ref={resumeRef}
        className="grid w-full max-w-7xl grid-cols-1 mx-auto shadow-lg md:grid-cols-7"
      >
        {/* Left Section */}
        <section className="col-span-1 bg-slate-800 md:col-span-2">
          <div className="p-6 md:p-8">
            {/* Profile */}
            <div className="pb-6 mb-6 border-b border-slate-700">
              <div className="flex justify-center">
                {userData.profileImage ? (
                  <div className="w-40 h-40 overflow-hidden border-8 rounded-full border-slate-700">
                    <img
                      src={userData.profileImage}
                      alt={userData.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-40 h-40 border-8 rounded-full border-slate-700 bg-slate-600">
                    <span className="text-4xl text-white">
                      {userData.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <h2 className="mt-5 text-2xl tracking-wide text-center text-white uppercase">
                {userData.name}
              </h2>
              <p className="mt-2 text-lg tracking-wide text-center text-blue-300 uppercase">
                {userData.position}
              </p>
            </div>

            {/* Contact Info */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl tracking-wide text-white uppercase">
                {t("sections.contact")}
              </h3>
              <ul>
                <li className="flex items-center mb-3 text-gray-400">
                  <Phone size={16} className="mr-4 text-blue-400" />
                  {userData.phone}
                </li>
                <li className="flex items-center mb-3 text-gray-400">
                  <Mail size={16} className="mr-4 text-blue-400" />
                  {userData.email}
                </li>
                <li className="flex items-center mb-3 text-gray-400">
                  <Globe size={16} className="mr-4 text-blue-400" />
                  {userData.website}
                </li>
                <li className="flex items-center mb-3 text-gray-400">
                  <Facebook size={16} className="mr-4 text-blue-400" />
                  {userData.facebook}
                </li>
                <li className="flex items-center mb-3 text-gray-400">
                  <Instagram size={16} className="mr-4 text-blue-400" />
                  {userData.instagram}
                </li>
                <li className="flex items-center mb-3 text-gray-400">
                  <MapPin size={16} className="mr-4 text-blue-400" />
                  {userData.address}
                </li>
              </ul>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl tracking-wide text-white uppercase">
                {t("sections.skills")}
              </h3>
              <ul>
                {userData.skills.map((skill, index) => (
                  <SkillBar
                    key={index}
                    title={skill.name}
                    percentage={skill.level}
                  />
                ))}
              </ul>
            </div>

            {/* References Section */}
            <div>
              <h3 className="mb-4 text-xl tracking-wide text-white uppercase">
                {t("sections.references")}
              </h3>
              {userData.references.map((reference, index) => (
                <ReferenceItem
                  key={index}
                  name={reference.name}
                  title={reference.title}
                  phone={reference.phone}
                  email={reference.email}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Right Section */}
        <section className="col-span-1 bg-white md:col-span-5">
          <div className="p-6 md:p-8">
            {/* About Section */}
            <div className="mb-8">
              <h2 className="text-xl text-blue-500 uppercase tracking-wide mb-4 relative after:content-[''] after:absolute after:w-3/5 after:h-0.5 after:bg-gray-300 after:rounded-full after:right-0 after:top-1/2 after:transform after:-translate-y-1/2">
                {t("sections.aboutMe")}
              </h2>
              <p className="leading-relaxed text-gray-600">{userData.about}</p>
            </div>

            {/* Experience Section */}
            <div className="mb-8">
              <h2 className="text-xl text-blue-500 uppercase tracking-wide mb-4 relative after:content-[''] after:absolute after:w-3/5 after:h-0.5 after:bg-gray-300 after:rounded-full after:right-0 after:top-1/2 after:transform after:-translate-y-1/2">
                {t("sections.experience")}
              </h2>
              {userData.experience.map((exp, index) => (
                <TimelineItem
                  key={index}
                  company={exp.company}
                  period={exp.period}
                  position={exp.position}
                  description={exp.description}
                />
              ))}
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <h2 className="text-xl text-blue-500 uppercase tracking-wide mb-4 relative after:content-[''] after:absolute after:w-3/5 after:h-0.5 after:bg-gray-300 after:rounded-full after:right-0 after:top-1/2 after:transform after:-translate-y-1/2">
                {t("sections.education")}
              </h2>
              {userData.education.map((edu, index) => (
                <TimelineItem
                  key={index}
                  company={edu.school}
                  period={edu.period}
                  position={edu.degree}
                  description={edu.description}
                />
              ))}
            </div>

            {/* Awards Section */}
            <div>
              <h2 className="text-xl text-blue-500 uppercase tracking-wide mb-4 relative after:content-[''] after:absolute after:w-3/5 after:h-0.5 after:bg-gray-300 after:rounded-full after:right-0 after:top-1/2 after:transform after:-translate-y-1/2">
                {t("sections.awards")}
              </h2>
              {userData.awards.map((award, index) => (
                <TimelineItem
                  key={index}
                  company={award.issuer}
                  period={award.date}
                  position={award.title}
                  description={award.description}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SkillBasedResume;
