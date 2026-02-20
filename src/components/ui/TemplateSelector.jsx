// src/components/ui/TemplateSelector.js
import React from 'react';
import { useTranslation } from 'next-i18next';
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';

const TemplateSelector = ({ selectedTemplate, onTemplateChange, cvData, onProceed }) => {
  const { t } = useTranslation('resume-generator');
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design with blue accents',
      component: ModernTemplate,
      color: '#3B82F6'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional professional layout with colorful sections',
      component: ClassicTemplate,
      color: '#059669'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant design',
      component: MinimalTemplate,
      color: '#6B7280'
    }
  ];

  // Professional sample data for preview
  const sampleData = {
    personal: {
      firstName: cvData.personal?.firstName || 'John',
      lastName: cvData.personal?.lastName || 'Smith',
      email: cvData.personal?.email || 'john.smith@email.com',
      phone: cvData.personal?.phone || '+1 (555) 123-4567',
      location: cvData.personal?.location || 'New York, NY',
      linkedin: cvData.personal?.linkedin || 'linkedin.com/in/johnsmith',
      website: cvData.personal?.website || 'www.johnsmith.com',
      summary: cvData.personal?.summary || 'Experienced professional with 5+ years in software development. Proven track record of delivering high-quality solutions and leading cross-functional teams.',
      photoUrl: cvData.personal?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format'
    },
    experience: (cvData.experience && cvData.experience.length > 0) ? cvData.experience : [
      {
        id: 1,
        jobTitle: 'Senior Software Engineer',
        company: 'Tech Solutions Inc.',
        location: 'San Francisco, CA',
        startDate: '2022-01',
        endDate: '',
        current: true,
        description: '• Led development of scalable web applications\n• Collaborated with cross-functional teams\n• Improved system performance by 40%'
      },
      {
        id: 2,
        jobTitle: 'Software Developer',
        company: 'Innovation Labs',
        location: 'New York, NY',
        startDate: '2020-03',
        endDate: '2021-12',
        current: false,
        description: '• Developed responsive web applications\n• Mentored junior developers\n• Implemented automated testing'
      }
    ],
    education: (cvData.education && cvData.education.length > 0) ? cvData.education : [
      {
        id: 1,
        degree: 'Bachelor of Science in Computer Science',
        school: 'Stanford University',
        location: 'Stanford, CA',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.8/4.0'
      }
    ],
    skills: (cvData.skills && cvData.skills.length > 0) ? cvData.skills : [
      { id: 1, skill: 'JavaScript', level: 'Expert' },
      { id: 2, skill: 'React', level: 'Expert' },
      { id: 3, skill: 'Node.js', level: 'Advanced' },
      { id: 4, skill: 'Python', level: 'Advanced' },
      { id: 5, skill: 'AWS', level: 'Intermediate' },
      { id: 6, skill: 'Docker', level: 'Intermediate' }
    ],
    certifications: (cvData.certifications && cvData.certifications.length > 0) ? cvData.certifications : [
      { id: 1, name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023-06' },
      { id: 2, name: 'Certified Kubernetes Administrator', issuer: 'Cloud Native Computing Foundation', date: '2022-11' }
    ]
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Template
          </h1>
          <p className="text-gray-600 text-lg">
            Select a professional template that best represents your style
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {templates.map((template) => {
            const TemplateComponent = template.component;
            const isSelected = selectedTemplate === template.id;

            return (
              <div
                key={template.id}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                  isSelected ? 'ring-4 ring-blue-500 shadow-2xl transform scale-102' : 'hover:scale-101 hover:shadow-xl'
                }`}
                onClick={() => onTemplateChange(template.id)}
              >
                {/* Template Preview */}
                {/* Revised styling for preview: fixed height, relative width, and a contained scaled child */}
                <div className="relative h-96 bg-gray-50 overflow-hidden flex items-center justify-center border-b border-gray-200">
                  <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      transformOrigin: 'top left',
                      transform: 'scale(0.35)', // Adjusted scale for better visibility. Experiment with this!
                      width: '210mm', // A4 width
                      height: '297mm', // A4 height
                      boxShadow: '0 0 10px rgba(0,0,0,0.1)', // Subtle shadow for paper effect
                      backgroundColor: 'white' // Ensure background is white for templates
                    }}
                  >
                    <TemplateComponent cvData={sampleData} />
                  </div>

                  {/* Overlay for better visibility and a visual fade */}
                  {/* Keep this as it adds a nice gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {t('templateSelector.selected')}
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {template.description}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card onClick from firing twice
                      onTemplateChange(template.id);
                    }}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {isSelected ? t('templateSelector.selected') : t('templateSelector.selectTemplate')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button - Only visible if a template is selected */}
        {selectedTemplate && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => onProceed(selectedTemplate)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors duration-300 text-lg"
            >
              Continue to Form Filling →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;