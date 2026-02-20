import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Upload, Zap, Users, Target, Star, ArrowRight, CheckCircle, Briefcase, TrendingUp, Award, Globe, Clock, Mail, Phone, Sparkles, Rocket, Shield, Heart, Search, Filter, Bell, Menu, X } from 'lucide-react';

export default function ResumeSubmissionPage() {
  const { t } = useTranslation('common');
  const [isUploaded, setIsUploaded] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setIsUploaded(true);
      setCurrentStep(2);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploaded(true);
      setCurrentStep(2);
    }
  };

  const steps = [
    { number: 1, titleKey: "labels.submitResume.step1Title", descriptionKey: "labels.submitResume.step1Description" },
    { number: 2, titleKey: "labels.submitResume.step2Title", descriptionKey: "labels.submitResume.step2Description" },
    { number: 3, titleKey: "labels.submitResume.step3Title", descriptionKey: "labels.submitResume.step3Description" }
  ];

  const metrics = [
    { value: "2.5M+", labelKey: "labels.submitResume.metricActiveJobs", icon: Briefcase, bgColor: "bg-sky-100", textColor: "text-sky-600" },
    { value: "500K+", labelKey: "labels.submitResume.metricSuccessStories", icon: Users, bgColor: "bg-blue-100", textColor: "text-blue-600" },
    { value: "15K+", labelKey: "labels.submitResume.metricTopCompanies", icon: Globe, bgColor: "bg-indigo-100", textColor: "text-indigo-600" },
    { value: "98%", labelKey: "labels.submitResume.metricMatchAccuracy", icon: Target, bgColor: "bg-cyan-100", textColor: "text-cyan-600" }
  ];

  const features = [
    { icon: Zap, titleKey: "labels.submitResume.feature1Title", descriptionKey: "labels.submitResume.feature1Description", color: "from-sky-400 to-blue-500" },
    { icon: Search, titleKey: "labels.submitResume.feature2Title", descriptionKey: "labels.submitResume.feature2Description", color: "from-blue-400 to-indigo-500" },
    { icon: Bell, titleKey: "labels.submitResume.feature3Title", descriptionKey: "labels.submitResume.feature3Description", color: "from-indigo-400 to-purple-500" },
    { icon: Shield, titleKey: "labels.submitResume.feature4Title", descriptionKey: "labels.submitResume.feature4Description", color: "from-cyan-400 to-sky-500" }
  ];

  const testimonials = [
    {
      name: "Alexandra Thompson",
      role: "Product Manager",
      company: "Airbnb",
      avatar: "👩‍💼",
      quote: "JobsAdmire transformed my career search. Within a week, I had three interviews lined up with companies I'd only dreamed of working for.",
      rating: 5,
      increase: "+$40K salary"
    },
    {
      name: "David Chen",
      role: "Software Engineer",
      company: "Google",
      avatar: "👨‍💻",
      quote: "The AI matching was incredibly accurate. Every job recommendation was relevant to my skills and career aspirations.",
      rating: 5,
      increase: "+$60K salary"
    },
    {
      name: "Maria Rodriguez",
      role: "UX Designer",
      company: "Netflix",
      avatar: "👩‍🎨",
      quote: "I was skeptical at first, but JobsAdmire delivered. Found my dream role at Netflix in just two weeks. Absolutely recommend!",
      rating: 5,
      increase: "+$35K salary"
    }
  ];

  const companies = [
    "Google", "Apple", "Microsoft", "Netflix", "Airbnb", "Uber", "Tesla", "Meta", "Amazon", "Spotify"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-blue-300/40 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-cyan-300/30 rounded-full blur-xl animate-bounce"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/2 left-10 w-6 h-6 bg-sky-400/20 rotate-45 animate-spin"></div>
        <div className="absolute top-1/4 right-1/3 w-4 h-4 bg-blue-500/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/2 right-10 w-8 h-8 bg-indigo-400/25 rotate-12 animate-pulse"></div>
      </div>

     

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center bg-white border border-sky-200 text-sky-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-sm">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              Trusted by 500K+ Professionals
              <Sparkles className="h-4 w-4 ml-2 text-sky-500" />
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="text-black">Find Your</span>
              <br />
              <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Dream Career
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Upload your resume and let our AI connect you with opportunities from the world's top companies. 
              <span className="text-sky-600 font-semibold"> Your next career move starts here.</span>
            </p>

            {/* Process Steps */}
            <div className="flex items-center justify-center space-x-8 mb-16">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center space-x-3 ${currentStep >= step.number ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      currentStep >= step.number ? 'bg-gradient-to-r from-sky-500 to-blue-600' : 'bg-gray-300'
                    }`}>
                      {currentStep > step.number ? <CheckCircle className="h-6 w-6" /> : step.number}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="font-semibold text-gray-800">{t(step.titleKey)}</p>
                      <p className="text-sm text-gray-500">{t(step.descriptionKey)}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-gray-400 mx-4 hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upload Section - Centered and Prominent */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="bg-white rounded-3xl shadow-2xl shadow-sky-500/10 border border-sky-100 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-1">
                <div className="bg-white rounded-3xl p-12">
                  {!isUploaded ? (
                    <div className="text-center">
                      <div className="mb-8">
                        <div className="w-24 h-24 bg-gradient-to-r from-sky-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <Upload className="h-12 w-12 text-sky-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-3">Upload Your Resume</h3>
                        <p className="text-lg text-gray-600">Let our AI analyze your experience and find perfect matches</p>
                      </div>

                      <div
                        className={`border-3 border-dashed rounded-2xl p-16 text-center transition-all cursor-pointer group ${
                          dragActive 
                            ? 'border-sky-500 bg-sky-50 scale-105' 
                            : 'border-sky-300 hover:border-sky-400 hover:bg-sky-50/50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Upload className="mx-auto h-16 w-16 text-sky-400 mb-6 group-hover:scale-110 transition-transform" />
                        <label className="cursor-pointer">
                          <span className="text-2xl font-bold text-gray-800 block mb-3">
                            Drag & drop your resume here
                          </span>
                          <span className="text-gray-500 block mb-6">
                            or click to browse • PDF, DOC, DOCX • Max 10MB
                          </span>
                          <div className="inline-flex items-center bg-gradient-to-r from-sky-500 to-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-sky-500/25 transform hover:scale-105 transition-all">
                            <Upload className="h-6 w-6 mr-3" />
                            Choose File
                          </div>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="h-16 w-16 text-green-600" />
                      </div>
                      <h4 className="text-3xl font-bold text-gray-800 mb-4">🎉 Upload Successful!</h4>
                      <p className="text-lg text-gray-600 mb-8">Our AI is analyzing your resume and finding the best opportunities...</p>
                      
                      {/* Analysis Progress */}
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <span className="font-semibold text-green-800">Resume Parsed Successfully</span>
                          </div>
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <span className="font-semibold text-green-800">Skills & Experience Identified</span>
                          </div>
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <div className="flex items-center justify-between bg-sky-50 border border-sky-200 rounded-xl px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="animate-spin h-6 w-6 border-2 border-sky-600 border-t-transparent rounded-full"></div>
                            <span className="font-semibold text-sky-800">Finding Perfect Matches...</span>
                          </div>
                          <span className="text-sky-600 font-bold">85%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-4">
                        <button 
                          onClick={() => setIsUploaded(false)}
                          className="text-sky-600 hover:text-sky-700 font-semibold hover:underline"
                        >
                          Upload Different Resume
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                          View Matches
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100 transform hover:-translate-y-2 transition-all">
                  <div className={`w-16 h-16 ${metric.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <metric.icon className={`h-8 w-8 ${metric.textColor}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{metric.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{t(metric.labelKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 font-semibold text-lg mb-12">Trusted by professionals at top companies worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {companies.map((company, index) => (
              <div key={index} className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Why Choose <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">JobsAdmire</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology meets human intuition to deliver the perfect career match
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-gray-100 transform hover:-translate-y-2 transition-all duration-500">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{t(feature.titleKey)}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{t(feature.descriptionKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Success</span> Stories
            </h2>
            <p className="text-xl text-gray-600">Real people, real career transformations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl p-8 border border-sky-200 hover:border-sky-300 transform hover:-translate-y-2 hover:shadow-xl transition-all duration-500">
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
                      <p className="text-sky-600 font-semibold">{testimonial.role}</p>
                      <p className="text-gray-500">{testimonial.company}</p>
                      <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1 rounded-full mt-2 font-bold">
                        {testimonial.increase}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-sky-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join half a million professionals who've discovered their dream careers through JobsAdmire. 
            Your perfect job match is waiting.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <button className="bg-white text-sky-600 px-12 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center group">
              <Upload className="h-6 w-6 mr-3 group-hover:animate-bounce" />
              Upload Resume Now
            </button>
            <button className="border-2 border-white text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-sky-600 transition-all flex items-center group">
              Browse Jobs
              <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-12 text-sky-100">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span className="font-semibold">100% Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6" />
              <span className="font-semibold">Instant AI Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6" />
              <span className="font-semibold">500K+ Happy Users</span>
            </div>
          </div>
        </div>
      </section>
      </div>
  )
  
}
      
    
      