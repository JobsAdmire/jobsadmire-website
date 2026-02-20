import React, { use, useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { Edit, Phone, Mail, MapPin } from "lucide-react";
import html2canvas from "html2canvas";
import { showInfo } from "@/lib/utils/toast";

const ModernResume = ({ userData }) => {
  const { t } = useTranslation(["common", "resume-generator"]);
  var personal_data = userData["personal_data"];
  var experience_data = userData["experience_data"];
  var education_data = userData["education_data"];
  var skill_data = userData["skill_data"];
  var achievements_data = userData["achievements_data"];

  const resumeRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleEdit = () => {
    // In a real app, this would navigate to an update form or open a modal
    showInfo("This would navigate to the resume update page");
  };

  useEffect(() => {
    console.log(userData);
  }, []);
  const generatePDF = () => {
    setIsGenerating(true);

    // Simulate PDF generation
    setTimeout(() => {
      showInfo(
        "PDF generation functionality would go here in a real implementation"
      );
      setIsGenerating(false);
    }, 1000);

    // Note: For actual PDF generation, you would need to install:
    // npm install jspdf html2canvas
    // And then implement the PDF generation code
  };

  const extractInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="p-6 font-sans bg-gray-100">
      {/* Edit Button (Fixed Position) */}
      <button
        onClick={handleEdit}
        className="fixed z-50 p-3 text-white transition-colors bg-black rounded-full shadow-lg hide-for-pdf bottom-12 right-6 hover:bg-gray-800"
        title={t("labels.general.updateResume")}
      >
        <Edit size={24} />
      </button>

      {/* Resume Content */}
      <div
        ref={resumeRef}
        className="max-w-5xl mx-auto overflow-hidden bg-white shadow-md"
        style={{ minHeight: "297mm" }}
      >
        {/* Top Bar with Name */}
        <div className="relative py-4 text-white bg-gray-800">
          <div className="text-2xl font-bold tracking-wider text-center uppercase">
            {userData.username}
          </div>
        </div>

        {/* Main Content - Sidebar and Main Area */}
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full p-6 bg-gray-100 md:w-1/3">
            {/* Profile Image / Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-32 h-32 overflow-hidden text-white bg-gray-800 rounded-full">
                {userData.profileImage ? (
                  <img
                    src={personal_data?.profileImage}
                    alt={personal_data.firstName}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-4xl uppercase">
                    {/* {extractInitials(userData.username)} */}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mb-6">
              <p className="flex items-center gap-2 mb-2">
                <Phone size={16} className="text-gray-600" />
                <span className="font-semibold">{t("labels.phone", { ns: "resume-generator" }).toUpperCase()}:</span>
                <a
                  href={`tel:+${personal_data?.phone}`}
                  className="text-gray-700"
                >
                  {personal_data?.phone ?? "-"}
                </a>
              </p>
              <p className="flex items-center gap-2 mb-2">
                <Mail size={16} className="text-gray-600" />
                <span className="font-semibold">{t("labels.email", { ns: "resume-generator" }).toUpperCase()}:</span>
                <a
                  href={`mailto:${personal_data?.email}`}
                  className="text-gray-700"
                >
                  {personal_data?.email ?? "-"}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-600" />
                <span className="font-semibold">{t("labels.address", { ns: "resume-generator" }).toUpperCase()}:</span>
                <span className="text-gray-700">
                  {personal_data?.address ?? "-"}
                </span>
              </p>
            </div>

            {/* Expertise */}
            <div className="mb-6">
              <h3 className="pb-1 mb-3 font-bold uppercase border-b border-gray-300">
                Expertise
              </h3>
              <p className="text-gray-700">{userData.skill}</p>
            </div>

            {/* Education - Short version */}
            <div className="mb-6">
              <h3 className="pb-1 mb-3 font-bold uppercase border-b border-gray-300">
                {t("resume-generator:sections.education")}
              </h3>
              <p className="text-gray-700">
                {userData.school} - <span>{userData.graduationYear}</span>
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full p-6 md:w-2/3">
            {/* Job Title */}
            <h2 className="mb-3 text-xl font-bold tracking-wider uppercase">
              {userData.position}
            </h2>
            <div className="w-20 h-1 mb-6 bg-gray-800"></div>

            {/* Profile Section */}
            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-gray-500 uppercase">
                {t("sections.profile", { ns: "resume-generator" })}
              </h3>
              <p className="mb-6 text-gray-700">{userData.about}</p>
            </div>

            {/* Experience Section */}
            <div className="mb-6">
              <h3 className="mb-3 font-semibold text-gray-500 uppercase">
                {t("resume-generator:sections.experience")}
              </h3>

              <h4 className="mb-2 text-lg font-semibold">
                {t("sections.previousEmployment", { ns: "resume-generator" })}
              </h4>
              <p className="mb-2 font-light">
                {userData.company}
                <span className="block text-gray-600">
                  {userData.startDate} - {userData.endDate}
                  <br />
                  <span>{userData.jobTitle}</span>
                </span>
              </p>
              <p className="mb-6 text-gray-700">{userData.jobDescription}</p>

              {/* Professional Skills */}
              <h4 className="mb-2 text-lg font-semibold">
                {t("resume-generator:sections.professionalSkills")}
              </h4>
              <p className="mb-2 font-light">{userData.company}</p>
              <ul className="pl-5 mb-6 list-disc">
                <li>
                  {userData.skill} - {userData.skillLevel}
                </li>
              </ul>

              {/* Software */}
              <h4 className="mb-2 text-lg font-semibold">{t("sections.software", { ns: "resume-generator" })}</h4>
              <ul className="pl-5 mb-6 list-disc">
                <li>
                  {userData.software} - {userData.softwareLevel}
                </li>
              </ul>

              {/* Education - Detailed */}
              <h4 className="mb-2 text-lg font-semibold">{t("resume-generator:sections.education")}</h4>
              <p className="mb-2 font-light">
                {userData.school}
                <span className="block text-gray-600">
                  {userData.graduationYear}
                  <br />
                  <span>{userData.schoolLocation}</span>
                </span>
              </p>
              <p className="mb-6 text-gray-700">{userData.studyDescription}</p>

              {/* Languages */}
              <h4 className="mb-2 text-lg font-semibold">{t("sections.languages", { ns: "resume-generator" })}</h4>
              <p className="mb-6 font-light">
                {userData.language1} - {userData.language1Level}
                <br />
                <span>
                  {userData.language2} - {userData.language2Level}
                </span>
              </p>

              {/* Reference */}
              <h4 className="mb-2 text-lg font-semibold">{t("sections.reference", { ns: "resume-generator" })}</h4>
              <p className="mb-2 font-light">
                {userData.reference} from {userData.referenceDetails}
                <span className="block">
                  {userData.referenceStart} - {userData.referenceEnd}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Generation Button */}
      <div className="flex justify-center max-w-5xl mx-auto mt-6 md:justify-end">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hide-for-pdf hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isGenerating ? t("actions.generatingPdf", { ns: "resume-generator" }) : t("actions.generatePdf", { ns: "resume-generator" })}
        </button>
      </div>
    </div>
  );
};

// Sample data for preview
const sampleUserData = {
  username: "John Doe",
  profileImage: null,
  phone: "1234567890",
  email: "john.doe@example.com",
  address: "123 Main Street, City, Country",
  position: "Senior Frontend Developer",
  about:
    "Experienced frontend developer with a passion for creating responsive and user-friendly web applications. Strong knowledge of React, JavaScript, HTML, and CSS.",
  skill: "Web Development, UI/UX Design, React.js",
  skillLevel: "Expert",
  software: "Visual Studio Code, Adobe XD, Figma",
  softwareLevel: "Advanced",
  school: "University of Technology",
  graduationYear: "2018",
  schoolLocation: "Tech City, State",
  studyDescription:
    "Bachelor of Science in Computer Science with focus on web technologies and software development.",
  company: "Tech Solutions Inc.",
  startDate: "Jan 2019",
  endDate: "Present",
  jobTitle: "Senior Frontend Developer",
  jobDescription:
    "Responsible for developing and maintaining client-facing web applications. Lead a team of 3 junior developers and implemented best practices for code quality and performance.",
  language1: "English",
  language1Level: "Native",
  language2: "Spanish",
  language2Level: "Intermediate",
  reference: "Jane Smith",
  referenceDetails: "Tech Solutions Inc.",
  referenceStart: "2019",
  referenceEnd: "Present",
};

export default ModernResume;
