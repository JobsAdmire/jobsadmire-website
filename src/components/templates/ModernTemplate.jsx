// src/components/templates/ModernTemplate.js
import React from 'react';
import { formatDate } from '../../utils/dateUtils';

const ModernTemplate = ({ cvData }) => {
  return (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6" style={{background: 'linear-gradient(to right, #2563EB, #9333EA)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem'}}>
        <div className="flex items-center space-x-6" style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
          {/* Profile Photo */}
          {cvData.personal.photoUrl && (
            <div className="flex-shrink-0">
              <img
                src={cvData.personal.photoUrl}
                alt={`${cvData.personal.firstName} ${cvData.personal.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                style={{width: '6rem', height: '6rem', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
              />
            </div>
          )}
          
          {/* Header Content */}
          <div className="flex-1" style={{flex: '1'}}>
            <h1 className="text-4xl font-bold mb-2" style={{color: 'white', fontSize: '2.25rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '2.5rem'}}>
              {cvData.personal.firstName} {cvData.personal.lastName}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" style={{color: 'white', fontSize: '0.875rem', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
              <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {cvData.personal.email && (
                  <div className="flex items-center" style={{color: 'white', display: 'flex', alignItems: 'center'}}>
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'white', marginRight: '0.5rem', width: '1rem', height: '1rem'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span style={{color: 'white'}}>{cvData.personal.email}</span>
                  </div>
                )}
                {cvData.personal.phone && (
                  <div className="flex items-center" style={{color: 'white', display: 'flex', alignItems: 'center'}}>
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'white', marginRight: '0.5rem', width: '1rem', height: '1rem'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span style={{color: 'white'}}>{cvData.personal.phone}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {cvData.personal.location && (
                  <div className="flex items-center" style={{color: 'white', display: 'flex', alignItems: 'center'}}>
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'white', marginRight: '0.5rem', width: '1rem', height: '1rem'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span style={{color: 'white'}}>{cvData.personal.location}</span>
                  </div>
                )}
                <div className="space-y-1" style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                  {cvData.personal.linkedin && <div style={{color: 'white'}}>{cvData.personal.linkedin}</div>}
                  {cvData.personal.website && <div style={{color: 'white'}}>{cvData.personal.website}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {cvData.personal.summary && (
        <div className="mb-6" style={{marginBottom: '1.5rem'}}>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 border-l-4 border-blue-500 pl-4" style={{borderLeft: '4px solid #3B82F6', paddingLeft: '1rem', fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem', lineHeight: '2rem'}}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg" style={{backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '0.5rem', color: '#374151', lineHeight: '1.625', textAlign: 'justify'}}>{cvData.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {cvData.experience.some(exp => exp.jobTitle || exp.company) && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-4" style={{borderLeft: '4px solid #3B82F6', paddingLeft: '1rem'}}>
            Professional Experience
          </h2>
          <div className="space-y-6">
            {cvData.experience.filter(exp => exp.jobTitle || exp.company).map((exp) => (
              <div key={exp.id} className="border-l-2 border-blue-200 pl-4" style={{borderLeft: '2px solid #BFDBFE', paddingLeft: '1rem'}}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-800" style={{color: '#1E40AF'}}>{exp.jobTitle}</h3>
                    <div className="text-gray-600 font-medium">{exp.company}</div>
                    {exp.location && <div className="text-gray-500 text-sm">{exp.location}</div>}
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium" style={{backgroundColor: '#DBEAFE', color: '#1E40AF'}}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 leading-relaxed mt-2 whitespace-pre-line">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cvData.education.some(edu => edu.degree || edu.school) && (
        <div className="mb-6" style={{marginBottom: '1.5rem'}}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-4" style={{borderLeft: '4px solid #3B82F6', paddingLeft: '1rem', fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem', lineHeight: '2rem'}}>
            Education
          </h2>
          <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {cvData.education.filter(edu => edu.degree || edu.school).map((edu) => (
              <div key={edu.id} className="bg-gray-50 p-4 rounded-lg" style={{backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '0.5rem'}}>
                <div className="flex justify-between items-start" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div style={{flex: '1'}}>
                    <h3 className="text-lg font-semibold text-gray-900" style={{fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem', lineHeight: '1.75rem'}}>{edu.degree}</h3>
                    <div className="text-gray-600 font-medium" style={{color: '#4B5563', fontWeight: '500', marginBottom: '0.25rem'}}>{edu.school}</div>
                    {edu.location && <div className="text-gray-500 text-sm" style={{color: '#6B7280', fontSize: '0.875rem'}}>{edu.location}</div>}
                    {edu.gpa && <div className="text-blue-600 text-sm font-medium mt-1" style={{color: '#2563EB', fontSize: '0.875rem', fontWeight: '500', marginTop: '0.25rem'}}>GPA: {edu.gpa}</div>}
                  </div>
                  <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded" style={{backgroundColor: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', color: '#6B7280', fontSize: '0.875rem', marginLeft: '1rem'}}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills */}
        {cvData.skills.some(skill => skill.skill) && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-4">
              Skills
            </h2>
            <div className="space-y-3">
              {cvData.skills.filter(skill => skill.skill).map((skill) => (
                <div key={skill.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{skill.skill}</span>
                    <span className="text-sm text-blue-600 font-medium">{skill.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ 
                        width: skill.level === 'Expert' ? '100%' : 
                               skill.level === 'Advanced' ? '75%' : 
                               skill.level === 'Intermediate' ? '50%' : '25%' 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {cvData.certifications.some(cert => cert.name) && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-4">
              Certifications
            </h2>
            <div className="space-y-3">
              {cvData.certifications.filter(cert => cert.name).map((cert) => (
                <div key={cert.id} className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-600 text-sm">{cert.issuer}</p>
                  <p className="text-blue-600 text-sm font-medium">{formatDate(cert.date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;