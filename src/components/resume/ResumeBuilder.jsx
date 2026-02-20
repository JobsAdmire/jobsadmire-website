// src/components/resume-generator/ResumeBuilder.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import Step1 from "./stepone";
import Step2 from "./steptwo";
import Step3 from "./stepthree";
import Step4 from "./stepfour";
import Step5 from "./stepfive";
import Step6 from "./stepsix";

const ResumeBuilder = () => {
  const { t } = useTranslation("resume-generator");
  const step2Ref = useRef();
  const step3Ref = useRef();
  const step4Ref = useRef();
  const step5Ref = useRef();
  const step6Ref = useRef();

  const handleExternalSubmit = () => {
    if (step2Ref.current) {
      step2Ref.current.submitForm();
    }
    if (step3Ref.current) {
      step3Ref.current.submitForm();
    }

    if (step4Ref.current) {
      step4Ref.current.submitForm();
    }

    if (step5Ref.current) {
      step5Ref.current.submitForm();
    }

    if (step6Ref.current) {
      step6Ref.current.submitForm();
    }
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [animateTransition, setAnimateTransition] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      firstName: "",
      middleName: "",
      lastName: "",
      image: null,
      designation: "",
      address: "",
      email: "",
      phone: "",
      summary: "",
    },
    achievements: [],
    workExperience: [],
    education: [],
    personalProjects: [],
    personalSkills: [],
  });

  // Handle form data updates
  const updateResumeData = (section, data) => {
    console.log("===================================");
    console.log(section);
    console.log(data);
    setResumeData((prevData) => ({
      ...prevData,
      [section]: data,
    }));

    // Mark step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  // Navigate to next step with animation
  const nextStep = () => {
    handleExternalSubmit();

    if (currentStep < 6) {
      setAnimateTransition(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAnimateTransition(false);
      }, 300);
    }
  };

  // Navigate to next step with animation
  const goToNextStep = () => {
    if (currentStep < 6) {
      setAnimateTransition(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAnimateTransition(false);
      }, 300);
    }
  };
  // Navigate to previous step with animation
  const prevStep = () => {
    if (currentStep > 1) {
      setAnimateTransition(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setAnimateTransition(false);
      }, 300);
    }
  };

  // Go to specific step with animation
  const goToStep = (step) => {
    if (step >= 1 && step <= 6 && step !== currentStep) {
      setAnimateTransition(true);
      setTimeout(() => {
        setCurrentStep(step);
        setAnimateTransition(false);
      }, 300);
    }
  };

  // Render the current step
  const renderStep = () => {
    // updateResumeData('personalInfo', data)
    switch (currentStep) {
      case 1:
        return (
          <Step1
            data={resumeData.personalInfo}
            updateData={(data) => {
              console.log(data);
            }}
            nextStep={() => goToNextStep()}
            currentSteps={stepTitles[currentStep]}
            preSteps={stepTitles[currentStep - 2]}
          />
        );
      case 2:
        return (
          <Step2
            ref={step2Ref}
            data={resumeData.achievements}
            updateData={(data) => updateResumeData("achievements", data)}
            nextStep={() => goToNextStep()}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Step3
            ref={step3Ref}
            data={resumeData.workExperience}
            updateData={(data) => updateResumeData("workExperience", data)}
            nextStep={() => goToNextStep()}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <Step4
            ref={step4Ref}
            data={resumeData.education}
            updateData={(data) => updateResumeData("education", data)}
            nextStep={() => goToNextStep()}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <Step5
            ref={step5Ref}
            data={resumeData.personalProjects}
            updateData={(data) => updateResumeData("personalProjects", data)}
            nextStep={() => goToNextStep()}
            prevStep={prevStep}
          />
        );
      case 6:
        return (
          <Step6
            ref={step6Ref}
            data={resumeData.personalSkills}
            updateData={(data) => updateResumeData("personalSkills", data)}
            nextStep={() => goToNextStep()}
            generateResume={() => generateFinalResume(resumeData)}
          />
        );
      default:
        return (
          <Step1
            data={resumeData.personalInfo}
            updateData={(data) => updateResumeData("personalInfo", data)}
            nextStep={nextStep}
          />
        );
    }
  };

  // Generate the final resume
  const generateFinalResume = (data) => {
    var rData = {};
    const personal_data = localStorage.getItem("personal_information");
    const personal_info = !!personal_data
      ? JSON.parse(personal_data)
      : undefined;

    const experience_data = localStorage.getItem("experience_information");
    const experience_info = !!experience_data
      ? JSON.parse(experience_data)
      : undefined;

    const education_data = localStorage.getItem("education_information");
    const education_info = !!education_data
      ? JSON.parse(education_data)
      : undefined;

    const skill_data = localStorage.getItem("skill_information");
    const skill_info = !!skill_data ? JSON.parse(skill_data) : undefined;

    const achievements_data = localStorage.getItem("achievement_information");
    const achievements_info = !!achievements_data
      ? JSON.parse(achievements_data)
      : undefined;

    const project_data = localStorage.getItem("project_information");
    const project_info = !!project_data ? JSON.parse(project_data) : undefined;

    rData = {
      personal_data: personal_info,
      experience_data: experience_info,
      education_data: education_info,
      skill_data: skill_info,
      achievements_data: achievements_info,
      project_data: project_info,
    };

    // Show confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    // Implement your resume generation logic here
  };

  // Step titles for the progress indicator
  const stepTitles = [
    t("steps.personalInfo"),
    t("steps.achievements"),
    t("steps.workExperience"),
    t("steps.education"),
    t("steps.projects"),
    t("steps.skills"),
  ];

  // Step icons (you can replace these with actual SVG icons or icon components)
  const stepIcons = [
    "👤", // Personal Info
    "🏆", // Achievements
    "💼", // Work Experience
    "🎓", // Education
    "🚀", // Projects
    "⚡", // Skills
  ];

  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / 6) * 100);

  return (
    <div className="pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] px-2 sm:px-4 bg-gradient-to-br from-sky-50 via-white to-sky-100">
      {/* Floating bubbles background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-sky-500 opacity-5"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              animation: "float 15s infinite ease-in-out",
            }}
          />
        ))}
      </div>

      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-500 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 10px rgba(0, 0, 255, 0.5)",
                animation: `confetti ${
                  Math.random() * 2 + 1
                }s forwards cubic-bezier(0, 0.5, 0.5, 1)`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-12 text-center transition-all duration-500 transform hover:scale-105 px-2">
          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text">
            {t("title")}
          </h1>
          <p className="mb-3 sm:mb-4 text-base sm:text-lg md:text-xl text-sky-600 px-2">
            {t("description")}
          </p>
          <div className="w-20 sm:w-24 md:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-sky-400 to-blue-600 mx-auto mt-3 sm:mt-4 rounded-full"></div>
        </div>

        {/* Main Card Container */}
        <div className="overflow-hidden transition-all duration-300 bg-white border shadow-2xl rounded-2xl sm:rounded-3xl border-sky-100 hover:shadow-blue-200/50">
          {/* Glass effect top bar */}
          <div className="h-2 sm:h-3 md:h-4 bg-gradient-to-r from-sky-400 to-blue-600 opacity-80"></div>

          {/* Steps indicator */}
          <div className="relative p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-r from-sky-50 to-blue-50">
            {/* Abstract decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 bg-blue-500 rounded-full filter blur-3xl opacity-5"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 -mb-32 -ml-32 rounded-full bg-sky-400 filter blur-3xl opacity-5"></div>

            <div className="relative z-10 flex justify-between px-1 sm:px-2 md:px-4 lg:px-6">
              {/* Progress line */}
              <div className="absolute h-0.5 sm:h-1 md:h-1.5 bg-sky-200 top-1/2 left-0 right-0 -translate-y-1/2 z-0 rounded-full"></div>
              <div
                className="absolute h-0.5 sm:h-1 md:h-1.5 bg-gradient-to-r from-sky-400 to-blue-600 top-1/2 left-0 -translate-y-1/2 z-1 rounded-full transition-all duration-700 ease-in-out"
                style={{ width: `${(currentStep - 1) * 20}%` }}
              ></div>

              {/* Step circles */}
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div
                  key={step}
                  className="relative z-10 flex flex-col items-center group"
                >
                  <button
                    onClick={() => goToStep(step)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-1 sm:mb-2 md:mb-3 
                      cursor-pointer transition-all duration-500 ease-in-out
                      ${
                        currentStep === step
                          ? "bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg shadow-blue-200 scale-110 border-2 sm:border-3 md:border-4 border-white"
                          : completedSteps.includes(step)
                            ? "bg-gradient-to-br from-sky-400 to-blue-500 text-white border-2 sm:border-3 md:border-4 border-sky-100"
                            : "bg-white text-sky-400 border-2 sm:border-3 md:border-4 border-sky-200 hover:border-sky-300"
                      }`}
                    disabled={
                      !completedSteps.includes(step - 1) &&
                      step !== 1 &&
                      step !== currentStep
                    }
                  >
                    {completedSteps.includes(step) && step !== currentStep ? (
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        ✓
                      </span>
                    ) : (
                      <span className="flex items-center justify-center text-sm sm:text-base md:text-lg lg:text-xl">
                        {stepIcons[step - 1]}
                      </span>
                    )}

                    {/* Pulse animation for current step */}
                    {currentStep === step && (
                      <span className="absolute w-full h-full bg-blue-400 rounded-full animate-ping opacity-20"></span>
                    )}
                  </button>
                  <div
                    className={`hidden sm:block text-xs sm:text-sm font-medium text-center max-w-[60px] sm:max-w-[80px] md:max-w-[100px] lg:max-w-[120px] transition-all duration-300
                      ${
                        currentStep === step
                          ? "text-sky-700 scale-110 font-bold"
                          : completedSteps.includes(step)
                            ? "text-sky-600"
                            : "text-sky-400"
                      }`}
                  >
                    {stepTitles[step - 1]}
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute z-20 px-4 py-2 text-sm text-white transition-opacity duration-300 -translate-x-1/2 shadow-lg opacity-0 pointer-events-none -top-14 left-1/2 bg-sky-800 rounded-xl group-hover:opacity-100 whitespace-nowrap">
                    {completedSteps.includes(step)
                      ? t("tooltip.completed")
                      : ""}
                    {t("tooltip.prefix", {
                      step: step,
                      title: stepTitles[step - 1],
                    })}
                    <span className="absolute bottom-0 w-3 h-3 rotate-45 -translate-x-1/2 translate-y-1/2 left-1/2 bg-sky-800"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current step content */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-white rounded-b-lg">
            {/* Step Header */}
            <div className="flex items-start pb-4 sm:pb-5 md:pb-6 mb-4 sm:mb-6 md:mb-8 border-b border-sky-100">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mr-3 sm:mr-4 md:mr-5 text-base sm:text-lg md:text-xl lg:text-2xl text-white shadow-lg rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-blue-100">
                {stepIcons[currentStep - 1]}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text break-words">
                  {stepTitles[currentStep - 1]}
                </h2>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-sky-600">
                  {currentStep === 1 && t("stepDescriptions.personalInfo")}
                  {currentStep === 2 && t("stepDescriptions.achievements")}
                  {currentStep === 3 && t("stepDescriptions.workExperience")}
                  {currentStep === 4 && t("stepDescriptions.education")}
                  {currentStep === 5 && t("stepDescriptions.projects")}
                  {currentStep === 6 && t("stepDescriptions.skills")}
                </p>
              </div>
            </div>

            {/* Step Content with transition animations */}
            <div
              className={`bg-gradient-to-br from-white to-sky-50 p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-sky-100 shadow-sm
                transition-all duration-300 ease-in-out
                ${
                  animateTransition
                    ? "opacity-0 transform translate-x-10"
                    : "opacity-100 transform translate-x-0"
                }`}
            >
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 md:mt-10">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 transition-all duration-300 bg-white border-2 shadow-sm border-sky-300 text-sky-600 text-sm sm:text-base rounded-xl hover:bg-sky-50 hover:border-sky-400 group w-full sm:w-auto"
                >
                  <span className="ltr:mr-2 rtl:ml-2 transition-transform duration-300 transform ltr:group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
                    <span className="ltr:hidden">&#8594;</span>
                    <span className="rtl:hidden">&#8592;</span>
                  </span>
                  <span className="hidden sm:inline">
                    {t("buttons.back", { step: stepTitles[currentStep - 2] })}
                  </span>
                  <span className="sm:hidden">{t("buttons.back_mobile")}</span>
                </button>
              )}

              {currentStep < 6 ? (
                <button
                  type="submit"
                  onClick={nextStep}
                  className="flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 ml-0 sm:ltr:ml-auto sm:rtl:mr-auto text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-sky-500 to-blue-600 text-sm sm:text-base rounded-xl shadow-blue-200/50 hover:shadow-blue-300/50 hover:from-sky-600 hover:to-blue-700 group w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">
                    {t("buttons.continue", { step: stepTitles[currentStep] })}
                  </span>
                  <span className="sm:hidden">
                    {t("buttons.continue_mobile")}
                  </span>
                  <span className="ltr:ml-2 rtl:mr-2 transition-transform duration-300 transform ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    <span className="ltr:hidden">&#8592;</span>
                    <span className="rtl:hidden">&#8594;</span>
                  </span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 ml-0 sm:ltr:ml-auto sm:rtl:mr-auto w-full sm:w-auto">
                  <button
                    onClick={nextStep}
                    className="relative flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 overflow-hidden font-medium text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-sky-600 to-blue-700 text-sm sm:text-base rounded-xl shadow-blue-200/50 hover:shadow-blue-300/60 group hover:from-sky-700 hover:to-blue-800 w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center">
                      {t("buttons.saveSkill")}
                    </span>
                    <div className="absolute inset-0 transition-opacity duration-300 origin-left transform scale-x-0 opacity-0 bg-gradient-to-r from-sky-400 to-indigo-600 group-hover:opacity-100 group-hover:scale-x-100"></div>
                  </button>
                  <button
                    onClick={() => generateFinalResume(resumeData)}
                    className="relative flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 overflow-hidden font-medium text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-sky-600 to-blue-700 text-sm sm:text-base rounded-xl shadow-blue-200/50 hover:shadow-blue-300/60 group hover:from-sky-700 hover:to-blue-800 w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center">
                      {t("buttons.generateResume")}
                      <span className="ltr:ml-2 rtl:mr-2 sm:ltr:ml-3 sm:rtl:mr-3 text-lg sm:text-xl">
                        ✓
                      </span>
                    </span>
                    <div className="absolute inset-0 transition-opacity duration-300 origin-left transform scale-x-0 opacity-0 bg-gradient-to-r from-sky-400 to-indigo-600 group-hover:opacity-100 group-hover:scale-x-100"></div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-sky-50 to-blue-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="text-xs sm:text-sm font-medium text-sky-700">
                <span className="font-bold text-blue-700">
                  {completedSteps.length}
                </span>{" "}
                {t("progress.stepsCompleted", {
                  count: completedSteps.length,
                }).replace(completedSteps.length, "")}
              </div>
              <div className="text-xs sm:text-sm font-medium text-sky-700">
                <span className="hidden sm:inline">
                  {t("progress.currentStep_mobile").split(":")[0]}:{" "}
                </span>
                <span className="font-bold text-blue-700">
                  {t("progress.currentStep_mobile", { step: currentStep })}
                  <span className="hidden md:inline">
                    {" "}
                    - {stepTitles[currentStep - 1]}
                  </span>
                </span>
              </div>
              <div className="text-xs sm:text-sm font-medium text-sky-700">
                <span className="font-bold text-blue-700">
                  {t("progress.progressPercentage", {
                    percentage: progressPercentage,
                  })}
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 sm:h-2 mt-2 sm:mt-3 overflow-hidden rounded-full bg-sky-200">
              <div
                className="h-full transition-all duration-700 ease-in-out rounded-full bg-gradient-to-r from-sky-400 to-blue-600"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-12 md:mt-16 px-2">
          <div className="p-4 sm:p-5 md:p-6 transition-all duration-300 transform bg-white border shadow-md rounded-xl sm:rounded-2xl border-sky-100 hover:shadow-lg hover:-translate-y-1 group">
            <div className="flex items-center justify-center mb-3 sm:mb-4 text-xl sm:text-2xl transition-all duration-300 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-sky-100 text-sky-600 group-hover:bg-sky-600 group-hover:text-white">
              {t("features.fastEasy.icon")}
            </div>
            <h3 className="mb-2 text-base sm:text-lg font-semibold text-sky-800">
              {t("features.fastEasy.title")}
            </h3>
            <p className="text-sm sm:text-base text-sky-600">
              {t("features.fastEasy.description")}
            </p>
          </div>

          <div className="p-4 sm:p-5 md:p-6 transition-all duration-300 transform bg-white border shadow-md rounded-xl sm:rounded-2xl border-sky-100 hover:shadow-lg hover:-translate-y-1 group">
            <div className="flex items-center justify-center mb-3 sm:mb-4 text-xl sm:text-2xl transition-all duration-300 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-sky-100 text-sky-600 group-hover:bg-sky-600 group-hover:text-white">
              {t("features.beautifulTemplates.icon")}
            </div>
            <h3 className="mb-2 text-base sm:text-lg font-semibold text-sky-800">
              {t("features.beautifulTemplates.title")}
            </h3>
            <p className="text-sm sm:text-base text-sky-600">
              {t("features.beautifulTemplates.description")}
            </p>
          </div>

          <div className="p-4 sm:p-5 md:p-6 transition-all duration-300 transform bg-white border shadow-md rounded-xl sm:rounded-2xl border-sky-100 hover:shadow-lg hover:-translate-y-1 group">
            <div className="flex items-center justify-center mb-3 sm:mb-4 text-xl sm:text-2xl transition-all duration-300 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-sky-100 text-sky-600 group-hover:bg-sky-600 group-hover:text-white">
              {t("features.atsOptimized.icon")}
            </div>
            <h3 className="mb-2 text-base sm:text-lg font-semibold text-sky-800">
              {t("features.atsOptimized.title")}
            </h3>
            <p className="text-sm sm:text-base text-sky-600">
              {t("features.atsOptimized.description")}
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="relative p-4 sm:p-6 md:p-8 mt-6 sm:mt-8 overflow-hidden bg-white border shadow-lg rounded-xl sm:rounded-2xl border-sky-100 mx-2">
          {/* Abstract decorative element */}
          <div className="absolute top-0 right-0 z-0 w-64 h-64 -mt-32 -mr-32 bg-blue-500 rounded-full filter blur-3xl opacity-5"></div>

          <div className="relative z-10">
            <h3 className="flex items-center mb-4 sm:mb-5 text-base sm:text-lg md:text-xl font-bold text-sky-800">
              <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mr-2 sm:mr-3 text-base sm:text-lg rounded-lg sm:rounded-xl bg-sky-100 text-sky-600">
                💡
              </span>
              <span className="break-words">
                {t("proTips.title", { step: stepTitles[currentStep - 1] })}
              </span>
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 md:grid-cols-2">
              {currentStep === 1 && (
                <>
                  <div className="p-3 sm:p-4 bg-sky-50 rounded-lg sm:rounded-xl">
                    <h4 className="mb-1.5 sm:mb-2 text-sm sm:text-base font-medium text-sky-700">
                      {t("proTips.personalInfo.tip1.title")}
                    </h4>
                    <p className="text-xs sm:text-sm text-sky-600">
                      {t("proTips.personalInfo.tip1.description")}
                    </p>
                  </div>
                  <div className="p-4 bg-sky-50 rounded-xl">
                    <h4 className="mb-2 font-medium text-sky-700">
                      {t("proTips.personalInfo.tip2.title")}
                    </h4>
                    <p className="text-sm text-sky-600">
                      {t("proTips.personalInfo.tip2.description")}
                    </p>
                  </div>
                  <div className="p-4 bg-sky-50 rounded-xl">
                    <h4 className="mb-2 font-medium text-sky-700">
                      {t("proTips.personalInfo.tip3.title")}
                    </h4>
                    <p className="text-sm text-sky-600">
                      {t("proTips.personalInfo.tip3.description")}
                    </p>
                  </div>
                  <div className="p-4 bg-sky-50 rounded-xl">
                    <h4 className="mb-2 font-medium text-sky-700">
                      {t("proTips.personalInfo.tip4.title")}
                    </h4>
                    <p className="text-sm text-sky-600">
                      {t("proTips.personalInfo.tip4.description")}
                    </p>
                  </div>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <div className="p-4 bg-sky-50 rounded-xl">
                    <h4 className="mb-2 font-medium text-sky-700">
                      {t("proTips.achievements.tip1.title")}
                    </h4>
                    <p className="text-sm text-sky-600">
                      {t("proTips.achievements.tip1.description")}
                    </p>
                  </div>
                  <div className="p-4 bg-sky-50 rounded-xl">
                    <h4 className="mb-2 font-medium text-sky-700">
                      {t("proTips.achievements.tip2.title")}
                    </h4>
                    <p className="text-sm text-sky-600">
                      {t("proTips.achievements.tip2.description")}
                    </p>
                  </div>
                  <div className="p-4 bg-sky-50 rounded-xl">
                    <h4 className="mb-2 font-medium text-sky-700">
                      {t("proTips.achievements.tip3.title")}
                    </h4>
                    <p className="text-sm text-sky-600">
                      {t("proTips.achievements.tip3.description")}
                    </p>
                  </div>
                  <div className="p-4 bg-sky-50 rounded-xl">
                    <h4 className="mb-2 font-medium text-sky-700">
                      {t("proTips.achievements.tip4.title")}
                    </h4>
                    <p className="text-sm text-sky-600">
                      {t("proTips.achievements.tip4.description")}
                    </p>
                  </div>
                </>
              )}
              {/* Similar sections for other steps... */}
            </div>
          </div>
        </div>

        {/* Quick Help & Support */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-0 mt-6 sm:mt-8 md:mt-10 mb-4 sm:mb-6 px-2">
          <button className="px-4 sm:px-5 py-2 sm:py-2.5 mx-0 sm:mx-2 transition-all duration-300 bg-white border rounded-lg shadow-sm text-sky-600 text-sm sm:text-base border-sky-200 hover:bg-sky-50 w-full sm:w-auto">
            {t("buttons.saveProgress")}
          </button>
          <button className="px-4 sm:px-5 py-2 sm:py-2.5 mx-0 sm:mx-2 transition-all duration-300 bg-white border rounded-lg shadow-sm text-sky-600 text-sm sm:text-base border-sky-200 hover:bg-sky-50 w-full sm:w-auto">
            {t("buttons.needHelp")}
          </button>
          <button className="px-4 sm:px-5 py-2 sm:py-2.5 mx-0 sm:mx-2 transition-all duration-300 bg-white border rounded-lg shadow-sm text-sky-600 text-sm sm:text-base border-sky-200 hover:bg-sky-50 w-full sm:w-auto">
            {t("buttons.previewResume")}
          </button>
        </div>
      </div>

      {/* Add global CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes confetti {
          0% {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + ${Math.random() * 500 - 250}px),
              calc(-50% + ${Math.random() * 500}px)
            );
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;
