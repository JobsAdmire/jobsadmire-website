import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";

const JobBlogPage = () => {
  const { t } = useTranslation("common");
  // State management with improved organization
  const [activeCategory, setActiveCategory] = useState(t("labels.blogCards.categories.careerAdvice"));
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [isSticky, setIsSticky] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Categories for filtering
  const categories = [
    t("labels.blogCards.categories.careerAdvice"),
    t("labels.blogCards.categories.jobInterviews"),
    t("labels.blogCards.categories.resumeTips"),
    t("labels.blogCards.categories.remoteWork"),
    t("labels.blogCards.categories.industryInsights")
  ];

  // Memoized scroll handler for better performance
  const handleScroll = useCallback(() => {
    setIsSticky(window.scrollY > 100);
    // Show newsletter popup after scrolling 70% of the page
    if (window.scrollY > (document.body.scrollHeight * 0.7) && !isSubscribed && !localStorage.getItem('newsletterDismissed')) {
      setShowNewsletter(true);
    }
  }, [isSubscribed]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    
    // Check for dark mode preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(localStorage.getItem('darkMode') === 'true' || prefersDarkMode);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setVisiblePosts(6); // Reset visible posts when changing category
  };

  const handleRedirect = (link) => {
    window.location.href = link;
  };

  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + 3);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // In a real app, you would send this to your backend
      console.log("Subscribed email:", email);
      setIsSubscribed(true);
      setShowNewsletter(false);
      localStorage.setItem('subscribed', 'true');
      // Clear the input
      setEmail("");
      // Show success toast instead of alert
      showToast(t("labels.blogCards.subscribeSuccess"));
    } else {
      showToast(t("labels.blogCards.enterValidEmail"), "error");
    }
  };

  const handleCloseNewsletter = () => {
    setShowNewsletter(false);
    localStorage.setItem('newsletterDismissed', 'true');
  };

  const showToast = (message, type = "success") => {
    // Toast notification implementation would go here
    console.log(`Toast: ${message} (${type})`);
    // In a real implementation, you would show a toast notification
  };

  // Sample blog posts data with enhanced metadata
  const posts = [
    {
      title: "How to Stand Out in Today's Competitive Job Market",
      description:
        "Discover proven strategies that will help you differentiate yourself from other candidates and catch recruiters' attention in an increasingly digital hiring landscape.",
      category: "Career Advice",
      link: "/blog_detail/blog1",
      image: "/images/competitive-job-market.jpg",
      author: "Sarah Johnson",
      authorImage: "/images/sarah-johnson.jpg",
      date: "Mar 18, 2025",
      readTime: "6 min read",
      featured: true,
      tags: ["Personal Branding", "Job Search", "LinkedIn"],
      likes: 328
    },
    {
      title: "The Future of Work: Skills That Will Matter in 2026",
      description:
        "As automation and AI transform industries, certain skills are becoming increasingly valuable. Learn which abilities will give you a competitive edge in tomorrow's workplace.",
      category: "Career Advice",
      link: "/blog/future-work-skills",
      image: "/images/future-skills.jpg",
      author: "David Chen",
      authorImage: "/images/david-chen.jpg",
      date: "Mar 15, 2025",
      readTime: "7 min read",
      tags: ["Future Skills", "AI", "Career Development"],
      likes: 274
    },
    {
      title: "From Rejection to Job Offer: Bouncing Back in Your Career Search",
      description:
        "Rejection is part of every job search. This article provides actionable techniques to maintain resilience and ultimately land the position you want.",
      category: "Career Advice",
      link: "/blog/rejection-to-job-offer",
      image: "/images/career-resilience.jpg",
      author: "Maya Patterson",
      authorImage: "/images/maya-patterson.jpg",
      date: "Mar 10, 2025",
      readTime: "5 min read",
      tags: ["Resilience", "Job Search", "Mindset"],
      likes: 206
    },
    {
      title: "Mastering Behavioral Interview Questions: STAR Method Explained",
      description:
        "Learn how to structure compelling responses to behavioral questions using the Situation, Task, Action, Result framework with real-world examples.",
      category: "Job Interviews",
      link: "/blog/mastering-star-method",
      image: "/images/star-method.jpg",
      author: "James Wilson",
      authorImage: "/images/james-wilson.jpg",
      date: "Mar 05, 2025",
      readTime: "8 min read",
      featured: true,
      tags: ["Interview Techniques", "STAR Method", "Communication"],
      likes: 412
    },
    {
      title: "How to Research a Company Before Your Interview",
      description:
        "Thorough company research demonstrates your interest and helps you tailor your responses. This comprehensive guide shows exactly what to look for and where to find it.",
      category: "Job Interviews",
      link: "/blog/company-research-interview",
      image: "/images/company-research.jpg",
      author: "Emma Rodriguez",
      authorImage: "/images/emma-rodriguez.jpg",
      date: "Feb 28, 2025",
      readTime: "6 min read",
      tags: ["Interview Prep", "Company Research", "Due Diligence"],
      likes: 257
    },
    {
      title: "10 Questions You Should Always Ask in an Interview",
      description:
        "Asking thoughtful questions not only helps you evaluate if the role is right for you, but also impresses interviewers. Here are the questions that make a lasting impression.",
      category: "Job Interviews",
      link: "/blog/questions-to-ask-interviewer",
      image: "/images/interview-questions.jpg",
      author: "Alex Thompson",
      authorImage: "/images/alex-thompson.jpg",
      date: "Feb 25, 2025",
      readTime: "5 min read",
      tags: ["Interview Questions", "Career Growth", "Company Culture"],
      likes: 321
    },
    {
      title: "ATS-Friendly Resume: Getting Past the Digital Gatekeeper",
      description:
        "Most companies use Applicant Tracking Systems to filter resumes before a human ever sees them. Learn how to optimize your resume to beat these algorithms.",
      category: "Resume Tips",
      link: "/blog/ats-friendly-resume",
      image: "/images/ats-resume.jpg",
      author: "Olivia Grant",
      authorImage: "/images/olivia-grant.jpg",
      date: "Feb 20, 2025",
      readTime: "7 min read",
      featured: true,
      tags: ["ATS", "Resume Optimization", "Keywords"],
      likes: 384
    },
    {
      title: "Building a Remote Work Routine That Maximizes Productivity",
      description:
        "Remote work offers flexibility but requires intentional structure. Discover how to create daily routines that boost focus, productivity, and work-life balance.",
      category: "Remote Work",
      link: "/blog/remote-work-productivity",
      image: "/images/remote-productivity.jpg",
      author: "Ryan Mitchell",
      authorImage: "/images/ryan-mitchell.jpg",
      date: "Feb 15, 2025",
      readTime: "6 min read",
      featured: true,
      tags: ["Remote Work", "Productivity", "Work-Life Balance"],
      likes: 297
    },
    {
      title: "The Rise of AI in Recruitment: What Job Seekers Need to Know",
      description:
        "Artificial intelligence is transforming how companies hire. Learn how these tools evaluate candidates and the strategies you need to navigate AI-powered recruitment processes.",
      category: "Industry Insights",
      link: "/blog/ai-in-recruitment",
      image: "/images/ai-recruitment.jpg",
      author: "Priya Sharma",
      authorImage: "/images/priya-sharma.jpg",
      date: "Feb 10, 2025",
      readTime: "9 min read",
      featured: true,
      tags: ["AI", "Recruitment Technology", "Future of Hiring"],
      likes: 342
    },
  ];

  // Filter posts by category and search term with improved filtering logic
  const filteredPosts = posts.filter(
    (post) => {
      const matchesCategory = post.category === activeCategory;
      
      if (!searchTerm) return matchesCategory;
      
      const searchTermLower = searchTerm.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(searchTermLower);
      const descriptionMatch = post.description.toLowerCase().includes(searchTermLower);
      const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(searchTermLower));
      const authorMatch = post.author.toLowerCase().includes(searchTermLower);
      
      return matchesCategory && (titleMatch || descriptionMatch || tagMatch || authorMatch);
    }
  );

  // Get featured post for the current category
  const featuredPost = filteredPosts.find((post) => post.featured) || filteredPosts[0];
  
  // Get remaining posts (excluding featured)
  const regularPosts = featuredPost 
    ? filteredPosts.filter((post) => post !== featuredPost).slice(0, visiblePosts)
    : filteredPosts.slice(0, visiblePosts);
  
  // Check if we have more posts to load
  const hasMorePosts = regularPosts.length < (filteredPosts.length - (featuredPost ? 1 : 0));

  // Generate trending tags for job seekers
  const trendingTags = ["Remote Jobs", "Tech Skills", "Salary Negotiation", "Career Change", "Work-Life Balance", "LinkedIn"];

  // Animation variants for motion components
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Root theme class based on dark mode
  const themeClass = darkMode ? "dark" : "";

  return (
    <div className={themeClass}>
      <section className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
        {/* Navigation Bar */}
       

        {/* Hero Banner with improved visuals and responsive design */}
        <div className="relative w-full min-h-screen pt-16 bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 overflow-hidden md:min-h-[650px] lg:min-h-[700px]">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          
          {/* Floating Objects (Decorative) with improved animation */}
          <div className="absolute w-24 h-24 bg-white rounded-full top-20 left-10 animate-pulse opacity-10"></div>
          <div className="absolute bg-white rounded-full bottom-40 right-20 w-36 h-36 animate-pulse opacity-10" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute w-20 h-20 bg-white rounded-full top-40 right-40 animate-pulse opacity-10" style={{ animationDelay: '1s' }}></div>
          
          {/* Abstract shapes with better positioning for responsive design */}
          <div className="absolute bottom-0 right-0 transform translate-x-1/2 rounded-full w-96 h-96 bg-sky-300 opacity-20 translate-y-1/4"></div>
          <div className="absolute top-0 transform bg-blue-300 rounded-full left-20 w-72 h-72 opacity-20 -translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="container relative flex flex-col items-center justify-center h-full px-6 py-20 mx-auto text-white max-w-7xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="px-4 py-1 mb-6 text-sm font-medium tracking-wider uppercase rounded-full bg-white/20 backdrop-blur-sm"
            >
              Job Insights & Career Tips
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-4xl mb-6 text-4xl font-bold leading-tight text-center md:text-5xl lg:text-6xl"
            >
              Navigate Your <span className="text-sky-100">Career Journey</span> With Expert Guidance
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mb-10 text-xl text-center text-white text-opacity-90"
            >
              Discover insights, strategies, and advice to help you excel in your professional life
            </motion.p>
            
            {/* Search Bar with improved design and animation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative w-full max-w-xl"
            >
              <input
                type="text"
                placeholder={t("labels.blogCards.searchPlaceholder")}
                className={`w-full px-6 py-4 text-gray-700 rounded-full shadow-xl transition-all duration-300 placeholder:text-gray-500 focus:ring-sky-300 focus:outline-none ${
                  isSearchFocused ? 'ring-4 ring-sky-300' : ''
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <button 
                className="absolute transition-transform right-4 top-4 text-sky-500 hover:scale-110"
                aria-label={t("labels.blogCards.searchAriaLabel")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </motion.div>
            
            {/* Trending Tags with improved visual appearance and animation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2 mt-8"
            >
              <span className="mr-2 text-sm font-medium text-white">Trending:</span>
              {trendingTags.map((tag, index) => (
                <button 
                  key={index}
                  onClick={() => setSearchTerm(tag)}
                  className="px-3 py-1 text-xs transition-all bg-white rounded-full bg-opacity-20 hover:bg-opacity-30 hover:scale-105 backdrop-blur-sm"
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          </div>
          
          {/* Hero Bottom Curve with improved responsive design */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
              <path fill={darkMode ? "#111827" : "#EFF6FF"} fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
            </svg>
          </div>
        </div>
        
        {/* Sticky Category Navigation with Glass Effect */}
        <div className={`sticky top-16 z-40 transition-all duration-300 py-2 backdrop-blur-md ${darkMode ? 'bg-gray-800/80 shadow-md' : 'bg-white/80 shadow-md'}`}>
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="flex justify-start gap-3 py-2 overflow-x-auto hide-scrollbar md:justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm md:text-base ${
                    activeCategory === category
                      ? "bg-sky-500 text-white shadow-lg transform scale-105"
                      : `hover:bg-sky-50 border ${darkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-200'}`
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Job Market Stats Section with improved responsive grid */}
        <div className="container px-4 py-8 mx-auto md:py-12 max-w-7xl">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`p-6 transition-all rounded-xl hover:shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-sky-100 shadow-md'}`}
            >
              <div className="mb-2 text-3xl font-bold text-sky-500">250K+</div>
              <div className={darkMode ? "text-gray-300" : "text-gray-600"}>Jobs Posted</div>
            </motion.div>
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`p-6 transition-all rounded-xl hover:shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-sky-100 shadow-md'}`}
            >
              <div className="mb-2 text-3xl font-bold text-sky-500">12K+</div>
              <div className={darkMode ? "text-gray-300" : "text-gray-600"}>Companies</div>
            </motion.div>
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`p-6 transition-all rounded-xl hover:shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-sky-100 shadow-md'}`}
            >
              <div className="mb-2 text-3xl font-bold text-sky-500">85%</div>
              <div className={darkMode ? "text-gray-300" : "text-gray-600"}>Success Rate</div>
            </motion.div>
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={`p-6 transition-all rounded-xl hover:shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-sky-100 shadow-md'}`}
            >
              <div className="mb-2 text-3xl font-bold text-sky-500">40+</div>
              <div className={darkMode ? "text-gray-300" : "text-gray-600"}>Industries</div>
            </motion.div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="container px-4 py-8 mx-auto md:py-10 max-w-7xl">
          {/* Featured Post with enhanced design and animations */}
          {featuredPost && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-16"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="relative">
                  <span className="inline-block w-1 h-12 rounded-full bg-sky-500"></span>
                  <span className="absolute top-0 left-0 inline-block w-1 h-6 bg-blue-400 rounded-full"></span>
                </div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Featured <span className="text-sky-500">Article</span>
                </h2>
              </div>
              <div className={`overflow-hidden transition-transform transform rounded-2xl hover:shadow-2xl ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border shadow-xl border-sky-100'
              }`}>
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="relative h-full min-h-[300px] md:min-h-[400px]">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="absolute inset-0 object-cover w-full h-full"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 md:hidden"></div>
                      
                      {/* Mobile title overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:hidden">
                        <span className="inline-block px-3 py-1 mb-3 text-sm font-medium text-white rounded-full bg-sky-500">
                          {featuredPost.category}
                        </span>
                        <h3 className="mb-2 text-2xl font-bold text-white">
                          {featuredPost.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between p-6 md:w-1/2 md:p-8 lg:p-10">
                    <div>
                      <div className="items-center hidden gap-3 mb-4 md:flex">
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-sky-100 text-sky-500 dark:bg-sky-900 dark:text-sky-300">
                          {featuredPost.category}
                        </span>
                        <span className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {featuredPost.readTime}
                        </span>
                      </div>
                      <h3 className={`hidden mb-4 text-2xl font-bold md:block md:text-3xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {featuredPost.title}
                      </h3>
                      <p className={`mb-6 md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {featuredPost.description}
                      </p>
                      
                      {/* Tags with improved styling */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {featuredPost.tags && featuredPost.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className={`px-3 py-1 text-xs rounded-full ${
                              darkMode ? 'bg-gray-700 text-sky-300' : 'bg-sky-50 text-sky-600'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={featuredPost.authorImage}
                          alt={featuredPost.author}
                          className="object-cover w-10 h-10 border-2 border-white rounded-full shadow-sm"
                        />
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {featuredPost.author}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {featuredPost.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <svg className="w-5 h-5 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span>{featuredPost.likes}</span>
                        </div>
                        <button
                          onClick={() => handleRedirect(featuredPost.link)}
                          className="inline-flex items-center gap-2 px-5 py-3 text-white transition-all rounded-lg shadow-md bg-sky-500 hover:bg-sky-600 hover:scale-105"
                        >
                          Read Article
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Regular Posts with enhanced card design and animations */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="relative">
                <span className="inline-block w-1 h-12 rounded-full bg-sky-500"></span>
                <span className="absolute top-0 left-0 inline-block w-1 h-6 bg-blue-400 rounded-full"></span>
              </div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Latest <span className="text-sky-500">Articles</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {regularPosts.map((post, index) => (
                <motion.div
                  key={post.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`overflow-hidden transition-all duration-300 rounded-xl hover:shadow-xl hover:translate-y-[-5px] ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white shadow-lg border border-sky-100'
                  }`}
                >
                  <div className="relative">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 text-xs font-medium text-white rounded-full bg-sky-500">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute flex items-center justify-between bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.authorImage}
                          alt={post.author}
                          className="object-cover w-8 h-8 border border-white rounded-full"
                        />
                        <span className="text-sm font-medium text-white">{post.author}</span>
                      </div>
                      <span className="px-2 py-1 text-xs text-white bg-black bg-opacity-50 rounded-full">
                        {post.date}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {post.readTime}
                      </span>
                      <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                      <span className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {post.likes}
                      </span>
                    </div>
                    <h3 className={`mb-3 text-xl font-bold transition-colors line-clamp-2 hover:text-sky-500 ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {post.title}
                    </h3>
                    <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {post.description}
                    </p>
                    
                    {/* Tags with improved styling */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags && post.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className={`px-2 py-1 text-xs rounded-full ${
                            darkMode ? 'bg-gray-700 text-sky-300' : 'bg-sky-50 text-sky-600'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <button
                        onClick={() => handleRedirect(post.link)}
                        className={`inline-flex items-center justify-center w-full gap-2 px-4 py-3 font-medium transition-colors rounded-lg ${
                          darkMode
                            ? 'bg-gray-700 text-white hover:bg-sky-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-sky-500 hover:text-white'
                        }`}
                      >
                        Read Article
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State with improved styling */}
            {regularPosts.length === 0 && searchTerm && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`py-16 text-center rounded-xl ${
                  darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-md'
                }`}
              >
                <div className={`flex items-center justify-center w-24 h-24 mx-auto rounded-full ${
                  darkMode ? 'bg-gray-700' : 'bg-sky-100'
                }`}>
                  <svg className={`w-12 h-12 ${darkMode ? 'text-sky-300' : 'text-sky-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className={`mt-6 text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  No results found
                </h3>
                <p className={`max-w-md mx-auto mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  We couldn't find any articles matching "{searchTerm}". Try using different keywords or browse categories.
                </p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-3 mt-6 text-white transition-colors rounded-lg bg-sky-500 hover:bg-sky-600"
                >
                  Clear Search
                </button>
              </motion.div>
            )}

            {/* Load More Button with improved styling and animation */}
            {hasMorePosts && regularPosts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 text-center md:mt-16"
              >
                <button
                  className={`inline-flex items-center gap-2 px-8 py-3 font-medium transition-all duration-300 rounded-full shadow-md md:px-10 md:py-4 hover:shadow-lg ${
                    darkMode
                      ? 'bg-gray-800 border-2 border-sky-500 text-sky-400 hover:bg-gray-700'
                      : 'bg-white border-2 border-sky-500 text-sky-500 hover:bg-sky-50'
                  }`}
                  onClick={handleLoadMore}
                >
                  Load More Articles
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13L12 20L5 13M19 4L12 11L5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Newsletter Subscription Section with improved responsive design */}
        <div className="container px-6 py-12 mx-auto md:py-16 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 shadow-xl rounded-3xl md:p-12 bg-gradient-to-r from-sky-400 to-blue-500"
          >
            <div className="items-center justify-between md:flex">
              <div className="mb-8 md:w-7/12 md:mb-0">
                <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">Stay ahead in your career journey</h3>
                <p className="mb-6 text-white text-opacity-90 md:pr-12">
                  Get the latest job market insights, interview tips, and career advice delivered directly to your inbox every week.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    <img src="/images/subscriber1.jpg" alt={t("labels.blogCards.subscriberAlt")} className="w-8 h-8 border-2 border-white rounded-full" />
                    <img src="/images/subscriber2.jpg" alt={t("labels.blogCards.subscriberAlt")} className="w-8 h-8 border-2 border-white rounded-full" />
                    <img src="/images/subscriber3.jpg" alt={t("labels.blogCards.subscriberAlt")} className="w-8 h-8 border-2 border-white rounded-full" />
                  </div>
                  <p className="text-sm text-white">Join over <span className="font-bold">15,000</span> professionals</p>
                </div>
              </div>
              <div className="md:w-5/12">
                <form className="p-4 bg-white shadow-inner rounded-xl dark:bg-gray-800">
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      type="email"
                      placeholder={t("labels.blogCards.enterYourEmail")}
                      className={`flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border border-gray-200 text-gray-700'
                      }`}
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 font-medium text-white transition-colors rounded-lg bg-sky-500 hover:bg-sky-600 whitespace-nowrap"
                    >
                      Subscribe
                    </button>
                  </div>
                  <p className={`mt-3 text-xs text-center md:text-left ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    By subscribing, you agree to our Privacy Policy. No spam, unsubscribe anytime.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Resources Section with improved animations and responsive design */}
        <div className="container px-4 py-12 mx-auto md:py-16 max-w-7xl">
          <div className="flex items-center gap-2 mb-8 md:mb-10">
            <div className="relative">
              <span className="inline-block w-1 h-12 rounded-full bg-sky-500"></span>
              <span className="absolute top-0 left-0 inline-block w-1 h-6 bg-blue-400 rounded-full"></span>
            </div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Career <span className="text-sky-500">Resources</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Resource Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col p-6 transition-all rounded-xl hover:shadow-lg ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border shadow-md border-sky-100'
              }`}
            >
              <div className={`flex items-center justify-center w-16 h-16 p-4 mb-4 rounded-xl ${
                darkMode ? 'bg-gray-700' : 'bg-sky-100'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className={`mb-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Resume Templates
              </h3>
              <p className={`flex-grow mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Access professionally designed resume templates that increase your chances of getting an interview.
              </p>
              <button className="inline-flex items-center font-medium text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300">
                Download Templates
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </motion.div>

            {/* Resource Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`flex flex-col p-6 transition-all rounded-xl hover:shadow-lg ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border shadow-md border-sky-100'
              }`}
            >
              <div className={`flex items-center justify-center w-16 h-16 p-4 mb-4 rounded-xl ${
                darkMode ? 'bg-gray-700' : 'bg-sky-100'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className={`mb-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Interview Prep Videos
              </h3>
              <p className={`flex-grow mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Watch our expert-led videos covering common interview questions and effective response strategies.
              </p>
              <button className="inline-flex items-center font-medium text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300">
                Watch Videos
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </motion.div>

            {/* Resource Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`flex flex-col p-6 transition-all rounded-xl hover:shadow-lg ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border shadow-md border-sky-100'
              }`}
            >
              <div className={`flex items-center justify-center w-16 h-16 p-4 mb-4 rounded-xl ${
                darkMode ? 'bg-gray-700' : 'bg-sky-100'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className={`mb-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Salary Calculator
              </h3>
              <p className={`flex-grow mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Research competitive salary ranges for your role, experience level, and location to negotiate better offers.
              </p>
              <button className="inline-flex items-center font-medium text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300">
                Calculate Salary
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        {/* CTA Section with improved design and animations */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-16 mt-8 bg-gradient-to-r from-sky-500 to-blue-600 md:py-20 md:mt-12"
        >
          <div className="container max-w-5xl px-4 mx-auto text-center text-white">
            <span className="inline-block px-4 py-1 mb-6 text-sm tracking-wider uppercase bg-white rounded-full bg-opacity-20">
              Accelerate Your Career
            </span>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to Find Your Dream Job?
            </h2>
            <p className="max-w-3xl mx-auto mb-10 text-lg opacity-90">
              Join thousands of job seekers who have successfully navigated the job market
              with our expert advice, tools, and resources.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 font-bold transition-all duration-300 bg-white rounded-full shadow-lg text-sky-600 hover:bg-sky-50 hover:shadow-xl"
              >
                Search Jobs
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-white transition-all duration-300 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-sky-600"
              >
                Upload Resume
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Popup with improved design and animations */}
        {showNewsletter && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleCloseNewsletter}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`relative w-full max-w-md p-8 rounded-2xl shadow-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseNewsletter}
                className={`absolute text-gray-500 top-4 right-4 ${
                  darkMode ? 'hover:text-gray-300' : 'hover:text-gray-700'
                }`}
                aria-label={t("labels.blogCards.newsletterCloseAria")}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="text-center">
                <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${
                  darkMode ? 'bg-gray-700' : 'bg-sky-100'
                }`}>
                  <svg className={`w-8 h-8 ${darkMode ? 'text-sky-400' : 'text-sky-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className={`mb-4 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Get Job Alerts & Career Tips
                </h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Subscribe to our newsletter for personalized job recommendations,
                  career advice, and exclusive resources to help you stand out.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <input
                    type="email"
                    required
                    placeholder={t("labels.blogCards.enterYourEmail")}
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                        : 'border border-gray-300 text-gray-700'
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full px-6 py-3 font-medium text-white transition-colors rounded-lg bg-sky-500 hover:bg-sky-600"
                  >
                    Subscribe Now
                  </motion.button>
                </form>
                <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Toast Notifications Container */}
        <div className="fixed bottom-0 right-0 z-50 flex flex-col items-end p-4 space-y-3 pointer-events-none">
          {/* Toast messages would be dynamically rendered here */}
        </div>

        {/* Footer with improved design and dark mode support */}
       
        
        {/* Back to top button */}
        {isSticky && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed z-50 p-3 text-white transition-all duration-300 rounded-full shadow-lg bottom-6 right-6 bg-sky-500 hover:bg-sky-600 hover:scale-110"
            aria-label={t("labels.blogCards.backToTopAria")}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </section>
    </div>
  );
};

export default JobBlogPage;