// src/components/CVGenerator.js
import React, { useState, useRef } from 'react';
import { Download, LayoutTemplate } from 'lucide-react'; // Import LayoutTemplate icon

// Import custom hooks and utilities
import { useCVData } from '../hooks/useCVData';
import { generatePDF } from '../utils/pdfGenerator';

// Import form components
import PersonalForm from './forms/PersonalForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import CertificationsForm from './forms/CertificationsForm';

// Import UI components
import TabNavigation from './ui/TabNavigation';
import TemplateSelector from './ui/TemplateSelector';

// Import templates
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

const CVGenerator = () => {
  const [currentStep, setCurrentStep] = useState('templateSelection'); // 'templateSelection' or 'formFilling'
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const printRef = useRef();

  const {
    cvData,
    updatePersonal,
    handlePhotoUpload,
    removePhoto,
    updateExperience,
    addExperience,
    removeExperience,
    updateEducation,
    addEducation,
    removeEducation,
    updateSkills,
    addSkill,
    removeSkill,
    updateCertification,
    addCertification,
    removeCertification
  } = useCVData();

  const handlePrint = () => {
    const cvContent = printRef.current.innerHTML;
    generatePDF(cvContent, cvData.personal.firstName, cvData.personal.lastName);
  };

  const handleTemplateSelectedAndProceed = (templateId) => {
    setSelectedTemplate(templateId);
    setCurrentStep('formFilling');
    setActiveTab('personal');
  };

  // Function to go back to template selection
  const handleSelectTemplateAgain = () => {
    setCurrentStep('templateSelection');
  };

  // ----- ENSURE THIS FUNCTION IS PRESENT IN YOUR CVGenerator.js -----
  const renderFormContent = () => {
    if (currentStep === 'templateSelection') {
      return (
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          cvData={cvData}
          onProceed={handleTemplateSelectedAndProceed}
        />
      );
    } else { // currentStep === 'formFilling'
      switch (activeTab) {
        case 'personal':
          return (
            <PersonalForm
              cvData={cvData}
              updatePersonal={updatePersonal}
              handlePhotoUpload={handlePhotoUpload}
              removePhoto={removePhoto}
            />
          );
        case 'experience':
          return (
            <ExperienceForm
              cvData={cvData}
              updateExperience={updateExperience}
              addExperience={addExperience}
              removeExperience={removeExperience}
            />
          );
        case 'education':
          return (
            <EducationForm
              cvData={cvData}
              updateEducation={updateEducation}
              addEducation={addEducation}
              removeEducation={removeEducation}
            />
          );
        case 'skills':
          return (
            <SkillsForm
              cvData={cvData}
              updateSkills={updateSkills}
              addSkill={addSkill}
              removeSkill={removeSkill}
            />
          );
        case 'certifications':
          return (
            <CertificationsForm
              cvData={cvData}
              updateCertification={updateCertification}
              addCertification={addCertification}
              removeCertification={removeCertification}
            />
          );
        default:
          return null;
      }
    }
  };

  // ----- AND ESPECIALLY THIS ONE! -----
  const renderTemplate = () => {
    const templateProps = { cvData };

    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate {...templateProps} />;
      case 'classic':
        return <ClassicTemplate {...templateProps} />;
      case 'minimal':
        return <MinimalTemplate {...templateProps} />;
      default:
        return <ModernTemplate {...templateProps} />; // Fallback
    }
  };

  return (
    <div className="min-h-screen mt-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SECTION: This will either be TemplateSelector (full width) or Forms (half width) */}
          <div className={`${currentStep === 'templateSelection' ? 'lg:col-span-2' : ''} bg-white rounded-lg shadow-sm border print:hidden`}>
            {/* Conditional TabNavigation: only show if in formFilling step */}
            {currentStep === 'formFilling' && (
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            )}

            {/* Form Content / Template Selector */}
            <div className="p-6">
              {renderFormContent()}
            </div>
          </div>

          {/* RIGHT SECTION: CV Preview - Only show if in formFilling step */}
          {currentStep === 'formFilling' && (
            <div className="print:col-span-2">
              <div className="sticky top-8">
                {/* Download and "Select Template Again" Buttons */}
                <div className="bg-white rounded-lg shadow-sm border mb-4 print:hidden">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
                      <p className="text-sm text-gray-600">
                        Template: <span className="font-medium capitalize">{selectedTemplate}</span>
                      </p>
                    </div>
                    <div className="flex space-x-3"> {/* Use flexbox for button spacing */}
                        {/* Select Template Again Button */}
                        <button
                            onClick={handleSelectTemplateAgain}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm hover:shadow-md"
                        >
                            <LayoutTemplate size={18} className="mr-2" />
                            Select Template
                        </button>
                        {/* Download PDF Button */}
                        <button
                            onClick={handlePrint}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors shadow-sm hover:shadow-md"
                        >
                            <Download size={18} className="mr-2" />
                            Download PDF
                        </button>
                    </div>
                  </div>
                </div>

                {/* CV Preview */}
                <div className="bg-white rounded-lg shadow-sm border print:border-0 print:shadow-none">
                  <div className="overflow-auto max-h-screen print:max-h-none">
                    <div ref={printRef}>
                      {renderTemplate()} {/* This is where it's called */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:col-span-2 {
            grid-column: span 2 / span 2;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:max-h-none {
            max-height: none !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CVGenerator;