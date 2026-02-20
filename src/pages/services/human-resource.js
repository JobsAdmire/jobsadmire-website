import React, { useState } from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import ServicesCarousel from "@components/home/ServicesCarousel";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Banner from "../../components/home/banner";
import {
  User,
  FileSpreadsheet,
  Briefcase,
  BarChart,
  Calendar,
  Award,
  BookOpen,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  Users,
  ShieldCheck,
  Lightbulb,
  Heart,
  TrendingUp,
  Sigma,
} from "lucide-react";

const HRServicesPage = () => {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "COO, TechVision Inc.",
      content:
        "The HR services team transformed our recruitment process. We've reduced time-to-hire by 40% while improving the quality of candidates.",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Michael Chen",
      position: "Director of Operations, GrowthFirst",
      content:
        "Their performance management systems helped us identify and develop key talent within our organization, resulting in better retention and productivity.",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Elena Rodriguez",
      position: "CEO, Innovative Solutions",
      content:
        "Working with this HR team gave us access to expertise we couldn't afford in-house. Their strategic guidance has been invaluable to our growth.",
      image: "/api/placeholder/60/60",
    },
  ];

  const serviceCategories = {
    all: [
      {
        id: 1,
        title: "Recruitment & Staffing",
        description:
          "End-to-end talent acquisition services from job description creation to onboarding new hires.",
        icon: <User size={36} />,
        color: "blue",
      },
      {
        id: 2,
        title: "Payroll Management",
        description:
          "Accurate and timely payroll processing, tax compliance, and benefit administration.",
        icon: <FileSpreadsheet size={36} />,
        color: "green",
      },
      {
        id: 3,
        title: "HR Consulting",
        description:
          "Strategic HR planning, policy development, and organizational structure optimization.",
        icon: <Briefcase size={36} />,
        color: "purple",
      },
      {
        id: 4,
        title: "Performance Management",
        description:
          "KPI development, review process design, and performance improvement programs.",
        icon: <BarChart size={36} />,
        color: "red",
      },
      {
        id: 5,
        title: "Training & Development",
        description:
          "Custom training programs, workshops, and professional development planning.",
        icon: <BookOpen size={36} />,
        color: "yellow",
      },
      {
        id: 6,
        title: "Employee Relations",
        description:
          "Conflict resolution, employee engagement, and workplace culture enhancement.",
        icon: <Users size={36} />,
        color: "indigo",
      },
      {
        id: 7,
        title: "Compliance Management",
        description:
          "Ensure your organization meets all legal and regulatory requirements in HR practices.",
        icon: <ShieldCheck size={36} />,
        color: "teal",
      },
      {
        id: 8,
        title: "HR Analytics",
        description:
          "Data-driven insights to optimize workforce planning and HR strategy.",
        icon: <Sigma size={36} />,
        color: "pink",
      },
    ],
    strategic: [3, 4, 7, 8],
    operational: [1, 2, 5, 6],
  };

  const displayedServices =
    activeTab === "all"
      ? serviceCategories.all
      : serviceCategories.all.filter((service) =>
          serviceCategories[activeTab].includes(service.id)
        );

  const stats = [
    { value: "98%", label: "Client Retention", icon: <Heart size={24} /> },
    {
      value: "45%",
      label: "Avg. Productivity Increase",
      icon: <TrendingUp size={24} />,
    },
    {
      value: "3.5x",
      label: "ROI on HR Investment",
      icon: <BarChart size={24} />,
    },
    { value: "25+", label: "Years of Experience", icon: <Award size={24} /> },
  ];

  return (
    <div className="bg-white">
      <Head>
        4
        <title>
          {" "}
          Human Resource Management Services | HR Solutions for Business Growth
          – JobsAdmire
        </title>
        <meta
          name="description"
          content="Transform your organization with JobsAdmire’s human resource services. From recruitment to employee development, we provide tailored HR solutions for businesses of all sizes."
        />
        <meta
          name="keywords"
          content="Interview Coaching Services, Online Job Interview Training – JobsAdmire"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Your Open Graph Title" />
        <meta property="og:description" content="Your Open Graph description" />
        <meta property="og:type" content="website" />
      </Head>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="text-center px-4 pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px]">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Strategic HR Solutions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Elevate your organization with comprehensive human resource services
            tailored to your unique business needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-[#38B6FF] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Schedule a Consultation
            </button>
            <button className="border border-[#38B6FF] text-[#38B6FF] hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-colors">
              Download Services Guide
            </button>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] text-white py-12 px-4 md:px-8 mb-16">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              What Sets Our HR Solutions Apart
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm"
                >
                  <div className="mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Tabs and Grid */}
        <div className="px-4 mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our HR Services
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Comprehensive solutions designed to optimize your workforce and
              drive organizational success
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <button
                onClick={() => handleTabChange("all")}
                className={`px-6 py-2 rounded-full ${activeTab === "all" ? "bg-[#38B6FF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                All Services
              </button>
              <button
                onClick={() => handleTabChange("strategic")}
                className={`px-6 py-2 rounded-full ${activeTab === "strategic" ? "bg-[#38B6FF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Strategic HR
              </button>
              <button
                onClick={() => handleTabChange("operational")}
                className={`px-6 py-2 rounded-full ${activeTab === "operational" ? "bg-[#38B6FF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Operational HR
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {displayedServices.map((service) => (
              <div
                key={service.id}
                className={`bg-${service.color}-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`mb-4 text-${service.color}-600`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <a
                  href="#"
                  className={`text-${service.color}-600 font-medium flex items-center`}
                >
                  Learn more <span className="ml-1">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Our Approach Section */}
        <div className="bg-gray-50 py-16 px-4 mb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Approach to HR Management
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We believe that effective HR management is a strategic
                partnership that drives business results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-4">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("labels.humanResource.understand")}</h3>
                <p className="text-gray-600 mb-4">
                  {t("labels.humanResource.understandDescription")}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle
                      size={18}
                      className="text-green-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span>{t("labels.humanResource.understandBullet1")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={18}
                      className="text-green-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span>{t("labels.humanResource.understandBullet2")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={18}
                      className="text-green-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span>{t("labels.humanResource.understandBullet3")}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full mb-4">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("labels.humanResource.implement")}</h3>
                <p className="text-gray-600 mb-4">
                  {t("labels.humanResource.implementDescription")}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle
                      size={18}
                      className="text-green-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span>{t("labels.humanResource.implementBullet1")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={18}
                      className="text-green-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span>{t("labels.humanResource.implementBullet2")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={18}
                      className="text-green-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span>{t("labels.humanResource.implementBullet3")}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 flex items-center justify-center bg-green-100 text-green-600 rounded-full mb-4">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("labels.humanResource.optimize")}</h3>
                <p className="text-gray-600 mb-4">
                  {t("labels.humanResource.optimizeDescription")}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle
                      size={18}
                      className="text-green-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span>{t("labels.humanResource.optimizeBullet1")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={18}
                      className="text-green-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span>{t("labels.humanResource.optimizeBullet2")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={18}
                      className="text-green-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span>{t("labels.humanResource.optimizeBullet3")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Industries Served */}
        <div className="px-4 mb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t("labels.humanResource.industriesWeServe")}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t("labels.humanResource.industriesWeServeDescription")}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
              {[
                "Technology",
                "Healthcare",
                "Manufacturing",
                "Finance",
                "Retail",
                "Education",
                "Hospitality",
                "Nonprofit",
                "Construction",
                "Professional Services",
              ].map((industry, index) => (
                <div
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
                >
                  <span className="font-medium">{industry}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-blue-50 py-16 px-4 mb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                What Our Clients Say
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Hear from organizations that have transformed their HR function
                with our services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
      </div>
      <ServicesCarousel />
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["about", "common"])),
    },
  };
};
export default HRServicesPage;
