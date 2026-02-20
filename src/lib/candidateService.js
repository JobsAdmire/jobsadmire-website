// services/candidateService.js - Fixed Image Storage
import { useState, useEffect } from 'react';

class CandidateService {
  constructor() {
    this.storageKey = 'job_platform_candidates';
    this.listeners = [];
  }

  // Convert image file to base64 string for storage
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  
  // Get all candidates from localStorage
  getAllCandidates() {
    try {
      if (typeof window === 'undefined') return []; // SSR check
      const candidates = localStorage.getItem(this.storageKey);
      return candidates ? JSON.parse(candidates) : [];
    } catch (error) {
      console.error('Error loading candidates:', error);
      return [];
    }
  }

  // Get candidates by category
  getCandidatesByCategory(category) {
    const allCandidates = this.getAllCandidates();
    return allCandidates.filter(candidate => candidate.category === category);
  }

  // Get single candidate by ID
  getCandidateById(id) {
    const allCandidates = this.getAllCandidates();
    return allCandidates.find(candidate => candidate.id == id); // Use == for string/number comparison
  }

  // Save new candidate with proper image handling
  async saveCandidate(candidateData) {
    try {
      if (typeof window === 'undefined') throw new Error('localStorage not available');
      
      const candidates = this.getAllCandidates();
      
      // Handle profile image - convert to base64 if it's a blob URL
      let profileImageData = candidateData.profileImage;
      
      if (candidateData.profileImage && candidateData.profileImage.startsWith('blob:')) {
        try {
          // If it's a blob URL, we need to get the original file and convert to base64
          // This should be handled in the form submission instead
          console.warn('Blob URL detected, using fallback image');
          profileImageData = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
        } catch (error) {
          console.error('Error handling image:', error);
          profileImageData = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
        }
      }
      
      // Add timestamp and ID if not exists
      const newCandidate = {
        ...candidateData,
        profileImage: profileImageData,
        id: candidateData.id || Date.now(),
        createdAt: candidateData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      candidates.push(newCandidate);
      localStorage.setItem(this.storageKey, JSON.stringify(candidates));
      
      // Notify listeners
      this.notifyListeners();
      
      return newCandidate;
    } catch (error) {
      console.error('Error saving candidate:', error);
      throw new Error('Failed to save candidate profile');
    }
  }

  // Save candidate with base64 image (updated method)
  async saveCandidateWithImage(candidateData, imageFile = null) {
    try {
      if (typeof window === 'undefined') throw new Error('localStorage not available');
      
      const candidates = this.getAllCandidates();
      
      // Handle image conversion to base64
      let profileImageData = candidateData.profileImage;
      
      if (imageFile) {
        try {
          profileImageData = await this.fileToBase64(imageFile);
        } catch (error) {
          console.error('Error converting image to base64:', error);
          profileImageData = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
        }
      } else if (!profileImageData || profileImageData.startsWith('blob:')) {
        profileImageData = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
      }
      
      // Add timestamp and ID if not exists
      const newCandidate = {
        ...candidateData,
        profileImage: profileImageData,
        id: candidateData.id || Date.now(),
        createdAt: candidateData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      candidates.push(newCandidate);
      localStorage.setItem(this.storageKey, JSON.stringify(candidates));
      
      // Notify listeners
      this.notifyListeners();
      
      return newCandidate;
    } catch (error) {
      console.error('Error saving candidate:', error);
      throw new Error('Failed to save candidate profile');
    }
  }

  // Update existing candidate
  updateCandidate(id, updates) {
    try {
      if (typeof window === 'undefined') throw new Error('localStorage not available');
      
      const candidates = this.getAllCandidates();
      const index = candidates.findIndex(candidate => candidate.id == id);
      
      if (index === -1) {
        throw new Error('Candidate not found');
      }

      candidates[index] = {
        ...candidates[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(candidates));
      this.notifyListeners();
      
      return candidates[index];
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw new Error('Failed to update candidate profile');
    }
  }

  // Delete candidate
  deleteCandidate(id) {
    try {
      if (typeof window === 'undefined') throw new Error('localStorage not available');
      
      const candidates = this.getAllCandidates();
      const filteredCandidates = candidates.filter(candidate => candidate.id != id);
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredCandidates));
      this.notifyListeners();
      
      return true;
    } catch (error) {
      console.error('Error deleting candidate:', error);
      throw new Error('Failed to delete candidate profile');
    }
  }

  // Get category statistics
  getCategoryStats() {
    const candidates = this.getAllCandidates();
    const stats = {
      'software-development': 0,
      'design': 0,
      'data-science': 0,
      'marketing': 0,
      'customer-support': 0,
      'business': 0
    };
    
    candidates.forEach(candidate => {
      if (stats.hasOwnProperty(candidate.category)) {
        stats[candidate.category]++;
      } else {
        stats[candidate.category] = 1;
      }
    });
    
    return stats;
  }

  // Search candidates
  searchCandidates(query) {
    const candidates = this.getAllCandidates();
    const searchTerm = query.toLowerCase();
    
    return candidates.filter(candidate => 
      candidate.fullName.toLowerCase().includes(searchTerm) ||
      candidate.profession.toLowerCase().includes(searchTerm) ||
      candidate.location.toLowerCase().includes(searchTerm) ||
      (candidate.skills && candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm))) ||
      (candidate.expertise && candidate.expertise.some(exp => exp.toLowerCase().includes(searchTerm)))
    );
  }

  // Auto-categorize based on profession
  categorizeByProfession(profession) {
    const professionLower = profession.toLowerCase();
    
    // Software Development
    if (professionLower.includes('developer') || 
        professionLower.includes('engineer') || 
        professionLower.includes('programmer') ||
        professionLower.includes('software') ||
        professionLower.includes('frontend') ||
        professionLower.includes('backend') ||
        professionLower.includes('fullstack') ||
        professionLower.includes('full stack') ||
        professionLower.includes('web dev') ||
        professionLower.includes('mobile dev') ||
        professionLower.includes('react') ||
        professionLower.includes('angular') ||
        professionLower.includes('vue') ||
        professionLower.includes('node') ||
        professionLower.includes('python') ||
        professionLower.includes('java') ||
        professionLower.includes('javascript')) {
      return 'software-development';
    }
    
    // Design
    if (professionLower.includes('design') || 
        professionLower.includes('ui') || 
        professionLower.includes('ux') ||
        professionLower.includes('graphic') ||
        professionLower.includes('visual') ||
        professionLower.includes('creative') ||
        professionLower.includes('figma') ||
        professionLower.includes('photoshop') ||
        professionLower.includes('illustrator')) {
      return 'design';
    }
    
    // Data Science
    if (professionLower.includes('data') || 
        professionLower.includes('analyst') || 
        professionLower.includes('scientist') ||
        professionLower.includes('analytics') ||
        professionLower.includes('machine learning') ||
        professionLower.includes('ml') ||
        professionLower.includes('ai') ||
        professionLower.includes('artificial intelligence') ||
        professionLower.includes('statistics') ||
        professionLower.includes('business intelligence') ||
        professionLower.includes('bi')) {
      return 'data-science';
    }
    
    // Marketing
    if (professionLower.includes('marketing') || 
        professionLower.includes('seo') || 
        professionLower.includes('content') ||
        professionLower.includes('social media') ||
        professionLower.includes('digital marketing') ||
        professionLower.includes('brand') ||
        professionLower.includes('advertising') ||
        professionLower.includes('campaign') ||
        professionLower.includes('growth') ||
        professionLower.includes('copywriter') ||
        professionLower.includes('content creator')) {
      return 'marketing';
    }
    
    // Customer Support
    if (professionLower.includes('support') || 
        professionLower.includes('customer') || 
        professionLower.includes('service') ||
        professionLower.includes('help desk') ||
        professionLower.includes('technical support') ||
        professionLower.includes('account manager') ||
        professionLower.includes('client success') ||
        professionLower.includes('customer success')) {
      return 'customer-support';
    }
    
    // Default to business
    return 'business';
  }

  // Add listener for data changes
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners of data changes
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in listener callback:', error);
      }
    });
  }

  // Clear all data (for testing/reset)
  clearAllData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
      this.notifyListeners();
    }
  }

  // Export data (for backup)
  exportData() {
    const candidates = this.getAllCandidates();
    return JSON.stringify(candidates, null, 2);
  }

  // Import data (for restore)
  importData(jsonData) {
    try {
      if (typeof window === 'undefined') return false;
      
      const candidates = JSON.parse(jsonData);
      if (!Array.isArray(candidates)) {
        throw new Error('Invalid data format');
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(candidates));
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Get recent candidates (last 30 days)
  getRecentCandidates(days = 30) {
    const candidates = this.getAllCandidates();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return candidates.filter(candidate => {
      const createdDate = new Date(candidate.createdAt);
      return createdDate >= cutoffDate;
    });
  }

  // Get top skills across all candidates
  getTopSkills(limit = 10) {
    const candidates = this.getAllCandidates();
    const skillCount = {};
    
    candidates.forEach(candidate => {
      if (candidate.skills) {
        candidate.skills.forEach(skill => {
          skillCount[skill] = (skillCount[skill] || 0) + 1;
        });
      }
    });
    
    return Object.entries(skillCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([skill, count]) => ({ skill, count }));
  }

  // Filter candidates by multiple criteria
  filterCandidates(filters) {
    let candidates = this.getAllCandidates();
    
    if (filters.category) {
      candidates = candidates.filter(c => c.category === filters.category);
    }
    
    if (filters.location) {
      candidates = candidates.filter(c => 
        c.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.minExperience) {
      candidates = candidates.filter(c => c.yearsOfExperience >= filters.minExperience);
    }
    
    if (filters.maxExperience) {
      candidates = candidates.filter(c => c.yearsOfExperience <= filters.maxExperience);
    }
    
    if (filters.skills && filters.skills.length > 0) {
      candidates = candidates.filter(c => 
        c.skills && filters.skills.some(skill => 
          c.skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }
    
    return candidates;
  }
}

// Create singleton instance
const candidateService = new CandidateService();

// React Hook for using candidates in components
export const useCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load initial data
    const loadCandidates = () => {
      try {
        const data = candidateService.getAllCandidates();
        setCandidates(data);
      } catch (error) {
        console.error('Error loading candidates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCandidates();
    
    // Listen for changes
    const updateCandidates = () => {
      const data = candidateService.getAllCandidates();
      setCandidates(data);
    };
    
    candidateService.addListener(updateCandidates);
    
    return () => {
      candidateService.removeListener(updateCandidates);
    };
  }, []);
  
  return { candidates, loading };
};

// React Hook for category statistics
export const useCategoryStats = () => {
  const [stats, setStats] = useState({});
  
  useEffect(() => {
    const updateStats = () => {
      const categoryStats = candidateService.getCategoryStats();
      setStats(categoryStats);
    };
    
    updateStats();
    candidateService.addListener(updateStats);
    
    return () => {
      candidateService.removeListener(updateStats);
    };
  }, []);
  
  return stats;
};

export default candidateService;