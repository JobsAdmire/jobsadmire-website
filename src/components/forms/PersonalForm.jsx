// src/components/forms/PersonalForm.js
import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useCmsContent } from '@/lib/context/CmsContentContext';
import { Upload, X, User, Mail, Phone, MapPin, Linkedin, Globe, FileText } from 'lucide-react';

const PersonalForm = ({ cvData, updatePersonal, handlePhotoUpload, removePhoto }) => {
  const { t } = useTranslation('resume-generator');
  const { c } = useCmsContent();
  const ct = (key, options) => c(key) || t(key, options);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-sky-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-6 rounded-t-2xl">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <User className="mr-3 h-6 w-6" />
              {ct('forms.personalInfoTitle')}
            </h2>
            <p className="text-sky-100 mt-1">{ct('forms.buildProfileSubtitle')}</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Profile Photo Section */}
            <div className="bg-sky-50/50 rounded-xl p-6 border border-sky-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-1 h-6 bg-sky-500 rounded-full mr-3"></div>
                {ct('forms.profilePhoto')}
              </h3>
              
              <div className="flex items-center space-x-8">
                <div className="relative">
                  {cvData.personal.photoUrl ? (
                    <div className="relative">
                      <img
                        src={cvData.personal.photoUrl}
                        alt={ct('forms.profileAlt')}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <button
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-sky-100 border-4 border-white shadow-lg flex items-center justify-center">
                      <User size={32} className="text-sky-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <button
                    onClick={triggerFileSelect}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg font-medium"
                  >
                    <Upload size={18} className="mr-2" />
                    {cvData.personal.photoUrl ? ct('forms.changePhoto') : ct('forms.uploadPhoto')}
                  </button>
                  <p className="text-sm text-gray-600 mt-3 bg-blue-50 px-4 py-2 rounded-lg border-l-4 border-sky-400">
                    {ct('forms.headshotTip')}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User size={16} className="mr-2 text-sky-500" />
                    {ct('forms.firstName')}
                  </label>
                  <input
                    type="text"
                    value={cvData.personal.firstName}
                    onChange={(e) => updatePersonal('firstName', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder={ct('forms.placeholderFirstName')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User size={16} className="mr-2 text-sky-500" />
                    {ct('forms.lastName')}
                  </label>
                  <input
                    type="text"
                    value={cvData.personal.lastName}
                    onChange={(e) => updatePersonal('lastName', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder={ct('forms.placeholderLastName')}
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail size={16} className="mr-2 text-sky-500" />
                    {ct('forms.emailAddress')}
                  </label>
                  <input
                    type="email"
                    value={cvData.personal.email}
                    onChange={(e) => updatePersonal('email', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder={ct('forms.placeholderEmailExample')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Phone size={16} className="mr-2 text-sky-500" />
                    {ct('forms.phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    value={cvData.personal.phone}
                    onChange={(e) => updatePersonal('phone', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder={ct('forms.placeholderPhoneExample')}
                  />
                </div>
              </div>

              {/* Location and LinkedIn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin size={16} className="mr-2 text-sky-500" />
                    {ct('forms.location')}
                  </label>
                  <input
                    type="text"
                    value={cvData.personal.location}
                    onChange={(e) => updatePersonal('location', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder={ct('forms.placeholderLocationExample')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Linkedin size={16} className="mr-2 text-sky-500" />
                    {ct('forms.linkedinProfile')}
                  </label>
                  <input
                    type="url"
                    value={cvData.personal.linkedin}
                    onChange={(e) => updatePersonal('linkedin', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder={ct('forms.placeholderLinkedIn')}
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Globe size={16} className="mr-2 text-sky-500" />
                  {ct('forms.websitePortfolio')}
                </label>
                <input
                  type="url"
                  value={cvData.personal.website}
                  onChange={(e) => updatePersonal('website', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-300"
                  placeholder={ct('forms.placeholderPortfolio')}
                />
              </div>

              {/* Professional Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FileText size={16} className="mr-2 text-sky-500" />
                  {ct('forms.professionalSummary')}
                </label>
                <textarea
                  value={cvData.personal.summary}
                  onChange={(e) => updatePersonal('summary', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-300 resize-none"
                  placeholder={ct('forms.placeholderSummary')}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">{ct('forms.summaryHint')}</p>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    {cvData.personal.summary?.length || 0} {ct('forms.characters')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer accent */}
          <div className="h-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-b-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default PersonalForm;