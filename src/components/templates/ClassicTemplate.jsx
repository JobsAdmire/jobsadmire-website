// src/components/templates/ClassicTemplate.js
import React from 'react';
import { formatDate } from '../../utils/dateUtils';

const ClassicTemplate = ({ cvData }) => {
  return (
    <div className="bg-white p-6 shadow-lg max-w-4xl mx-auto" style={{backgroundColor: 'white', padding: '1.5rem', maxWidth: '56rem', margin: '0 auto', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}>
      {/* Decorative top accent */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4" style={{width: '100%', height: '3px', background: 'linear-gradient(to right, #2563eb, #4f46e5, #9333ea)', marginBottom: '1rem'}}></div>
      
      {/* Header */}
      <div className="text-center mb-6" style={{textAlign: 'center', marginBottom: '1.5rem'}}>
        {/* Profile Photo */}
        {cvData.personal.photoUrl && (
          <div className="mb-3" style={{marginBottom: '0.75rem'}}>
            <img
              src={cvData.personal.photoUrl}
              alt={`${cvData.personal.firstName} ${cvData.personal.lastName}`}
              className="w-16 h-16 rounded-full object-cover mx-auto border-3 border-white shadow-md"
              style={{
                width: '4rem', 
                height: '4rem', 
                borderRadius: '50%', 
                objectFit: 'cover', 
                margin: '0 auto', 
                border: '3px solid white', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                display: 'block'
              }}
            />
          </div>
        )}
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem', lineHeight: '2rem'}}>
          <span style={{background: 'linear-gradient(to right, #1d4ed8, #3730a3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: '#1d4ed8'}}>
            {cvData.personal.firstName}
          </span>{' '}
          <span style={{color: '#374151'}}>{cvData.personal.lastName}</span>
        </h1>
        
        <div className="flex justify-center flex-wrap gap-4 text-xs text-gray-600 mb-1" style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: '#4b5563', marginBottom: '0.25rem'}}>
          {cvData.personal.email && (
            <div className="flex items-center gap-1" style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
              <div style={{width: '3px', height: '3px', backgroundColor: '#3b82f6', borderRadius: '50%'}}></div>
              <span>{cvData.personal.email}</span>
            </div>
          )}
          {cvData.personal.phone && (
            <div className="flex items-center gap-1" style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
              <div style={{width: '3px', height: '3px', backgroundColor: '#3b82f6', borderRadius: '50%'}}></div>
              <span>{cvData.personal.phone}</span>
            </div>
          )}
          {cvData.personal.location && (
            <div className="flex items-center gap-1" style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
              <div style={{width: '3px', height: '3px', backgroundColor: '#3b82f6', borderRadius: '50%'}}></div>
              <span>{cvData.personal.location}</span>
            </div>
          )}
        </div>
        
        {(cvData.personal.linkedin || cvData.personal.website) && (
          <div className="flex justify-center flex-wrap gap-4 text-xs text-gray-600" style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: '#4b5563'}}>
            {cvData.personal.linkedin && (
              <div className="flex items-center gap-1" style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                <div style={{width: '3px', height: '3px', backgroundColor: '#6366f1', borderRadius: '50%'}}></div>
                <span>{cvData.personal.linkedin}</span>
              </div>
            )}
            {cvData.personal.website && (
              <div className="flex items-center gap-1" style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                <div style={{width: '3px', height: '3px', backgroundColor: '#6366f1', borderRadius: '50%'}}></div>
                <span>{cvData.personal.website}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {cvData.personal.summary && (
        <div className="mb-4" style={{marginBottom: '1rem'}}>
          <div className="flex items-center gap-2 mb-2" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
            <div style={{width: '1rem', height: '1rem', background: 'linear-gradient(to right, #2563eb, #4f46e5)', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: '0.5rem', height: '0.5rem', backgroundColor: 'white', borderRadius: '0.125rem'}}></div>
            </div>
            <h2 className="text-base font-bold text-gray-800" style={{fontSize: '1rem', fontWeight: '700', color: '#1f2937'}}>
              Professional Summary
            </h2>
            <div className="flex-1 h-px bg-blue-200" style={{flex: '1', height: '1px', backgroundColor: '#bfdbfe'}}></div>
          </div>
          <div className="ml-6 bg-blue-50 p-3 rounded border-l-3 border-blue-500" style={{marginLeft: '1.5rem', backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '0.25rem', borderLeft: '3px solid #3b82f6'}}>
            <p className="text-sm text-gray-700 leading-relaxed" style={{fontSize: '0.875rem', color: '#374151', lineHeight: '1.5'}}>{cvData.personal.summary}</p>
          </div>
        </div>
      )}

      {/* Experience */}
      {cvData.experience.some(exp => exp.jobTitle || exp.company) && (
        <div className="mb-4" style={{marginBottom: '1rem'}}>
          <div className="flex items-center gap-2 mb-2" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
            <div style={{width: '1rem', height: '1rem', background: 'linear-gradient(to right, #059669, #0d9488)', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: '0.5rem', height: '0.5rem', backgroundColor: 'white', borderRadius: '0.125rem'}}></div>
            </div>
            <h2 className="text-base font-bold text-gray-800" style={{fontSize: '1rem', fontWeight: '700', color: '#1f2937'}}>
              Professional Experience
            </h2>
            <div className="flex-1 h-px bg-emerald-200" style={{flex: '1', height: '1px', backgroundColor: '#a7f3d0'}}></div>
          </div>
          <div className="ml-6 space-y-3" style={{marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            {cvData.experience.filter(exp => exp.jobTitle || exp.company).map((exp, index) => (
              <div key={exp.id} className="relative" style={{position: 'relative'}}>
                {/* Timeline dot */}
                <div style={{position: 'absolute', left: '-1.5rem', top: '0.25rem', width: '0.5rem', height: '0.5rem', background: 'linear-gradient(to right, #10b981, #14b8a6)', borderRadius: '50%', border: '1px solid white'}}></div>
                {index !== cvData.experience.filter(exp => exp.jobTitle || exp.company).length - 1 && (
                  <div style={{position: 'absolute', left: '-1.25rem', top: '0.75rem', width: '1px', height: 'calc(100% + 0.25rem)', backgroundColor: '#a7f3d0'}}></div>
                )}
                
                <div className="bg-white border border-gray-100 rounded p-3" style={{backgroundColor: 'white', border: '1px solid #f3f4f6', borderRadius: '0.25rem', padding: '0.75rem'}}>
                  <div className="flex justify-between items-start mb-2" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem'}}>
                    <div style={{flex: '1'}}>
                      <h3 className="text-sm font-bold text-gray-800" style={{fontSize: '0.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.125rem'}}>{exp.jobTitle}</h3>
                      <div className="text-emerald-600 font-semibold text-sm" style={{color: '#059669', fontWeight: '600', fontSize: '0.875rem'}}>
                        {exp.company}
                        {exp.location && <span className="text-gray-500 font-normal" style={{color: '#6b7280', fontWeight: '400'}}> • {exp.location}</span>}
                      </div>
                    </div>
                    <div className="bg-emerald-50 px-2 py-1 rounded-full" style={{backgroundColor: '#ecfdf5', padding: '0.25rem 0.5rem', borderRadius: '9999px'}}>
                      <div className="text-xs text-emerald-700 font-medium" style={{fontSize: '0.75rem', color: '#047857', fontWeight: '500'}}>
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </div>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-xs text-gray-700 leading-relaxed" style={{fontSize: '0.75rem', color: '#374151', lineHeight: '1.5'}}>
                      {exp.description.split('\n').map((line, index) => (
                        <div key={index} style={{marginBottom: '0.25rem'}}>
                          {line.startsWith('•') || line.startsWith('-') ? (
                            <div className="flex items-start gap-1 ml-1" style={{display: 'flex', alignItems: 'flex-start', gap: '0.25rem', marginLeft: '0.25rem'}}>
                              <div style={{width: '3px', height: '3px', backgroundColor: '#10b981', borderRadius: '50%', marginTop: '0.375rem', flexShrink: '0'}}></div>
                              <span>{line.substring(1).trim()}</span>
                            </div>
                          ) : line.trim() ? (
                            <div>{line}</div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cvData.education.some(edu => edu.degree || edu.school) && (
        <div className="mb-4" style={{marginBottom: '1rem'}}>
          <div className="flex items-center gap-2 mb-2" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
            <div style={{width: '1rem', height: '1rem', background: 'linear-gradient(to right, #9333ea, #db2777)', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: '0.5rem', height: '0.5rem', backgroundColor: 'white', borderRadius: '0.125rem'}}></div>
            </div>
            <h2 className="text-base font-bold text-gray-800" style={{fontSize: '1rem', fontWeight: '700', color: '#1f2937'}}>
              Education
            </h2>
            <div className="flex-1 h-px bg-purple-200" style={{flex: '1', height: '1px', backgroundColor: '#e9d5ff'}}></div>
          </div>
          <div className="ml-6 space-y-2" style={{marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            {cvData.education.filter(edu => edu.degree || edu.school).map((edu) => (
              <div key={edu.id} className="bg-purple-50 border border-purple-100 rounded p-3" style={{backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '0.25rem', padding: '0.75rem'}}>
                <div className="flex justify-between items-start" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div style={{flex: '1'}}>
                    <h3 className="text-sm font-bold text-gray-800" style={{fontSize: '0.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.125rem'}}>{edu.degree}</h3>
                    <div className="text-purple-600 font-semibold text-sm" style={{color: '#9333ea', fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.125rem'}}>
                      {edu.school}
                      {edu.location && <span className="text-gray-500 font-normal" style={{color: '#6b7280', fontWeight: '400'}}> • {edu.location}</span>}
                    </div>
                    {edu.gpa && (
                      <div className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium" style={{display: 'inline-block', backgroundColor: '#ede9fe', color: '#6b21a8', fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontWeight: '500'}}>
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                  <div className="bg-white px-2 py-1 rounded-full border border-purple-200" style={{backgroundColor: 'white', padding: '0.25rem 0.5rem', borderRadius: '9999px', border: '1px solid #e9d5ff'}}>
                    <div className="text-xs text-purple-700 font-medium" style={{fontSize: '0.75rem', color: '#7c3aed', fontWeight: '500'}}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cvData.skills.some(skill => skill.skill) && (
        <div className="mb-4" style={{marginBottom: '1rem'}}>
          <div className="flex items-center gap-2 mb-2" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
            <div style={{width: '1rem', height: '1rem', background: 'linear-gradient(to right, #d97706, #ea580c)', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: '0.5rem', height: '0.5rem', backgroundColor: 'white', borderRadius: '0.125rem'}}></div>
            </div>
            <h2 className="text-base font-bold text-gray-800" style={{fontSize: '1rem', fontWeight: '700', color: '#1f2937'}}>
              Technical Skills
            </h2>
            <div className="flex-1 h-px bg-amber-200" style={{flex: '1', height: '1px', backgroundColor: '#fde68a'}}></div>
          </div>
          <div className="ml-6 bg-amber-50 border border-amber-100 rounded p-3" style={{marginLeft: '1.5rem', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '0.25rem', padding: '0.75rem'}}>
            <div className="grid grid-cols-2 gap-3" style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem'}}>
              {cvData.skills.filter(skill => skill.skill).map((skill) => (
                <div key={skill.id} className="bg-white rounded p-2 border border-amber-200" style={{backgroundColor: 'white', borderRadius: '0.25rem', padding: '0.5rem', border: '1px solid #fde68a'}}>
                  <div className="flex justify-between items-center mb-1" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem'}}>
                    <span className="text-xs text-gray-800 font-semibold" style={{fontSize: '0.75rem', color: '#1f2937', fontWeight: '600'}}>{skill.skill}</span>
                    <span className="text-xs text-amber-600 font-medium bg-amber-100 px-1 py-0.5 rounded-full" style={{fontSize: '0.625rem', color: '#d97706', fontWeight: '500', backgroundColor: '#fef3c7', padding: '0.125rem 0.25rem', borderRadius: '9999px'}}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1" style={{width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.25rem', position: 'relative', overflow: 'hidden'}}>
                    <div 
                      style={{
                        background: 'linear-gradient(to right, #f59e0b, #f97316)',
                        height: '100%',
                        borderRadius: '9999px',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: skill.level === 'Expert' ? '95%' : 
                               skill.level === 'Advanced' ? '80%' : 
                               skill.level === 'Intermediate' ? '60%' : 
                               skill.level === 'Beginner' ? '40%' : '70%'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certifications */}
      {cvData.certifications.some(cert => cert.name) && (
        <div className="mb-4" style={{marginBottom: '1rem'}}>
          <div className="flex items-center gap-2 mb-2" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
            <div style={{width: '1rem', height: '1rem', background: 'linear-gradient(to right, #e11d48, #dc2626)', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: '0.5rem', height: '0.5rem', backgroundColor: 'white', borderRadius: '0.125rem'}}></div>
            </div>
            <h2 className="text-base font-bold text-gray-800" style={{fontSize: '1rem', fontWeight: '700', color: '#1f2937'}}>
              Certifications
            </h2>
            <div className="flex-1 h-px bg-rose-200" style={{flex: '1', height: '1px', backgroundColor: '#fecdd3'}}></div>
          </div>
          <div className="ml-6 space-y-2" style={{marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            {cvData.certifications.filter(cert => cert.name).map((cert) => (
              <div key={cert.id} className="bg-rose-50 border border-rose-100 rounded p-3" style={{backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '0.25rem', padding: '0.75rem'}}>
                <div className="flex justify-between items-start" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div style={{flex: '1'}}>
                    <h3 className="text-sm font-bold text-gray-800" style={{fontSize: '0.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.125rem'}}>{cert.name}</h3>
                    <p className="text-rose-600 font-semibold text-sm" style={{color: '#e11d48', fontWeight: '600', fontSize: '0.875rem'}}>{cert.issuer}</p>
                  </div>
                  <div className="bg-white px-2 py-1 rounded-full border border-rose-200" style={{backgroundColor: 'white', padding: '0.25rem 0.5rem', borderRadius: '9999px', border: '1px solid #fecdd3'}}>
                    <div className="text-xs text-rose-700 font-medium" style={{fontSize: '0.75rem', color: '#be185d', fontWeight: '500'}}>
                      {formatDate(cert.date)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Bottom accent */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mt-4" style={{width: '100%', height: '3px', background: 'linear-gradient(to right, #2563eb, #4f46e5, #9333ea)', marginTop: '1rem'}}></div>
    </div>
  );
};

export default ClassicTemplate;