import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Users, Building, Clock, Award, Briefcase, TrendingUp, ChevronRight, Check, PieChart, BarChart4, Target } from 'lucide-react';
import { useCms } from '@/lib/context/CmsContext';
import { useCmsContent } from '@/lib/context/CmsContentContext';

// Intersection Observer Hook for animations
const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isVisible];
};

const StatCard = ({ icon, number, label, delay, accent, percentage, subtitle }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  
  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 2000; // ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const target = parseInt(number);
    
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Easing function for more natural counting
      const easeOutQuad = progress * (2 - progress);
      setCount(Math.round(easeOutQuad * target));
      
      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [number, isVisible]);
  
  return (
    <div ref={ref} className="relative group" style={{ transform: isVisible ? 'translateY(0)' : 'translateY(20px)', opacity: isVisible ? 1 : 0, transition: `all 0.8s ease-out ${delay}ms` }}>
      {/* Background glow effect */}
      <div className={`absolute inset-0 ${accent} blur-2xl opacity-5 rounded-3xl group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      <div className="relative h-full overflow-hidden transition-all duration-500 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className={`${accent.replace('bg-', 'text-')} p-3 rounded-xl bg-opacity-10 ${accent}`}>
              {icon}
            </div>
            
            {percentage && (
              <div className="flex items-center px-3 py-1 text-xs font-medium text-green-600 rounded-full bg-green-50">
                <TrendingUp size={12} className="mr-1" />
                +{percentage}%
              </div>
            )}
          </div>
          
          <div className="mb-2">
            <div className="flex items-baseline">
              <h2 className="text-6xl font-bold text-gray-800">
                {count}
              </h2>
              <span className="ml-1 text-3xl font-bold text-sky-500">+</span>
            </div>
            {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
          </div>
          
          <p className="text-sm font-medium tracking-wider text-gray-600 uppercase">{label}</p>
        </div>
        
        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 h-1 ${accent} w-full opacity-80`}></div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, title, description }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  
  return (
    <div 
      ref={ref} 
      className="flex items-start p-4"
      style={{ 
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)', 
        opacity: isVisible ? 1 : 0, 
        transition: 'all 0.8s ease-out' 
      }}
    >
      <div className="p-2 mr-4 rounded-lg bg-sky-50 text-sky-600">
        {icon}
      </div>
      <div>
        <h3 className="mb-1 font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

const ICON_MAP = {
  Briefcase: <Briefcase size={28} />,
  Building: <Building size={28} />,
  Clock: <Clock size={28} />,
  Users: <Users size={28} />,
  Award: <Award size={28} />,
  TrendingUp: <TrendingUp size={28} />,
};

const AdvancedStatsSection = () => {
  const router = useRouter();
  const { stats: cmsStats } = useCms();
  const { c } = useCmsContent();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const buildStatsFromCms = () => {
    if (!cmsStats?.length) return null;
    return cmsStats.map((item, idx) => {
      const content = item.contents?.[0] || {};
      return {
        icon: ICON_MAP[item.icon] || <Briefcase size={28} />,
        number: item.value || "0",
        label: content.label || "",
        delay: idx * 200,
        accent: item.color || "bg-sky-500",
        percentage: item.percentage || null,
        subtitle: content.description || "",
      };
    });
  };

  const fallbackStats = [
    { icon: <Briefcase size={28} />, number: "150+", label: c("stats.jobFulfillment.label", "Job Fulfillment"), delay: 0, accent: "bg-sky-500", percentage: "32", subtitle: c("stats.jobFulfillment.subtitle", "") },
    { icon: <Building size={28} />, number: "2", label: c("stats.branches.label", "Branches"), delay: 200, accent: "bg-sky-500", percentage: "15", subtitle: c("stats.branches.subtitle", "") },
    { icon: <Clock size={28} />, number: "2", label: c("stats.yearsExperience.label", "Years Experience"), delay: 400, accent: "bg-sky-500", percentage: "100", subtitle: c("stats.yearsExperience.subtitle", "") },
    { icon: <Users size={28} />, number: "150+", label: c("stats.happyClients.label", "Happy Clients"), delay: 250, accent: "bg-sky-500", percentage: "24", subtitle: c("stats.happyClients.subtitle", "") },
  ];

  const stats = buildStatsFromCms() || fallbackStats;

  const features = [
    { icon: <Target size={20} />, title: c("features.targetedRecruitment.title", "Targeted Recruitment"), description: c("features.targetedRecruitment.description", "") },
    { icon: <BarChart4 size={20} />, title: c("features.performanceTracking.title", "Performance Tracking"), description: c("features.performanceTracking.description", "") },
    { icon: <Check size={20} />, title: c("features.qualityAssurance.title", "Quality Assurance"), description: c("features.qualityAssurance.description", "") },
  ];

  return (
    <div className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background elements */}
    
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
       
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-8  md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              icon={stat.icon}
              number={stat.number}
              label={stat.label}
              delay={stat.delay}
              accent={stat.accent}
              percentage={stat.percentage}
              subtitle={stat.subtitle}
              
            />
          ))}
        </div>
        
        {/* Middle section with chart */}
        
        
        {/* Call to Action Section */}
        
      </div>
    </div>
  );
};

export default AdvancedStatsSection;