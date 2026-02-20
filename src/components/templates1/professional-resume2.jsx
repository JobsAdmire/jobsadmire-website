import React, { useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { showInfo } from "@/lib/utils/toast";

const TailwindResume = ({ userData }) => {
  const { t } = useTranslation("resume-generator");
  var personal_data = userData["personal_data"];
  var experience_data = userData["experience_data"];
  var education_data = userData["education_data"];
  var skill_data = userData["skill_data"];
  var achievements_data = userData["achievements_data"];
  var project_data = userData["project_data"];

  const resumeRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
    // And then implement the full PDF generation code
  };

  return (
    <div className="p-6">
      <div
        ref={resumeRef}
        className="w-full max-w-5xl mx-auto mt-12 shadow-lg overflow-hidden min-h-[1000px]"
        id="cv"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left Section */}
          <div className="flex flex-col w-full p-8 text-white bg-blue-900 md:w-1/3">
            <div className="flex justify-center">
              <img
                src={personal_data?.image}
                alt={personal_data?.fullName}
                className="object-cover w-40 h-40 border-4 border-white rounded-full shadow-md"
              />
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-center">
              {personal_data?.firstName}
            </h1>

            <p className="mt-2 text-lg font-semibold text-center uppercase">
              {personal_data?.designation ?? "-"}
            </p>

            <div className="mt-6 text-center">
              <p>
                <strong>{t("labels.phone")}:</strong>{" "}
                <span className="text-[15px]">{userData.phone}</span>
              </p>
              <p>
                <strong>{t("labels.email")}:</strong>{" "}
                <span className="text-[15px]">{userData.email}</span>
              </p>
              <p>
                <strong>{t("labels.address")}:</strong>{" "}
                <span className="text-[15px]">{userData.address}</span>
              </p>
            </div>

            <div className="mt-8">
              <h2 className="pb-2 text-2xl font-bold border-b-2 border-gray-300">
                About
              </h2>
              <ul className="mt-3 list-disc pl-6 space-y-1 text-[14px]">
                {personal_data?.summary ?? ""}
              </ul>
            </div>

            {skill_data && (
              <div className="mt-8">
                <h2 className="pb-2 text-2xl font-bold border-b-2 border-gray-300">
                  {t("sections.skills")}
                </h2>
                <ul className="mt-3 list-disc pl-6 space-y-1 text-[14px]">
                  {Object.values(skill_data).map((skill, index) => (
                    <li key={`skill-${index}`}>{skill["name"]}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="w-full p-10 text-gray-900 bg-white md:w-2/3 rounded-r-2xl">
            {achievements_data && (
              <div className="mt-8">
<h2 className="pb-2 text-2xl font-bold border-b-2 border-gray-300">
                {t("sections.achievements")}
                </h2>
                <ul className="pl-6 mt-3 space-y-1 list-disc">
                  {Object.values(achievements_data).map(
                    (achievement, index) => (
                      <li key={`achievement-${index}`}>
                        <strong>{achievement.title}</strong>
                        <div className="text-sm text-gray-600">
                          {achievement.date}
                        </div>
                        <p>{achievement.description}</p>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {experience_data && (
              <div className="mt-8">
                <h2 className="pb-2 text-2xl font-bold border-b-2 border-gray-300">
                  {t("sections.experience")}
                </h2>
                <ul className="pl-6 mt-3 space-y-3 list-disc">
                  {Object.values(experience_data).map((exp, index) => (
                    <li key={`exp-${index}`}>
                      <strong>{exp.title}</strong> at {exp.company}
                      <div className="text-sm text-gray-600">{exp.period}</div>
                      <p>{exp.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {education_data && (
              <div className="mt-8">
                <h2 className="pb-2 text-2xl font-bold border-b-2 border-gray-300">
                  {t("sections.education")}
                </h2>
                <ul className="pl-6 mt-3 space-y-3 list-disc">
                  {Object.values(education_data).map((edu, index) => (
                    <li key={`edu-${index}`}>
                      <strong>{edu.degree}</strong> from {edu.school}
                      <div className="text-sm text-gray-600">{edu.period}</div>
                      <p>{edu.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project_data && (
              <div className="mt-8">
                <h2 className="pb-2 text-2xl font-bold border-b-2 border-gray-300">
                  Projects
                </h2>
                <ul className="pl-6 mt-3 space-y-3 list-disc">
                  {Object.values(project_data).map((project, index) => (
                    <li key={`project-${index}`}>
                      <strong>{project.name}</strong>
                      <div className="text-sm text-gray-600">
                        {project.technologies}
                      </div>
                      <p>{project.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6 text-center">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="px-6 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isGenerating ? t("actions.generatingPdf") : "Download CV"}
        </button>
      </div>
    </div>
  );
};

// Sample data for preview
const sampleUserData = {
  fullName: "Alex Johnson",
  designation: "Full Stack Developer",
  image: "/api/placeholder/150/150",
  phone: "+1 (555) 123-4567",
  email: "alex.johnson@example.com",
  address: "123 Tech Street, San Francisco, CA 94107",
  summary: [
    "7+ years of experience in web development",
    "Specialized in React, Node.js, and cloud infrastructure",
    "Passionate about creating scalable and user-friendly applications",
    "Strong problem-solving skills and attention to detail",
  ],
  skills: [
    "JavaScript/TypeScript",
    "React.js & Redux",
    "Node.js & Express",
    "MongoDB & SQL",
    "AWS & Azure",
    "Docker & Kubernetes",
    "CI/CD Pipelines",
    "RESTful & GraphQL APIs",
  ],
  achievements: [
    "Led the development of a SaaS platform that increased company revenue by 35%",
    "Reduced application load time by 60% through performance optimization",
    "Speaker at React Conference 2023",
    "Published 5 technical articles on Medium with over 10,000 views",
  ],
  experiences: [
    {
      title: "Senior Full Stack Developer",
      company: "TechFusion Inc.",
      period: "Jan 2021 - Present",
      description:
        "Leading a team of 5 developers in building and maintaining enterprise-level web applications. Implementing microservices architecture and CI/CD pipelines.",
    },
    {
      title: "Frontend Developer",
      company: "WebSolutions LLC",
      period: "Mar 2018 - Dec 2020",
      description:
        "Developed responsive and accessible user interfaces using React. Collaborated with UX designers to implement pixel-perfect designs.",
    },
    {
      title: "Junior Web Developer",
      company: "Startup Hub",
      period: "Jul 2016 - Feb 2018",
      description:
        "Built and maintained various client websites. Gained experience in HTML, CSS, JavaScript, and PHP.",
    },
  ],
  education: [
    {
      degree: "Master's in Computer Science",
      institution: "Stanford University",
      period: "2014 - 2016",
      description:
        "Specialized in Software Engineering with focus on web technologies and distributed systems.",
    },
    {
      degree: "Bachelor's in Information Technology",
      institution: "University of California",
      period: "2010 - 2014",
      description:
        "Graduated with honors. Active member of the Coding Club and participated in several hackathons.",
    },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      technologies: "React, Node.js, MongoDB, Stripe API",
      description:
        "Developed a full-featured e-commerce platform with user authentication, product management, cart functionality, and payment processing.",
    },
    {
      name: "Task Management App",
      technologies: "React Native, Firebase, Redux",
      description:
        "Created a cross-platform mobile application for task management with real-time updates and offline functionality.",
    },
    {
      name: "Analytics Dashboard",
      technologies: "React, D3.js, Express, PostgreSQL",
      description:
        "Built an interactive dashboard for visualizing business metrics with customizable charts and reports.",
    },
  ],
};

export default TailwindResume;
