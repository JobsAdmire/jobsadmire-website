import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Youtube,
  MapPin,
  Phone,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  MessageSquare,
  Star,
  User,
  Download,
  Headphones,
  Briefcase,
  Globe,
  Building,
} from "lucide-react";
import { FACEBOOK_URL, INSTAGRAM_URL, LINKEDIN_URL } from "@/lib/constants/app";

const JobPortalFooter = () => {
  const { t } = useTranslation("common");
  const [hoverIndex, setHoverIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState(0);
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [activeLocation, setActiveLocation] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailInput.includes("@") && emailInput.includes(".")) {
      setIsNewsletterSubmitted(true);
      setEmailInput("");
      setTimeout(() => setIsNewsletterSubmitted(false), 5000);
    }
  };

  const contacts = [
    {
      id: 1,
      country: t("footer.contacts.turkey.country"),
      city: t("footer.contacts.turkey.city"),
      address: t("footer.contacts.turkey.address"),
      phone: t("footer.contacts.turkey.phone"),
      email: t("footer.contacts.turkey.email"),
      hours: t("footer.contacts.turkey.hours"),
      icon: Building,
      color: "from-sky-400 to-blue-500",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170.123!2d30.713889!3d36.896389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c390e5e6e5e6e5%3A0x123456789!2sAdnan%20Menderes%20Blv.%2C%20Muratpa%C5%9Fa%2FAntalya%2C%20Turkey!5e0!3m2!1sen!2s!4v1640995200000!5m2!1sen!2s",
    },
    {
      id: 2,
      country: t("footer.contacts.pakistan.country"),
      city: t("footer.contacts.pakistan.city"),
      address: t("footer.contacts.pakistan.address"),
      phone: t("footer.contacts.pakistan.phone"),
      email: t("footer.contacts.pakistan.email"),
      hours: t("footer.contacts.pakistan.hours"),
      icon: Building,
      color: "from-emerald-400 to-teal-500",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.335656833943!2d67.03017577095954!3d24.852383096837485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e78212b2615%3A0x62229de1d923e1d5!2sKashif%20Center!5e0!3m2!1sen!2sus!4v1758125169027!5m2!1sen!2sus",
    },
  ];

  const tabContents = [
    {
      title: t("footer.featuredServices.tabs.findJobs.title", {
        defaultValue: "Find Jobs",
      }),
      features: [
        t("footer.featuredServices.tabs.findJobs.features.searchVacancies", {
          defaultValue: "Search Vacancies",
        }),
        t("footer.featuredServices.tabs.findJobs.features.createProfile", {
          defaultValue: "Create Profile",
        }),
        t("footer.featuredServices.tabs.findJobs.features.applyTracking", {
          defaultValue: "Apply Tracking",
        }),
        t("footer.featuredServices.tabs.findJobs.features.careerAdvice", {
          defaultValue: "Career Advice",
        }),
      ],
      link: "/job",
    },
    {
      title: t("footer.featuredServices.tabs.hireTalent.title", {
        defaultValue: "Hire Talent",
      }),
      features: [
        t("footer.featuredServices.tabs.hireTalent.features.postJobOpenings", {
          defaultValue: "Post Job Openings",
        }),
        t("footer.featuredServices.tabs.hireTalent.features.resumeDatabase", {
          defaultValue: "Resume Database",
        }),
        t(
          "footer.featuredServices.tabs.hireTalent.features.recruitmentSolutions",
          { defaultValue: "Recruitment Solutions" }
        ),
        t("footer.featuredServices.tabs.hireTalent.features.hrConsulting", {
          defaultValue: "HR Consulting",
        }),
      ],
      link: "/hire-talent",
    },
    {
      title: t("footer.featuredServices.tabs.partnerWithUs.title", {
        defaultValue: "Partner With Us",
      }),
      features: [
        t("footer.featuredServices.tabs.partnerWithUs.features.jobSeeker", {
          defaultValue: "Are You A Job Seeker?",
        }),
        t("footer.featuredServices.tabs.partnerWithUs.features.employer", {
          defaultValue: "Are You An Employer?",
        }),
        t(
          "footer.featuredServices.tabs.partnerWithUs.features.recruitmentAgency",
          { defaultValue: "Are You A Recruitment Agency?" }
        ),
        t("footer.featuredServices.tabs.partnerWithUs.features.hrConsultant", {
          defaultValue: "Are You A HR Consultant?",
        }),
      ],
      link: "/become-a-partner",
    },
  ];

  const logos = [
    "/logos/21.png",
    "/logos/22.png",
    "/logos/23.png",
    "/logos/24.png",
    "/logos/25.png",
    "/logos/26.png",
    "/logos/27.png",
  ];

  const navigationCategories = [
    {
      title: t("footer.navigation.jobsAdmire.title", {
        defaultValue: "JobsAdmire",
      }),
      links: [
        {
          name: t("footer.navigation.jobsAdmire.links.aboutUs", {
            defaultValue: "About Us",
          }),
          href: "/about",
        },
        {
          name: t("footer.navigation.jobsAdmire.links.contactUs", {
            defaultValue: "Contact Us",
          }),
          href: "/contact-us",
        },
        {
          name: t("footer.navigation.jobsAdmire.links.blog", {
            defaultValue: "Blog",
          }),
          href: "/blog",
        },
        {
          name: t("footer.navigation.jobsAdmire.links.companyCertifications", {
            defaultValue: "Company Certifications",
          }),
          href: "/certifications",
        },
      ],
    },
    {
      title: t("footer.navigation.resources.title", {
        defaultValue: "Resources",
      }),
      links: [
        {
          name: t("footer.navigation.resources.links.residencePermitInfo", {
            defaultValue: "Residence Permit Info",
          }),
          href: "/immigration/turkey-residence-permit",
        },
        {
          name: t("footer.navigation.resources.links.invitationLetterRequest", {
            defaultValue: "Invitation Letter Request",
          }),
          href: "/visa-e-invitation",
        },
      ],
    },
    {
      title: t("footer.navigation.jobProviders.title", {
        defaultValue: "Job Providers",
      }),
      links: [
        {
          name: t("footer.navigation.jobProviders.links.findJobs", {
            defaultValue: "Find Jobs",
          }),
          href: "/job",
        },
        {
          name: t("footer.navigation.jobProviders.links.resumeGenerator", {
            defaultValue: "Resume Generator",
          }),
          href: "/resume-generator",
        },
        {
          name: t("footer.navigation.jobProviders.links.resumeService", {
            defaultValue: "Resume Service",
          }),
          href: "/services/resume-service",
        },
        // Disabled: Company Registration page
        // {
        //   name: t("footer.navigation.jobProviders.links.companyRegistration", {
        //     defaultValue: "Company Registration",
        //   }),
        //   href: "/register-your-company",
        // },
      ],
    },
  ];

  return (
    <footer className="relative pt-20 pb-10 overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
        <div className="absolute top-0 rounded-full bg-primary left-1/4 w-96 h-96 mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute rounded-full top-1/3 right-1/4 w-96 h-96 bg-sky-400 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 rounded-full bg-primary left-1/2 w-96 h-96 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container relative z-10 px-4 mx-auto max-w-7xl">
        {/* Top Brand Section */}
        <div className="relative mb-16">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row">
            {/* Left Side - Brand Info */}
            <div className="w-full text-center lg:w-1/2 lg:text-left">
              <div className="relative inline-block mb-3">
                <div className="absolute inset-0 transform blur-lg opacity-30 bg-gradient-to-r from-white to-primary rounded-3xl -rotate-3"></div>
                <img
                  src="/logos/logo4.png"
                  alt={t("labels.footer.logoAlt")}
                  className="relative w-auto h-16"
                />
              </div>

              <h2 className="mb-4 text-xl font-medium tracking-wide text-blue-400">
                {t("footer.brand.tagline", {
                  defaultValue: "Connecting Talent with Opportunity",
                })}
              </h2>
              <p className="mb-5 text-gray-600">
                {t("footer.brand.description", {
                  defaultValue:
                    "Empowering careers and businesses through innovative HR solutions and personalized recruitment services.",
                })}
              </p>
              <a
                href="/profile/company-profile.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3 mb-5 font-medium text-white transition-all transform rounded-lg bg-gradient-to-r from-primary to-primary hover:shadow-lg hover:from-sky-600 hover:to-primary hover:-translate-y-1"
              >
                <Download size={18} />
                {t("footer.brand.downloadProfile", {
                  defaultValue: "Download Company Profile",
                })}
              </a>
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                {[
                  {
                    icon: <Facebook size={18} />,
                    color: "bg-[#1877F2] hover:bg-[#0D65D9]",
                    link: FACEBOOK_URL,
                  },
                  {
                    icon: <Instagram size={18} />,
                    color:
                      "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90",
                    link: INSTAGRAM_URL,
                  },
                  {
                    icon: <Linkedin size={18} />,
                    color: "bg-[#0A66C2] hover:bg-[#004182]",
                    link: LINKEDIN_URL,
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className={`h-10 w-10 md:h-12 md:w-12 rounded-full ${social.color} flex items-center justify-center text-white shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300`}
                    aria-label={t(
                      `footer.social.${index === 0 ? "facebook" : index === 1 ? "instagram" : "linkedin"}`,
                      {
                        defaultValue:
                          index === 0
                            ? "Facebook"
                            : index === 1
                              ? "Instagram"
                              : "LinkedIn",
                      }
                    )}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side - Newsletter */}
            <div className="w-full p-6 bg-white shadow-md lg:w-1/2 rounded-xl">
              <h3 className="mb-4 text-xl font-bold text-primary">
                {t("footer.newsletter.title", {
                  defaultValue: "Job Alerts & Updates",
                })}
              </h3>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder={t("footer.newsletter.placeholder", {
                    defaultValue: "Enter your email",
                  })}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 text-white transition-colors rounded-lg bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary whitespace-nowrap"
                >
                  {t("footer.newsletter.subscribe", {
                    defaultValue: "Subscribe",
                  })}
                </button>
              </div>
              {isNewsletterSubmitted && (
                <p className="mt-2 text-sm text-green-600">
                  {t("footer.newsletter.success", {
                    defaultValue: "Thank you for subscribing!",
                  })}
                </p>
              )}

              {/* Payment Methods */}
              <div className="pt-6 mt-6 border-t border-slate-200">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <img
                    src="/logos/americanexpress.png"
                    alt={t("labels.footer.paymentAmex")}
                    className="object-contain h-8"
                  />
                  <img
                    src="/logos/applepay.png"
                    alt={t("labels.footer.paymentApplePay")}
                    className="object-contain h-8"
                  />
                  <img
                    src="/logos/mastercard.png"
                    alt={t("labels.footer.paymentMastercard")}
                    className="object-contain h-8"
                  />
                  <img
                    src="/logos/visa.png"
                    alt={t("labels.footer.paymentVisa")}
                    className="object-contain h-8"
                  />
                  <img
                    src="/logos/gp.png"
                    alt={t("labels.footer.paymentGooglePay")}
                    className="object-contain h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Navigation and Map */}
        <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-2">
          {/* Left Column: Navigation Links + Certification & Logos */}
          <div className="flex flex-col w-full h-full gap-8">
            {/* Navigation Links */}
            <div className="grid flex-1 grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
              {navigationCategories.map((category, index) => (
                <div key={index} className="relative">
                  <h3 className="relative inline-block mb-6 text-xl font-bold text-primary">
                    {category.title}
                    <span className="absolute bottom-[-8px] left-0 w-16 h-1 bg-gradient-to-r from-primary to-primary rounded-full"></span>
                  </h3>
                  <ul className="space-y-6">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.href}
                          className="flex items-center text-gray-600 transition-colors cursor-pointer group hover:text-primary"
                        >
                          <span className="relative flex items-center">
                            <ChevronRight
                              size={14}
                              className="mr-1 transition-all opacity-0 text-primary group-hover:opacity-100"
                            />
                            <span className="text-sm font-medium">
                              {link.name}
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Partner Logos Only */}
            <div className="w-full p-6 bg-white border shadow-lg rounded-xl border-slate-200">
              <div className="flex flex-wrap items-center justify-center gap-6">
                {logos.map((logo, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <img
                      src={logo}
                      alt={`Partner logo ${index + 1}`}
                      className="object-contain w-auto h-12 transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col justify-between mb-8 md:flex-row md:items-center">
              <h3 className="relative inline-block mb-4 text-2xl font-bold text-primary md:mb-0">
                {t("footer.globalPresence.title", {
                  defaultValue: "Global Presence",
                })}
                <span className="absolute bottom-[-8px] left-0 w-16 h-1 bg-gradient-to-r from-primary to-primary rounded-full"></span>
              </h3>
              <a
                href="/contact-us"
                className="flex items-center text-sm font-semibold text-primary hover:text-sky-800 group"
              >
                {t("footer.globalPresence.viewAll", {
                  defaultValue: "View all locations",
                })}
                <ArrowUpRight
                  size={16}
                  className="ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            </div>

            <div className="flex-1 p-6 bg-white border shadow-xl backdrop-blur-lg rounded-2xl border-white/50">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6 space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-sky-900">
                    {t("footer.mapSection.title", {
                      defaultValue: "Find Us on Map",
                    })}
                  </h3>
                </div>

                {/* Google Map */}
                <div className="relative flex-1 w-full overflow-hidden border shadow-lg rounded-xl border-sky-200/30">
                  <iframe
                    src={contacts[activeLocation].mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  ></iframe>

                  {/* Location Info Overlay */}
                  <div className="absolute z-10 bottom-4 left-4 right-4">
                    <div className="p-4 border shadow-xl bg-white/95 backdrop-blur-lg rounded-xl border-white/50">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${contacts[activeLocation].color} rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-1 font-bold text-sky-900">
                            {contacts[activeLocation].city},{" "}
                            {contacts[activeLocation].country}
                          </h4>
                          <p className="mb-2 text-sm text-sky-600 line-clamp-2">
                            {contacts[activeLocation].address}
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs">
                            <a
                              href={`tel:${contacts[activeLocation].phone}`}
                              className="flex items-center space-x-1 transition-colors text-sky-700 hover:text-sky-800"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{contacts[activeLocation].phone}</span>
                            </a>
                            <a
                              href={`mailto:${contacts[activeLocation].email}`}
                              className="flex items-center space-x-1 transition-colors text-sky-700 hover:text-sky-800"
                            >
                              <Mail className="w-3 h-3" />
                              <span>
                                {t("footer.mapSection.email", {
                                  defaultValue: "Email",
                                })}
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Navigation */}
                <div className="flex justify-center mt-4 space-x-2">
                  {contacts.map((contact, index) => (
                    <button
                      key={contact.id}
                      onClick={() => setActiveLocation(index)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        index === activeLocation
                          ? `bg-gradient-to-r ${contact.color} text-white shadow-lg scale-105`
                          : "bg-sky-100/80 text-sky-700 hover:bg-sky-200/80 hover:scale-105"
                      }`}
                    >
                      {contact.city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* İŞKUR Certification Section - Full Width */}
        <div className="py-8 mb-8 border-t border-slate-200">
          <div className="flex items-start gap-6 p-6 bg-white border rounded-xl border-slate-200">
            <div className="flex-shrink-0">
              <img
                src="/logos/iskur.png"
                alt={t("labels.footer.certificationAlt")}
                className="object-contain w-24 h-24"
              />
            </div>
            <div className="text-gray-600">
              <p className="mb-3 text-base font-semibold text-primary">
                {t("footer.certification.companyName", {
                  defaultValue:
                    "Jobs Admire Özel İstihdam Bürosu Sanayi Ve Ticaret Limited Şirket",
                })}
              </p>
              <p className="text-sm leading-relaxed">
                {t("footer.certification.description", {
                  defaultValue:
                    "operates with the permit number 1730 dated 19.09.2024 of the Turkish Employment Agency. According to law number 4904, it is forbidden to charge a fee to job seekers. For your complaints, you can apply to the Istanbul İŞKUR Provincial Directorate Kadıköy Service Center. İşKur Tel: 0216 418 34 55 Eğitim mah. 1.Açıkgöz street. No:3 KADIKÖY/İSTANBUL",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-6 border-t border-slate-200">
          <div className="flex flex-col items-center justify-between space-y-4 md:space-y-0 md:flex-row">
            <div className="text-center text-gray-600">
              {t("footer.copyright.text", {
                defaultValue: `Copyright © ${new Date().getFullYear()} JOBS ADMİRE ÖZEL İSTİHDAM BÜROSU SANAYİ VE TİCARET LİMİTED ŞİRKETİ`,
                year: new Date().getFullYear(),
              })}{" "}
              <b>
                {t("footer.copyright.taxNo", {
                  defaultValue: "Tax No: 48422122",
                })}
              </b>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:space-x-6">
              <a
                href="/privacy"
                className="text-sm text-gray-600 hover:text-indigo-900"
              >
                {t("footer.legal.privacy", { defaultValue: "Privacy Policy" })}
              </a>
              <a
                href="/terms"
                className="text-sm text-gray-600 hover:text-indigo-900"
              >
                {t("footer.legal.terms", { defaultValue: "Terms of Service" })}
              </a>
              <a
                href=""
                className="text-sm text-gray-600 hover:text-indigo-900"
              >
                {t("footer.legal.cookies", { defaultValue: "Cookie Settings" })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default JobPortalFooter;
