import React, { useState } from 'react';
import { Plus, Trash2, Building, Calendar, MapPin, User, Award, BookOpen, Code, Star } from 'lucide-react';
import { useTranslation } from 'next-i18next';

const ExperienceForm = () => {
  const { t } = useTranslation('common');
  const [experienceData, setExperienceData] = useState({
    projects: [],
    candidateJobs: [],
    qualifications: [],
    skills: []
  });

  // Initialize with empty forms
  const [projects, setProjects] = useState([
    { id: 1, title: '', organization: '', startDate: '', endDate: '', reference: '' }
  ]);

  const [candidateJobs, setCandidateJobs] = useState([
    { id: 1, title: '', organization: '', startDate: '', endDate: '', reference: '' }
  ]);

  const [qualifications, setQualifications] = useState([
    { id: 1, title: '', organization: '', startDate: '', endDate: '', reference: '' }
  ]);

  const [skills, setSkills] = useState([
    { id: 1, type: '', title: '', organization: '', startDate: '', endDate: '', reference: '' }
  ]);

  // Helper function to add new items
  const addItem = (setter, items) => {
    const newId = Math.max(...items.map(item => item.id), 0) + 1;
    const newItem = { 
      id: newId, 
      title: '', 
      organization: '', 
      startDate: '', 
      endDate: '', 
      reference: '',
      ...(setter === setSkills && { type: '' })
    };
    setter([...items, newItem]);
  };

  // Helper function to remove items
  const removeItem = (setter, items, id) => {
    if (items.length > 1) {
      setter(items.filter(item => item.id !== id));
    }
  };

  // Helper function to update items
  const updateItem = (setter, items, id, field, value) => {
    setter(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Generic form section component
  const FormSection = ({ 
    title, 
    titleKey,
    subtitleKey,
    addButtonKey,
    itemNumberKey,
    icon: Icon, 
    items, 
    setter, 
    showType = false, 
    iconColor = 'text-blue-600',
    bgColor = 'from-blue-500 to-indigo-500'
  }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-gradient-to-r ${bgColor} rounded-xl`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{titleKey ? t(titleKey) : title}</h3>
            <p className="text-gray-600 text-sm">{subtitleKey ? t(subtitleKey) : `Add your ${title.toLowerCase()} details`}</p>
          </div>
        </div>
        <button
          onClick={() => addItem(setter, items)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          {addButtonKey ? t(addButtonKey) : `Add ${title.slice(0, -1)}`}
        </button>
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              {title.slice(0, -1)} #{index + 1}
            </h4>
            {items.length > 1 && (
              <button
                onClick={() => removeItem(setter, items, item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showType && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Type *
                </label>
                <select
                  value={item.type || ''}
                  onChange={(e) => updateItem(setter, items, item.id, 'type', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">Select Type</option>
                  <option value="technical">Technical Skills</option>
                  <option value="soft">Soft Skills</option>
                  <option value="language">Language Skills</option>
                  <option value="certification">Certification</option>
                </select>
              </div>
            )}
            
            <div className={`space-y-2 ${showType ? '' : 'md:col-span-2'}`}>
              <label className="block text-sm font-semibold text-gray-700">
                Title *
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(setter, items, item.id, 'title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                placeholder={`Enter ${title.slice(0, -1).toLowerCase()} title`}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-600" />
                Organization *
              </label>
              <input
                type="text"
                value={item.organization}
                onChange={(e) => updateItem(setter, items, item.id, 'organization', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                placeholder="Organization/Company name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Start Date *
              </label>
              <input
                type="date"
                value={item.startDate}
                onChange={(e) => updateItem(setter, items, item.id, 'startDate', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                End Date *
              </label>
              <input
                type="date"
                value={item.endDate}
                onChange={(e) => updateItem(setter, items, item.id, 'endDate', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Reference
              </label>
              <input
                type="text"
                value={item.reference}
                onChange={(e) => updateItem(setter, items, item.id, 'reference', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                placeholder="Reference person/contact"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8 space-y-12">
      {/* Projects Section */}
      <FormSection
        title="Projects"
        titleKey="labels.candidateForm.experienceForm.projects"
        subtitleKey="labels.candidateForm.experienceForm.projectsSubtitle"
        addButtonKey="labels.candidateForm.experienceForm.addProject"
        itemNumberKey="labels.candidateForm.experienceForm.projectNumber"
        icon={Building}
        items={projects}
        setter={setProjects}
        bgColor="from-blue-500 to-indigo-500"
      />

      {/* Experience Candidate Jobs Section */}
      <FormSection
        title="Experience Candidate Jobs"
        titleKey="labels.candidateForm.experienceForm.experienceCandidateJobs"
        subtitleKey="labels.candidateForm.experienceForm.experienceCandidateJobsSubtitle"
        addButtonKey="labels.candidateForm.experienceForm.addExperienceCandidateJob"
        itemNumberKey="labels.candidateForm.experienceForm.experienceCandidateJobNumber"
        icon={MapPin}
        items={candidateJobs}
        setter={setCandidateJobs}
        bgColor="from-purple-500 to-pink-500"
      />

      {/* Qualifications Section */}
      <FormSection
        title="Qualifications"
        titleKey="labels.candidateForm.experienceForm.qualifications"
        subtitleKey="labels.candidateForm.experienceForm.qualificationsSubtitle"
        addButtonKey="labels.candidateForm.experienceForm.addQualification"
        itemNumberKey="labels.candidateForm.experienceForm.qualificationNumber"
        icon={Award}
        items={qualifications}
        setter={setQualifications}
        bgColor="from-green-500 to-emerald-500"
      />

      {/* Skills Section */}
      <FormSection
        title="Skills"
        titleKey="labels.candidateForm.experienceForm.skills"
        subtitleKey="labels.candidateForm.experienceForm.skillsSubtitle"
        addButtonKey="labels.candidateForm.experienceForm.addSkill"
        itemNumberKey="labels.candidateForm.experienceForm.skillNumber"
        icon={Star}
        items={skills}
        setter={setSkills}
        showType={true}
        bgColor="from-orange-500 to-red-500"
      />

      {/* Save Button */}
      <div className="flex justify-center pt-8">
        <button
          type="button"
          onClick={() => {
            console.log('Experience Data:', {
              projects,
              candidateJobs,
              qualifications,
              skills
            });
          }}
          className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-105 hover:rotate-1"
        >
          <span className="relative z-10 flex items-center gap-3">
            {t('labels.candidateForm.experienceForm.saveExperience')}
            <Star className="w-5 h-5" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default ExperienceForm;