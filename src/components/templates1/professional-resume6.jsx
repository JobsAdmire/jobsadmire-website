import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

const ResumeContainer = () => {
  const { t } = useTranslation('resume-generator');
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  
  // Sample user data that would normally come from an API or form
  
  
  
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">{t("resumeBuilder")}</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setSelectedTemplate('professional')}
              className={`px-4 py-2 rounded ${selectedTemplate === 'professional' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Professional
            </button>
            <button 
              onClick={() => setSelectedTemplate('tailwind')}
              className={`px-4 py-2 rounded ${selectedTemplate === 'tailwind' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Two-Column
            </button>
            <button 
              onClick={() => setSelectedTemplate('minimal')}
              className={`px-4 py-2 rounded ${selectedTemplate === 'minimal' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Minimal
            </button>
            <button 
              onClick={() => setSelectedTemplate('gradient')}
              className={`px-4 py-2 rounded ${selectedTemplate === 'gradient' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Gradient
            </button>
            <button 
              onClick={() => setSelectedTemplate('dark')}
              className={`px-4 py-2 rounded ${selectedTemplate === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Dark
            </button>
            <button 
              onClick={() => setSelectedTemplate('modern')}
              className={`px-4 py-2 rounded ${selectedTemplate === 'modern' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Modern
            </button>
            <button 
              onClick={() => setSelectedTemplate('skill-based')}
              className={`px-4 py-2 rounded ${selectedTemplate === 'skill-based' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Skill-Based
            </button>
          </div>
        </div>
        
        {renderSelectedTemplate()}
      </div>
    </div>
  );
};

export default ResumeContainer;