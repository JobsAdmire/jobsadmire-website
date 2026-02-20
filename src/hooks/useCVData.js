// src/hooks/useCVData.js
import { useState } from 'react';

export const useCVData = () => {
  const [cvData, setCvData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: '',
      photo: null,
      photoUrl: ''
    },
    experience: [
      {
        id: 1,
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ],
    education: [
      {
        id: 1,
        degree: '',
        school: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }
    ],
    skills: [
      { id: 1, skill: '', level: 'Intermediate' }
    ],
    certifications: [
      { id: 1, name: '', issuer: '', date: '' }
    ]
  });

  const updatePersonal = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const handlePhotoUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCvData(prev => ({
          ...prev,
          personal: { 
            ...prev.personal, 
            photo: file,
            photoUrl: e.target.result 
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setCvData(prev => ({
      ...prev,
      personal: { 
        ...prev.personal, 
        photo: null,
        photoUrl: '' 
      }
    }));
  };

  const updateExperience = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    const newId = Math.max(...cvData.experience.map(e => e.id)) + 1;
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: newId,
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  const removeExperience = (id) => {
    if (cvData.experience.length > 1) {
      setCvData(prev => ({
        ...prev,
        experience: prev.experience.filter(exp => exp.id !== id)
      }));
    }
  };

  const updateEducation = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    const newId = Math.max(...cvData.education.map(e => e.id)) + 1;
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: newId,
        degree: '',
        school: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }]
    }));
  };

  const removeEducation = (id) => {
    if (cvData.education.length > 1) {
      setCvData(prev => ({
        ...prev,
        education: prev.education.filter(edu => edu.id !== id)
      }));
    }
  };

  const updateSkills = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const addSkill = () => {
    const newId = Math.max(...cvData.skills.map(s => s.id)) + 1;
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: newId, skill: '', level: 'Intermediate' }]
    }));
  };

  const removeSkill = (id) => {
    if (cvData.skills.length > 1) {
      setCvData(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill.id !== id)
      }));
    }
  };

  const updateCertification = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const addCertification = () => {
    const newId = Math.max(...cvData.certifications.map(c => c.id)) + 1;
    setCvData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { id: newId, name: '', issuer: '', date: '' }]
    }));
  };

  const removeCertification = (id) => {
    if (cvData.certifications.length > 1) {
      setCvData(prev => ({
        ...prev,
        certifications: prev.certifications.filter(cert => cert.id !== id)
      }));
    }
  };

  return {
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
  };
};