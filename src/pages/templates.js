import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Star,
  Clock,
  Edit,
  Trash2,
  Share2,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "@/lib/utils/toast";

// Import your template components
import NurseResumeTemplate from "@/components/templates1/oneTemplates";
import Templatetwo from "@/components/templates1/professional-resume1";
import Templatethree from "@/components/templates1/professional-resume2";
import ProfessionalResumeTemplate2 from "@/components/templates1/template2"; // New template
import ProfessionalResumeTemplate10 from "@/components/templates1/professional-resume10"; // New template

const ResumeSelector = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  // State to hold all collected resume data from localStorage
  const [resumeData, setResumeData] = useState({});
  // State for the currently selected resume template
  const [selectedResume, setSelectedResume] = useState(null);
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Ref for the resume preview area to capture for PDF
  const resumePreviewRef = useRef(null);

  // Effect to load all resume data from localStorage on component mount
  useEffect(() => {
    const personal_data = localStorage.getItem("personal_information");
    const experience_data = localStorage.getItem("experience_information");
    const education_data = localStorage.getItem("education_information");
    const skill_data = localStorage.getItem("skill_information");
    const achievements_data = localStorage.getItem("achievement_information");
    const project_data = localStorage.getItem("project_information");

    const rData = {
      personal_data: personal_data ? JSON.parse(personal_data) : {},
      experience_data: experience_data ? JSON.parse(experience_data) : [],
      education_data: education_data ? JSON.parse(education_data) : [],
      skill_data: skill_data ? JSON.parse(skill_data) : [],
      achievements_data: achievements_data ? JSON.parse(achievements_data) : [],
      project_data: project_data ? JSON.parse(project_data) : [],
    };
    setResumeData(rData);
  }, []);

  // Function to handle edit resume button click
  const handleEditResume = () => {
    try {
      // Ensure all current data is saved to localStorage before navigating
      if (
        resumeData.personal_data &&
        Object.keys(resumeData.personal_data).length > 0
      ) {
        localStorage.setItem(
          "personal_information",
          JSON.stringify(resumeData.personal_data)
        );
      }
      if (
        resumeData.experience_data &&
        Object.keys(resumeData.experience_data).length > 0
      ) {
        localStorage.setItem(
          "experience_information",
          JSON.stringify(resumeData.experience_data)
        );
      }
      if (
        resumeData.education_data &&
        Object.keys(resumeData.education_data).length > 0
      ) {
        localStorage.setItem(
          "education_information",
          JSON.stringify(resumeData.education_data)
        );
      }
      if (
        resumeData.skill_data &&
        Object.keys(resumeData.skill_data).length > 0
      ) {
        localStorage.setItem(
          "skill_information",
          JSON.stringify(resumeData.skill_data)
        );
      }
      if (
        resumeData.achievements_data &&
        Object.keys(resumeData.achievements_data).length > 0
      ) {
        localStorage.setItem(
          "achievement_information",
          JSON.stringify(resumeData.achievements_data)
        );
      }
      if (
        resumeData.project_data &&
        Object.keys(resumeData.project_data).length > 0
      ) {
        localStorage.setItem(
          "project_information",
          JSON.stringify(resumeData.project_data)
        );
      }

      // Store edit mode flag
      localStorage.setItem("editMode", "true");
      localStorage.setItem(
        "editingTemplate",
        selectedResume?.title || "default"
      );

      // Navigate to the resume builder
      router.push("/resume-generator");
    } catch (error) {
      console.error("Error preparing data for edit:", error);
      showError("Error loading resume data for editing. Please try again.");
    }
  };

  // Function to handle creating a new resume
  const handleNewResume = () => {
    try {
      // Clear all existing data from localStorage
      localStorage.removeItem("personal_information");
      localStorage.removeItem("experience_information");
      localStorage.removeItem("education_information");
      localStorage.removeItem("skill_information");
      localStorage.removeItem("achievement_information");
      localStorage.removeItem("project_information");
      localStorage.removeItem("editMode");
      localStorage.removeItem("editingTemplate");

      // Navigate to the resume builder
      router.push("/resume-builder");
    } catch (error) {
      console.error("Error starting new resume:", error);
      showError("Error starting new resume. Please try again.");
    }
  };

  // Define the resume templates dynamically, including the new template
  const allResumes = [
    {
      id: 1,
      title: "Healthcare Professional",
      thumbnail:
        "https://placehold.co/210x297/3b82f6/ffffff?text=Healthcare+Pro",
      template: <NurseResumeTemplate userData={resumeData} />,
      category: "Healthcare",
      updatedAt: "2 days ago",
      isFavorite: true,
    },
    {
      id: 2,
      title: "Modern Professional",
      thumbnail: "https://placehold.co/210x297/475569/ffffff?text=Modern+Pro",
      template: <ProfessionalResumeTemplate2 userData={resumeData} />,
      category: "Professional",
      updatedAt: "Just now",
      isFavorite: true,
    },
    {
      id: 3,
      title: "Creative Designer CV",
      thumbnail: "https://placehold.co/210x297/10b981/ffffff?text=Creative+CV",
      template: <Templatetwo userData={resumeData} />,
      category: "Creative",
      updatedAt: "1 week ago",
      isFavorite: false,
    },
    {
      id: 4,
      title: "Tech Professional",
      thumbnail: "https://placehold.co/210x297/8b5cf6/ffffff?text=Tech+Pro",
      template: <Templatethree userData={resumeData} />,
      category: "Technology",
      updatedAt: "3 weeks ago",
      isFavorite: true,
    },
    {
      id: 5,
      title: "Business Executive",
      thumbnail:
        "https://placehold.co/210x297/f59e0b/ffffff?text=Business+Exec",
      template: <ProfessionalResumeTemplate10 userData={resumeData} />,
      category: "Business",
      updatedAt: "1 month ago",
      isFavorite: false,
    },
    {
      id: 6,
      title: "Academic Research",
      thumbnail: "https://placehold.co/210x297/ef4444/ffffff?text=Academic",
      template: null,
      category: "Education",
      updatedAt: "2 months ago",
      isFavorite: false,
    },
  ];

  // Set the initial selected resume once resumeData is loaded
  useEffect(() => {
    if (allResumes.length > 0 && !selectedResume) {
      setSelectedResume(allResumes[0]);
    }
  }, [resumeData, allResumes, selectedResume]);

  // All available categories for filtering
  const categories = [
    "All",
    ...new Set(allResumes.map((resume) => resume.category)),
  ];

  // Filter resumes based on search, favorites, and category
  const filteredResumes = allResumes.filter((resume) => {
    const matchesSearch = resume.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFavorite = filterFavorites ? resume.isFavorite : true;
    const matchesCategory =
      categoryFilter === "All" || resume.category === categoryFilter;
    return matchesSearch && matchesFavorite && matchesCategory;
  });

  // Toggle favorite status
  const toggleFavorite = (id) => {
    if (selectedResume && selectedResume.id === id) {
      setSelectedResume({
        ...selectedResume,
        isFavorite: !selectedResume.isFavorite,
      });
    }
  };

  // Function to handle PDF download - UPDATED WITH FULL PAGE COVERAGE
  const handleDownloadPdf = async () => {
    if (!resumePreviewRef.current) {
      console.error("Resume preview element not found for PDF generation.");
      return;
    }

    try {
      // Find the actual resume content
      const resumeContainer = resumePreviewRef.current;
      const resumeContent =
        resumeContainer.querySelector(".max-w-4xl") ||
        resumeContainer.querySelector('[class*="max-w"]') ||
        resumeContainer.firstElementChild ||
        resumeContainer;

      if (!resumeContent) {
        console.error("Resume content not found");
        showError("Could not find resume content for PDF generation.");
        return;
      }

      console.log("Generating PDF for element:", resumeContent);

      // Create PDF with html2canvas - using exact A4 dimensions for full page coverage
      const canvas = await html2canvas(resumeContent, {
        scale: 2, // Higher resolution for crisp output
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollX: 0,
        scrollY: 0,
        width: 794, // A4 width in pixels (210mm at 96 DPI)
        height: 1123, // A4 height in pixels (297mm at 96 DPI)
        windowWidth: 1200,
        windowHeight: 1600,
        onclone: (clonedDoc) => {
          // Find the cloned resume content
          const clonedResume =
            clonedDoc.body.querySelector(".max-w-4xl") ||
            clonedDoc.body.querySelector('[class*="max-w"]') ||
            clonedDoc.body.firstElementChild;

          if (clonedResume) {
            // Force the resume to fill entire A4 dimensions
            clonedResume.style.transform = "none";
            clonedResume.style.scale = "1";
            clonedResume.style.width = "794px"; // A4 width
            clonedResume.style.height = "1123px"; // A4 height - FILLS ENTIRE PAGE
            clonedResume.style.maxWidth = "794px";
            clonedResume.style.minHeight = "1123px";
            clonedResume.style.overflow = "visible";
            clonedResume.style.position = "static";
            clonedResume.style.margin = "0";
            clonedResume.style.padding = "0";
            clonedResume.style.boxSizing = "border-box";
            clonedResume.style.display = "block";

            // Ensure all child elements are visible and properly sized
            const allElements = clonedResume.querySelectorAll("*");
            allElements.forEach((el) => {
              el.style.transform = "none";
              el.style.opacity = "1";
              el.style.visibility = "visible";
              el.style.display =
                el.style.display === "none" ? "block" : el.style.display;
              el.style.boxSizing = "border-box";
            });

            // Add extra padding at bottom if needed to fill the page
            const lastChild = clonedResume.lastElementChild;
            if (lastChild) {
              lastChild.style.paddingBottom = "40px";
            }

            console.log(
              "Cloned resume prepared for capture with full A4 dimensions"
            );
          }
        },
      });

      console.log("Canvas created:", canvas.width, "x", canvas.height);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas has zero dimensions");
      }

      const imgData = canvas.toDataURL("image/png", 1.0); // Maximum quality
      console.log("Image data created, length:", imgData.length);

      if (imgData === "data:,") {
        throw new Error("Canvas is empty");
      }

      // Create PDF with exact A4 dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: false, // Don't compress to maintain quality
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm

      // Add the image to fill the ENTIRE page with no margins - NO WHITE SPACE AT BOTTOM
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");

      // Generate filename
      const userName = resumeData.personal_data?.firstName || "Resume";
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `${userName}_${selectedResume?.title?.replace(/\s+/g, "_") || "resume"}_${timestamp}.pdf`;

      pdf.save(filename);
      console.log(
        "PDF generated and saved successfully with full page coverage!"
      );
    } catch (error) {
      console.error("Detailed error generating PDF:", error);
      showError(`Error generating PDF: ${error.message}. Please try again.`);
    }
  };

  return (
    <div className="flex h-screen mt-10 bg-gray-50 font-inter">
      {/* Left Panel - Resume Thumbnails */}
      <div className="w-1/3 p-6 overflow-y-auto bg-white border-r border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t("labels.templates.resumeTemplates")}</h2>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleNewResume}
          >
            {t("labels.templates.newResume")}
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={t("labels.templates.searchTemplates")}
              className="w-full p-3 pl-10 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute text-gray-400 left-3 top-3" size={18} />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${filterFavorites ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200"}`}
              onClick={() => setFilterFavorites(!filterFavorites)}
            >
              <Star className="mr-1" size={16} />
              {t("labels.templates.favorites")}
            </button>
            <button className="flex items-center px-4 py-2 text-sm text-gray-600 transition-colors bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200">
              <Clock className="mr-1" size={16} />
              {t("labels.templates.recent")}
            </button>
          </div>

          {/* Category Filter */}
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              {t("labels.templates.categories")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    categoryFilter === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resume Thumbnails List */}
        <div className="grid gap-4">
          {filteredResumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="p-3 mb-4 text-blue-500 bg-blue-100 rounded-full">
                <Search size={24} />
              </div>
              <h3 className="mb-2 font-medium text-gray-700">
                {t("labels.templates.noTemplatesFound")}
              </h3>
              <p className="text-sm text-gray-500">
                {t("labels.templates.tryAdjustingSearch")}
              </p>
            </div>
          ) : (
            filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 group ${selectedResume && selectedResume.id === resume.id ? "ring-2 ring-blue-500 bg-blue-50" : "border border-gray-200"}`}
                onClick={() => setSelectedResume(resume)}
              >
                <div className="flex items-start">
                  <div className="relative overflow-hidden bg-gray-100 rounded-md shadow-sm">
                    <img
                      src={resume.thumbnail}
                      alt={resume.title}
                      className="object-cover w-20 h-28"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs font-medium text-white bg-gradient-to-t from-gray-900/70 to-transparent">
                      {resume.category}
                    </div>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                        {resume.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(resume.id);
                        }}
                        className="text-gray-400 transition-colors hover:text-yellow-500"
                        aria-label={
                          resume.isFavorite
                            ? t("labels.templates.removeFromFavorites")
                            : t("labels.templates.addToFavorites")
                        }
                      >
                        <Star
                          size={16}
                          fill={resume.isFavorite ? "#EAB308" : "none"}
                          color={resume.isFavorite ? "#EAB308" : "currentColor"}
                        />
                      </button>
                    </div>
                    <p className="mb-2 text-xs text-gray-500">
                      Updated {resume.updatedAt}
                    </p>
                    <div className="flex gap-2 mt-2 transition-opacity opacity-0 group-hover:opacity-100">
                      <button
                        className="p-1 text-gray-500 rounded-full hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        aria-label={t("labels.templates.editAria")}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedResume(resume);
                          handleEditResume();
                        }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="p-1 text-gray-500 rounded-full hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label={t("labels.templates.deleteAria")}
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        className="p-1 text-gray-500 rounded-full hover:text-green-600 hover:bg-green-50 transition-colors"
                        aria-label={t("labels.templates.shareAria")}
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Resume Preview */}
      <div className="flex flex-col w-2/3 p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedResume ? selectedResume.title : t("labels.templates.selectATemplate")}
            </h2>
            {selectedResume && (
              <div className="flex items-center mt-1">
                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mr-2">
                  {selectedResume.category}
                </span>
                <span className="text-sm text-gray-500">
                  Last updated {selectedResume.updatedAt}
                </span>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDownloadPdf}
              disabled={!selectedResume}
            >
              <Download size={16} className="mr-2" />
              {t("labels.templates.downloadPdf")}
            </button>
            <button
              className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleEditResume}
              disabled={!selectedResume}
            >
              <Edit size={16} className="mr-2" />
              {t("labels.templates.editResume")}
            </button>
          </div>
        </div>

        {/* Resume Preview Area */}
        <div className="flex items-start justify-center flex-1 p-6 overflow-y-auto bg-gray-100 rounded-lg shadow-inner">
          <div
            ref={resumePreviewRef}
            className="w-full max-w-4xl overflow-hidden transition-all duration-300 transform scale-90 bg-white rounded-md shadow-xl hover:shadow-2xl hover:scale-95"
            style={{
              minHeight: "1123px", // Ensure minimum A4 height for PDF generation
              aspectRatio: "210/297", // A4 aspect ratio
            }}
          >
            {selectedResume ? (
              selectedResume.template != null ? (
                selectedResume.template
              ) : (
                <div className="p-8 text-center text-gray-500">{t("labels.templates.comingSoon")}</div>
              )
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Choose Your Template
                  </h3>
                  <p className="text-gray-500">
                    {t("labels.templates.selectTemplateToPreview")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-6">
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              const currentIndex = allResumes.findIndex(
                (r) => selectedResume && r.id === selectedResume.id
              );
              if (currentIndex > 0) {
                setSelectedResume(allResumes[currentIndex - 1]);
              }
            }}
            disabled={
              !selectedResume ||
              allResumes.findIndex(
                (r) => selectedResume && r.id === selectedResume.id
              ) === 0
            }
          >
            <ChevronLeft size={16} className="mr-2" />
            Previous
          </button>
          <div className="flex items-center">
            <span className="px-3 py-1 text-sm font-medium text-blue-600 rounded-lg bg-blue-50">
              {selectedResume
                ? allResumes.findIndex((r) => r.id === selectedResume.id) + 1
                : 0}{" "}
              of {allResumes.length}
            </span>
          </div>
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              const currentIndex = allResumes.findIndex(
                (r) => selectedResume && r.id === selectedResume.id
              );
              if (currentIndex < allResumes.length - 1) {
                setSelectedResume(allResumes[currentIndex + 1]);
              }
            }}
            disabled={
              !selectedResume ||
              allResumes.findIndex(
                (r) => selectedResume && r.id === selectedResume.id
              ) ===
                allResumes.length - 1
            }
          >
            Next
            <ChevronRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default ResumeSelector;
