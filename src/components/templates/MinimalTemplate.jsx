// src/components/templates/MinimalTemplate.js
import React from 'react';
import { formatDate } from '../../utils/dateUtils';

const MinimalTemplate = ({ cvData }) => {
  return (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-6 mb-4">
          {/* Profile Photo */}
          {cvData.personal.photoUrl && (
            <div className="flex-shrink-0">
              <img
                src={cvData.personal.photoUrl}
                alt={`${cvData.personal.firstName} ${cvData.personal.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
                style={{width: '4rem', height: '4rem', borderRadius: '50%', objectFit: 'cover'}}
              />
            </div>
          )}
          
          {/* Name */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">
              {cvData.personal.firstName} {cvData.personal.lastName}
            </h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <div className="space-y-1">
            {cvData.personal.email && <div>{cvData.personal.email}</div>}
            {cvData.personal.phone && <div>{cvData.personal.phone}</div>}
            {cvData.personal.location && <div>{cvData.personal.location}</div>}
          </div>
          <div className="space-y-1">
            {cvData.personal.linkedin && <div>{cvData.personal.linkedin}</div>}
            {cvData.personal.website && <div>{cvData.personal.website}</div>}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {cvData.personal.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed">{cvData.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {cvData.experience.some(exp => exp.jobTitle || exp.company) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
          <div className="space-y-6">
            {cvData.experience.filter(exp => exp.jobTitle || exp.company).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <div className="text-gray-600">{exp.company}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cvData.education.some(edu => edu.degree || edu.school) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
          <div className="space-y-4">
            {cvData.education.filter(edu => edu.degree || edu.school).map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <div className="text-gray-600">{edu.school}</div>
                    {edu.gpa && <div className="text-gray-500 text-sm">GPA: {edu.gpa}</div>}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cvData.skills.some(skill => skill.skill) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {cvData.skills.filter(skill => skill.skill).map((skill) => (
              <span key={skill.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {skill.skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {cvData.certifications.some(cert => cert.name) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Certifications</h2>
          <div className="space-y-3">
            {cvData.certifications.filter(cert => cert.name).map((cert) => (
              <div key={cert.id}>
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <div className="text-gray-600 text-sm">{cert.issuer} • {formatDate(cert.date)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;