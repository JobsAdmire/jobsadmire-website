// src/components/forms/CertificationsForm.js
import React from 'react';
import { useTranslation } from 'next-i18next';
import { Plus, Trash2 } from 'lucide-react';

const CertificationsForm = ({ cvData, updateCertification, addCertification, removeCertification }) => {
  const { t } = useTranslation('resume-generator');
  return (
    <div className="space-y-4">
      {cvData.certifications.map((cert, index) => (
        <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{t('forms.certificationLabel')} {index + 1}</h3>
            <button
              onClick={() => removeCertification(cert.id)}
              className="text-red-500 hover:text-red-700"
              disabled={cvData.certifications.length === 1}
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('forms.certificationName')}</label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('forms.placeholderCertification')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('forms.issuingOrganization')}</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('forms.placeholderIssuer')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('forms.dateObtained')}</label>
              <input
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addCertification}
        className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <Plus size={16} className="mr-2" />
        {t('forms.addCertification')}
      </button>
    </div>
  );
};

export default CertificationsForm;