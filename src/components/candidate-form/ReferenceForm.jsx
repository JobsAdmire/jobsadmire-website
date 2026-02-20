import React, { useState } from 'react';
import { Plus, Trash2, Building, Calendar, MapPin, User, Phone, Mail, Globe, Users, Star } from 'lucide-react';
import { useTranslation } from 'next-i18next';

const ReferencesForm = () => {
  const { t } = useTranslation('common');
  const [references, setReferences] = useState([
    { 
      id: 1, 
      title: '', 
      organization: '', 
      startDate: '', 
      endDate: '', 
      country: '', 
      state: '', 
      city: '',
      contactPerson: '',
      phone: '',
      email: ''
    }
  ]);

  // Helper function to add new reference
  const addReference = () => {
    const newId = Math.max(...references.map(ref => ref.id), 0) + 1;
    const newReference = { 
      id: newId, 
      title: '', 
      organization: '', 
      startDate: '', 
      endDate: '', 
      country: '', 
      state: '', 
      city: '',
      contactPerson: '',
      phone: '',
      email: ''
    };
    setReferences([...references, newReference]);
  };

  // Helper function to remove reference
  const removeReference = (id) => {
    if (references.length > 1) {
      setReferences(references.filter(ref => ref.id !== id));
    }
  };

  // Helper function to update reference
  const updateReference = (id, field, value) => {
    setReferences(references.map(ref => 
      ref.id === id ? { ...ref, [field]: value } : ref
    ));
  };

  const handleSave = () => {
    console.log('References Data:', references);
    // Here you would typically save to your backend or parent component
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t('labels.candidateForm.referenceForm.title')}</h2>
            <p className="text-gray-600">{t('labels.candidateForm.referenceForm.subtitle')}</p>
          </div>
        </div>
        <button
          onClick={addReference}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          {t('labels.candidateForm.referenceForm.addReference')}
        </button>
      </div>

      {/* Info Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Star className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-blue-800 font-medium">{t('labels.candidateForm.referenceForm.noteTitle')}</p>
            <p className="text-blue-600 text-sm">{t('labels.candidateForm.referenceForm.noteDescription')}</p>
          </div>
        </div>
      </div>

      {/* References List */}
      <div className="space-y-6">
        {references.map((reference, index) => (
          <div key={reference.id} className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
            {/* Reference Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 rounded-t-2xl border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">{t('labels.candidateForm.referenceForm.referenceNumber', { number: index + 1 })}</h3>
                </div>
                {references.length > 1 && (
                  <button
                    onClick={() => removeReference(reference.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={t('labels.candidateForm.referenceForm.removeReference')}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Reference Form */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Building className="h-4 w-4 text-indigo-600" />
                  {t('labels.candidateForm.referenceForm.organizationDetails')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('labels.candidateForm.referenceForm.titleLabel')}
                    </label>
                    <input
                      type="text"
                      value={reference.title}
                      onChange={(e) => updateReference(reference.id, 'title', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder={t('labels.candidateForm.referenceForm.titlePlaceholder')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('labels.candidateForm.referenceForm.organizationLabel')}
                    </label>
                    <input
                      type="text"
                      value={reference.organization}
                      onChange={(e) => updateReference(reference.id, 'organization', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder={t('labels.candidateForm.referenceForm.organizationPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  {t('labels.candidateForm.referenceForm.employmentPeriod')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('labels.candidateForm.referenceForm.startDateLabel')}
                    </label>
                    <input
                      type="date"
                      value={reference.startDate}
                      onChange={(e) => updateReference(reference.id, 'startDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('labels.candidateForm.referenceForm.endDateLabel')}
                    </label>
                    <input
                      type="date"
                      value={reference.endDate}
                      onChange={(e) => updateReference(reference.id, 'endDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  {t('labels.candidateForm.referenceForm.locationDetails')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('labels.candidateForm.referenceForm.countryLabel')}
                    </label>
                    <input
                      type="text"
                      value={reference.country}
                      onChange={(e) => updateReference(reference.id, 'country', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder={t('labels.candidateForm.referenceForm.countryPlaceholder')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('labels.candidateForm.referenceForm.stateLabel')}
                    </label>
                    <input
                      type="text"
                      value={reference.state}
                      onChange={(e) => updateReference(reference.id, 'state', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder={t('labels.candidateForm.referenceForm.statePlaceholder')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('labels.candidateForm.referenceForm.cityLabel')}
                    </label>
                    <input
                      type="text"
                      value={reference.city}
                      onChange={(e) => updateReference(reference.id, 'city', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder={t('labels.candidateForm.referenceForm.cityPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-600" />
                  {t('labels.candidateForm.referenceForm.contactInformation')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('labels.candidateForm.referenceForm.contactPerson')}
                    </label>
                    <input
                      type="text"
                      value={reference.contactPerson}
                      onChange={(e) => updateReference(reference.id, 'contactPerson', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder={t('labels.candidateForm.referenceForm.contactPersonPlaceholder')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-indigo-600" />
                      {t('labels.candidateForm.referenceForm.phoneNumber')}
                    </label>
                    <input
                      type="tel"
                      value={reference.phone}
                      onChange={(e) => updateReference(reference.id, 'phone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder={t('labels.candidateForm.referenceForm.phonePlaceholder')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-indigo-600" />
                      {t('labels.candidateForm.referenceForm.emailAddress')}
                    </label>
                    <input
                      type="email"
                      value={reference.email}
                      onChange={(e) => updateReference(reference.id, 'email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder={t('labels.candidateForm.referenceForm.emailPlaceholder')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-8">
        <button
          type="button"
          onClick={() => setReferences([{ 
            id: 1, 
            title: '', 
            organization: '', 
            startDate: '', 
            endDate: '', 
            country: '', 
            state: '', 
            city: '',
            contactPerson: '',
            phone: '',
            email: ''
          }])}
          className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          {t('labels.candidateForm.referenceForm.resetForm')}
        </button>
        
        <button
          type="button"
          onClick={handleSave}
          className="group relative px-12 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-105 hover:rotate-1"
        >
          <span className="relative z-10 flex items-center gap-3">
            {t('labels.candidateForm.referenceForm.saveReferences')}
            <Users className="w-5 h-5" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default ReferencesForm;