import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
  ChevronDown,
  Menu,
  X,
  PhoneCall,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Users,
  Briefcase,
  Mail,
  MapPin,
  Search,
  UserPlus,
  PenTool,
} from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import {
  EMAIL_URL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from "@/lib/constants/app";
import { env } from "@/lib/constants/env";

const SERVICE_PATH_PREFIXES = ["/services", "/immigration"];
const SERVICE_EXACT_MATCHES = [
  "/visa",
  "/job-recruitment",
  "/work-permit",
  "/turkey-citizenship",
  "/visa-e-invitations",
  "/immigration/turkey-residence-permit",
];

const normalizePath = (rawPath = "/", locale, locales = []) => {
  if (!rawPath) return "/";

  let path = rawPath.split("#")[0].split("?")[0] || "/";

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  const removeLocalePrefix = (prefix) => {
    if (path === `/${prefix}`) {
      path = "/";
      return true;
    }
    if (path.startsWith(`/${prefix}/`)) {
      path = path.slice(prefix.length + 1) || "/";
      if (!path.startsWith("/")) {
        path = `/${path}`;
      }
      return true;
    }
    return false;
  };

  if (locale) {
    removeLocalePrefix(locale);
  } else {
    for (const loc of locales) {
      if (removeLocalePrefix(loc)) break;
    }
  }

  return path === "" ? "/" : path;
};

const isServicesPath = (path) => {
  if (
    SERVICE_PATH_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`)
    )
  ) {
    return true;
  }

  return SERVICE_EXACT_MATCHES.some(
    (match) => path === match || path.startsWith(`${match}/`)
  );
};

const Navbar = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [partnerDropdownOpen, setPartnerDropdownOpen] = useState(false);
  // Fixed function to determine active item based on current path
  const getActiveItemFromPath = useCallback(
    (rawPath) => {
      const path = normalizePath(rawPath, router.locale, router.locales);

      if (path === "/" || path === "/home") return "home";
      if (path.startsWith("/about")) return "about";
      if (isServicesPath(path)) return "services";
      if (path.startsWith("/job")) return "jobs";
      if (path.startsWith("/contact")) return "contact";
      if (path.startsWith("/blog")) return "blog";
      if (path.startsWith("/resume-generator") || path.startsWith("/resume"))
        return "resume-generator";
      if (path.startsWith("/register")) return "register";
      if (path.startsWith("/login")) return "login";
      if (path.startsWith("/thankyou")) return "thankyou";

      return "home";
    },
    [router.locale, router.locales]
  );

  // Update active item whenever route changes (includes locale-aware paths)
  useEffect(() => {
    setActiveItem(getActiveItemFromPath(router.asPath));
  }, [router.asPath, getActiveItemFromPath]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (megaMenuOpen) setMegaMenuOpen(false);
    if (searchOpen) setSearchOpen(false);
  };

  const toggleMegaMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMegaMenuOpen(!megaMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setMegaMenuOpen(false);
    setSearchOpen(false);
  };

  const handleNavClick = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-lg pt-0"
            : "bg-gradient-to-r from-sky-50/90 to-white/90 backdrop-blur-sm pt-[10px]"
        }`}
      >
        {/* Top Bar with Contact Info - Desktop Only */}

        {/* Top Bar with Contact Info - Fully Responsive */}
        <div className="py-2 text-white bg-gradient-to-r from-sky-600 to-sky-500 w-full">
          <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
            {/* Extra Large Desktop Layout - Full Width */}
            <div className="hidden xl:flex xl:items-center xl:justify-between">
              {/* Left Section - Contact Info */}
              <div className="flex items-center flex-shrink-0 space-x-6">
                <div className="block xxl:flex xxl:space-x-6 xxl:items-center">
                  <a
                    href="tel:+905011240340"
                    className="flex items-center text-sm transition-all duration-300 whitespace-nowrap text-white/90 hover:text-white"
                  >
                    <PhoneCall size={14} className="mr-1.5 flex-shrink-0" />
                    <span>
                      {t("navbar.candidateHRCompanies", {
                        defaultValue: "Candidate & HR Companies",
                      })}{" "}
                      +90 501 124 03 40
                    </span>
                  </a>

                  <a
                    href="tel:+905011240340"
                    className="flex items-center text-sm transition-all duration-300 whitespace-nowrap text-white/90 hover:text-white"
                  >
                    <PhoneCall size={14} className="mr-1.5 flex-shrink-0" />
                    <span>
                      {t("navbar.jobProvider", {
                        defaultValue: "Job Provider",
                      })}
                      : +90 553 383 2549
                    </span>
                  </a>
                </div>

                <a
                  href={EMAIL_URL}
                  className="flex items-center text-sm transition-all duration-300 whitespace-nowrap text-white/90 hover:text-white"
                >
                  <Mail size={14} className="mr-1.5 flex-shrink-0" />
                  <span>{EMAIL_URL.replace("mailto:", "")}</span>
                </a>

                <div className="flex items-center text-sm whitespace-nowrap text-white/90">
                  <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                  <span>
                    {t("navbar.location", { defaultValue: "Antalya, Turkey" })}
                  </span>
                </div>
              </div>

              {/* Right Section - Social & Actions */}
              <div className="flex items-center flex-shrink-0 ml-4 space-x-4">
                <div className="flex space-x-2">
                  <SocialIconTop
                    icon={<Facebook size={14} />}
                    href={FACEBOOK_URL}
                  />
                  <SocialIconTop
                    icon={<Instagram size={14} />}
                    href={INSTAGRAM_URL}
                  />
                  <SocialIconTop
                    icon={<Linkedin size={14} />}
                    href={LINKEDIN_URL}
                  />
                </div>

                <div className="w-px h-5 mx-1 bg-white/20"></div>

                <a
                  href={`${env.CRM_API_URL}/jobadmire/blog-article/blogs`}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-sky-500 transition-all duration-300 rounded-md whitespace-nowrap bg-white hover:scale-105 shadow-md"
                  onClick={() => handleNavClick("blog")}
                >
                  <PenTool size={14} className="mr-1.5 flex-shrink-0" />
                  {t("navbar.blog", { defaultValue: "Blog" })}
                </a>

                <a
                  href="/contact-us"
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-sky-500 transition-all duration-300 rounded-md whitespace-nowrap bg-white hover:scale-105 shadow-md"
                  onClick={() => handleNavClick("contact")}
                >
                  <Mail size={14} className="mr-1.5 flex-shrink-0" />
                  {t("navbar.contact", { defaultValue: "Contact" })}
                </a>

                <a
                  href={`${env.CRM_API_URL}/ext-login`}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-sky-500 transition-all duration-300 rounded-md whitespace-nowrap bg-white hover:scale-105 shadow-md"
                  onClick={() => handleNavClick("login")}
                >
                  {t("navbar.login", { defaultValue: "Login" })}
                </a>

                <div className="w-px h-5 mx-1 bg-white/20"></div>
                <LanguageSwitcher />
              </div>
            </div>

            {/* Large Desktop Layout - Compact Version */}
            <div className="items-center justify-between hidden lg:flex xl:hidden">
              {/* Left: Essential Contact */}
              <div className="flex items-center space-x-3 text-xs">
                <a
                  href="tel:+905011240340"
                  className="flex items-center transition-all duration-300 text-white/90 hover:text-white"
                >
                  <PhoneCall size={12} className="mr-1 flex-shrink-0" />
                  <span className="font-medium">
                    {t("navbar.candidateHRCompanies", {
                      defaultValue: "Candidate & HR Companies",
                    })}
                    :
                  </span>
                  <span className="ml-1">+90 501 124 03 40</span>
                </a>
                <a
                  href="tel:+905533832549"
                  className="flex items-center transition-all duration-300 text-white/90 hover:text-white"
                >
                  <PhoneCall size={12} className="mr-1 flex-shrink-0" />
                  <span className="font-medium">
                    {t("navbar.jobProvider", { defaultValue: "Job Provider" })}:
                  </span>
                  <span className="ml-1">+90 553 383 2549</span>
                </a>
                <a
                  href={EMAIL_URL}
                  className="flex items-center transition-all duration-300 text-white/90 hover:text-white"
                >
                  <Mail size={12} className="mr-1 flex-shrink-0" />
                  <span>{EMAIL_URL.replace("mailto:", "")}</span>
                </a>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <SocialIconTop
                    icon={<Facebook size={12} />}
                    href={FACEBOOK_URL}
                  />
                  <SocialIconTop
                    icon={<Instagram size={12} />}
                    href={INSTAGRAM_URL}
                  />
                  <SocialIconTop
                    icon={<Linkedin size={12} />}
                    href={LINKEDIN_URL}
                  />
                </div>

                <div className="w-px h-4 bg-white/20"></div>

                <a
                  href={`${env.CRM_API_URL}/jobadmire/blog-article/blogs`}
                  className="flex items-center px-2 py-1 text-xs font-medium text-sky-500 transition-all duration-300 rounded-md bg-white hover:scale-105 shadow-sm"
                  onClick={() => handleNavClick("blog")}
                >
                  <PenTool size={12} className="mr-1 flex-shrink-0" />
                  Blog
                </a>

                <a
                  href="/contact-us"
                  className="flex items-center px-2 py-1 text-xs font-medium text-sky-500 transition-all duration-300 rounded-md bg-white hover:scale-105 shadow-sm"
                  onClick={() => handleNavClick("contact")}
                >
                  <Mail size={12} className="mr-1 flex-shrink-0" />
                  Contact
                </a>

                <a
                  href={`${env.CRM_API_URL}/ext-login`}
                  className="flex items-center px-2 py-1 text-xs font-medium text-sky-500 transition-all duration-300 rounded-md bg-white hover:scale-105 shadow-sm"
                  onClick={() => handleNavClick("login")}
                >
                  Login
                </a>

                <div className="w-px h-4 bg-white/20"></div>
                <div className="scale-90">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>

            {/* Tablet & Mobile Layout */}
            <div className="flex items-center justify-between lg:hidden">
              {/* Left: Mobile phones (stacked) + email */}
              <div className="flex flex-col text-white/90 text-xs">
                <a
                  href="tel:+905011240340"
                  className="flex flex-col xs:flex-row xs:items-center mb-0.5 transition-all duration-200 hover:text-white"
                >
                  <span className="flex items-center">
                    <PhoneCall size={12} className="mr-1 flex-shrink-0" />
                    <span className="font-medium">
                      {t("navbar.candidateHRCompanies", {
                        defaultValue: "Candidate & HR Companies",
                      })}
                      :
                    </span>
                  </span>
                  <span className="xs:ml-1">+90 501 124 03 40</span>
                </a>

                <a
                  href="tel:+905533832549"
                  className="flex flex-col xs:flex-row xs:items-center mb-0.5 transition-all duration-200 hover:text-white"
                >
                  <span className="flex items-center">
                    <PhoneCall size={12} className="mr-1 flex-shrink-0" />
                    <span className="font-medium">
                      {t("navbar.jobProvider", {
                        defaultValue: "Job Provider",
                      })}
                      :
                    </span>
                  </span>
                  <span className="xs:ml-1">+90 553 383 2549</span>
                </a>

                <a
                  href={EMAIL_URL}
                  className="flex items-center transition-all duration-200 hover:text-white"
                >
                  <Mail size={12} className="mr-1 flex-shrink-0" />
                  <span>{EMAIL_URL.replace("mailto:", "")}</span>
                </a>
              </div>

              {/* Right: Compact Action Buttons + Social Icons */}
              <div className="flex flex-col items-end space-y-1">
                <div className="flex items-center space-x-1">
                  <a
                    href={`${env.CRM_API_URL}/jobadmire/blog-article/blogs`}
                    className="flex items-center px-1.5 py-0.5 text-xs font-medium text-sky-500 transition-all duration-300 rounded bg-white hover:scale-105 shadow-sm sm:px-2 sm:py-1"
                    onClick={() => handleNavClick("blog")}
                  >
                    <PenTool size={11} className="mr-1 flex-shrink-0" />
                    <span className="ml-0">
                      {t("navbar.blog", { defaultValue: "Blog" })}
                    </span>
                  </a>

                  <a
                    href="/contact-us"
                    className="flex items-center px-1.5 py-0.5 text-xs font-medium text-sky-500 transition-all duration-300 rounded bg-white hover:scale-105 shadow-sm sm:px-2 sm:py-1"
                    onClick={() => handleNavClick("contact")}
                  >
                    <Mail size={11} className="mr-1 flex-shrink-0" />
                    <span className="ml-0">
                      {t("navbar.contact", { defaultValue: "Contact" })}
                    </span>
                  </a>

                  <a
                    href={`${env.CRM_API_URL}/ext-login`}
                    className="flex items-center px-1.5 py-0.5 text-xs font-medium text-sky-500 transition-all duration-300 rounded bg-white hover:scale-105 shadow-sm sm:px-2 sm:py-1"
                    onClick={() => handleNavClick("login")}
                  >
                    Login
                  </a>
                </div>

                {/* Social Icons Row */}
                <div className="flex space-x-1.5 mt-1">
                  <SocialIconTop
                    icon={<Facebook size={12} />}
                    href={FACEBOOK_URL}
                  />
                  <SocialIconTop
                    icon={<Instagram size={12} />}
                    href={INSTAGRAM_URL}
                  />
                  <SocialIconTop
                    icon={<Linkedin size={12} />}
                    href={LINKEDIN_URL}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-2 lg:px-4 xl:px-6">
          {/* Main Navigation Bar */}
          <div className="flex items-center justify-between py-2">
            {/* Logo - Smaller on mobile */}
            <div className="flex-shrink-0">
              <a href="/" className="block">
                <img
                  src="/logos/logo4.png"
                  alt={t("labels.general.jobsAdmireLogo")}
                  className={`transition-all duration-300 ${
                    scrolled ? "h-8 lg:h-10" : "h-9 lg:h-10"
                  }`}
                />
              </a>
            </div>

            {/* Desktop Menu Items - Better spacing */}
            <div className="items-center hidden space-x-6 lg:flex">
              <NavItem
                href="/about"
                text={t("navbar.about", { defaultValue: "About Us" })}
                active={activeItem === "about"}
                onClick={() => handleNavClick("about")}
              />

              {/* Services Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button
                  className={`flex items-center px-4 py-2 rounded-md font-medium transition-all duration-300 group-hover:text-white group-hover:bg-sky-600 ${
                    activeItem === "services"
                      ? "text-white bg-sky-600"
                      : "text-gray-700 hover:text-white hover:bg-sky-600"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("services");
                    toggleMegaMenu(e);
                  }}
                >
                  {t("navbar.services", { defaultValue: "Services" })}
                  <ChevronDown
                    size={16}
                    className={`ml-1 transition-transform duration-300 ${megaMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Desktop Mega Menu */}
                <div
                  className={`absolute left-0 bg-white rounded-lg shadow-2xl top-full mt-2  max-w-xl transition-all duration-300 origin-top border border-gray-100
                    ${megaMenuOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}
                  style={{
                    marginLeft: "-210px",
                    transformOrigin: "top center",
                  }}
                >
                  {/* Mega Menu Hero Section */}
                  <div className="flex overflow-hidden text-white rounded-t-lg bg-gradient-to-r from-sky-500 to-sky-600">
                    {/* <div className="hidden w-1/3 md:block bg-gradient-to-br from-sky-400/20 to-sky-600/20"></div> */}
                  </div>

                  {/* Mega Menu Categories */}
                  <div className=" gap-4 p-6 rounded-b-lg bg-gradient-to-b from-sky-50 to-white">
                    <div>
                      <h3 className="flex items-center pb-2 mb-4 text-lg font-bold border-b text-sky-600 border-sky-100">
                        <Briefcase size={18} className="mr-2" />
                        {t("navbar.megaMenu.skillServices.title", {
                          defaultValue: "Skill Services",
                        })}
                      </h3>
                      <ul className="space-y-3">
                        <MegaMenuItem
                          href="/hire-workers-in-turkey"
                          text={t(
                            "navbar.megaMenu.immigration.items.hireWorkers.title",
                            {
                              defaultValue: "Hire Workers",
                            }
                          )}
                          description={t(
                            "navbar.megaMenu.immigration.items.hireWorkers.description",
                            {
                              defaultValue: "Workforce Recruitment Solutions",
                            }
                          )}
                        />
                        <MegaMenuItem
                          href="/immigration/turkey-residence-permit"
                          text={t("navbar.megaMenu.immigration.title", {
                            defaultValue: "Turkish Residence Permit",
                          })}
                          description={t(
                            "navbar.megaMenu.immigration.items.turkey.description",
                            { defaultValue: "Get your residence permit" }
                          )}
                        />
                        <MegaMenuItem
                          href="/work-permit"
                          text={t(
                            "navbar.megaMenu.immigration.items.workPermit.title",
                            {
                              defaultValue: "Work Permit",
                            }
                          )}
                          description={t(
                            "navbar.megaMenu.immigration.items.workPermit.description",
                            {
                              defaultValue: "Get your work permit",
                            }
                          )}
                        />
                        <MegaMenuItem
                          href="/turkey-citizenship"
                          text={t(
                            "navbar.megaMenu.immigration.items.citizenship.title",
                            {
                              defaultValue: "Turkish Citizenship",
                            }
                          )}
                          description={t(
                            "navbar.megaMenu.immigration.items.citizenship.description",
                            {
                              defaultValue: "Turkey Citizenship Service",
                            }
                          )}
                        />
                        <MegaMenuItem
                          href="/visa-e-invitations"
                          text={t(
                            "navbar.megaMenu.immigration.items.visaInvitations.title",
                            {
                              defaultValue: "Visa Invitations",
                            }
                          )}
                          description={t(
                            "navbar.megaMenu.immigration.items.visaInvitations.description",
                            {
                              defaultValue: "Visa Services",
                            }
                          )}
                        />
{/* Disabled: Company Registration page
                        <MegaMenuItem
                          href="/register-your-company"
                          text={t(
                            "navbar.megaMenu.immigration.items.companyRegistration.title",
                            {
                              defaultValue: "Company Registration",
                            }
                          )}
                          description={t(
                            "navbar.megaMenu.immigration.items.companyRegistration.description",
                            {
                              defaultValue: "Register a Company",
                            }
                          )}
                        />
*/}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jobs Link */}
              {/* <NavItem
                href="/visa-e-invitations"
                text={t('navbar.visa', { defaultValue: 'Visa & Invitation' })}
                active={activeItem === 'visa'}
                onClick={() => handleNavClick('visa')}
              /> */}
              <NavItem
                href="/job"
                text={t("navbar.jobs", { defaultValue: "Available Jobs" })}
                active={activeItem === "jobs"}
                onClick={() => handleNavClick("jobs")}
              />
              <NavItem
                href="/resume-generator"
                text={t("navbar.resumeGenerator", {
                  defaultValue: "Resume Generator",
                })}
                active={activeItem === "resume-generator"}
                onClick={() => handleNavClick("resume-generator")}
              />
            </div>

            {/* Right Section - Better balanced layout */}
            <div className="flex items-center space-x-4">
              {/* Partner Dropdown - Desktop Only */}
              <div
                className="relative hidden lg:block"
                onMouseEnter={() => setPartnerDropdownOpen(true)}
                onMouseLeave={() => setPartnerDropdownOpen(false)}
              >
                <button className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-300 rounded-md bg-gradient-to-r from-sky-600 to-sky-600 hover:from-sky-600 hover:to-sky-600 hover:scale-105 shadow-md">
                  <UserPlus size={14} className="mr-2" />
                  {t("navbar.partnerWithUs", {
                    defaultValue: "Partner with Us",
                  })}
                  <ChevronDown
                    size={12}
                    className={`ml-1 transition-transform duration-300 ${partnerDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`absolute right-0 bg-white rounded-lg shadow-xl top-full mt-2 w-48 transition-all duration-300 origin-top-right border border-gray-100 z-50 ${partnerDropdownOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}
                >
                  <div className="py-2">
                    <a
                      href="/partner/recruiter-agency"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-sky-50 hover:text-sky-600"
                    >
                      <Users size={14} className="mr-2" />
                      {t("navbar.recruitmentAgency", {
                        defaultValue: "Recruitment Agency",
                      })}
                    </a>
                    <a
                      href="/partner/job-provider"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-sky-50 hover:text-sky-600"
                    >
                      <Briefcase size={14} className="mr-2" />
                      {t("navbar.jobProvider", {
                        defaultValue: "Job Provider",
                      })}
                    </a>
                    {/* <a href="/partner/register-as-candidate" className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-sky-50 hover:text-sky-600">
                      <UserPlus size={14} className="mr-2" />
                      Candidates
                    </a> */}
                  </div>
                </div>
              </div>

              {/* Desktop Search Button */}
              <button
                onClick={toggleSearch}
                className="hidden p-2 transition-colors duration-300 rounded-full lg:block hover:bg-sky-100 text-sky-500"
                aria-label={t("navbar.search", { defaultValue: "Search" })}
              >
                <Search size={20} />
              </button>

              {/* Mobile Right Section */}
              <div className="flex items-center space-x-2 lg:hidden">
                {/* Mobile Language Switcher - More Compact */}
                <div className="flex-shrink-0 scale-75">
                  <LanguageSwitcher />
                </div>

                <button
                  onClick={toggleSearch}
                  className="p-1.5 transition-colors duration-300 rounded-full hover:bg-sky-100 text-sky-500"
                  aria-label={t("navbar.search", { defaultValue: "Search" })}
                >
                  <Search size={18} />
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={toggleMenu}
                  className="p-2 transition-colors duration-300 rounded-full hover:bg-sky-100 text-sky-600 bg-sky-50"
                  aria-label={t("navbar.toggleMenu", {
                    defaultValue: "Toggle Menu",
                  })}
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          searchOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSearchOpen(false)}
      >
        <div
          className={`bg-white p-6 transition-transform duration-300 ${
            searchOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="container relative mx-auto">
            <button
              onClick={toggleSearch}
              className="absolute p-2 text-gray-500 rounded-full right-4 top-4 hover:text-gray-700 hover:bg-gray-100"
              aria-label={t("navbar.closeSearch", {
                defaultValue: "Close Search",
              })}
            >
              <X size={24} />
            </button>
            <h3 className="mb-4 text-2xl font-semibold text-gray-800">
              {t("navbar.searchTitle", {
                defaultValue: "Search Jobs & Services",
              })}
            </h3>
            <div className="flex max-w-2xl">
              <input
                type="text"
                placeholder={t("navbar.searchPlaceholder", {
                  defaultValue: "Search for jobs, services...",
                })}
                className="flex-1 px-4 py-3 border-2 rounded-l-lg border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                autoFocus
              />
              <button className="px-6 py-3 text-white transition-colors rounded-r-lg bg-sky-500 hover:bg-sky-600">
                {t("navbar.searchButton", { defaultValue: "Search" })}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-50 transition-transform duration-500 ease-in-out lg:hidden transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        <div className="container px-4 pt-20 pb-8 mx-auto">
          {/* Close Button */}
          <button
            onClick={toggleMenu}
            className="absolute z-50 p-3 bg-white rounded-full shadow-lg top-4 right-4 text-sky-500 hover:bg-sky-50"
            aria-label={t("navbar.closeMenu", { defaultValue: "Close Menu" })}
          >
            <X size={24} />
          </button>

          {/* Mobile Logo */}
          <div className="absolute top-4 left-4">
            <img
              src="/logos/logo4.png"
              alt={t("labels.general.jobsAdmireLogo")}
              className="h-10"
            />
          </div>

          {/* Mobile Navigation Items */}
          <div className="mt-6 space-y-1">
            <MobileNavItem
              href="/about"
              text={t("navbar.about", { defaultValue: "About Us" })}
              active={activeItem === "about"}
              onClick={() => {
                handleNavClick("about");
                closeMenus();
              }}
            />

            {/* Services Section */}
            <div className="border-b border-gray-100">
              <button
                className="flex items-center justify-between w-full py-4 text-left"
                onClick={toggleMegaMenu}
              >
                <span
                  className={`text-lg ${activeItem === "services" ? "font-semibold text-sky-500" : "text-gray-700"}`}
                >
                  {t("navbar.services", { defaultValue: "Services" })}
                </span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${megaMenuOpen ? "rotate-180 text-sky-500" : "text-gray-400"}`}
                />
              </button>

              {/* Services Submenu */}
              <div
                className={`overflow-hidden transition-all duration-500 ${megaMenuOpen ? "max-h-screen pb-4" : "max-h-0"}`}
              >
                <div className="pl-4 space-y-6">
                  {/* Skill Services - Matching Desktop */}
                  <div>
                    <ul className="pl-6 space-y-3">
                      <MobileSubMenuItem
                        href="/hire-workers-in-turkey"
                        text={t(
                          "navbar.megaMenu.immigration.items.hireWorkers.title",
                          {
                            defaultValue: "Hire Workers",
                          }
                        )}
                      />
                      <MobileSubMenuItem
                        href="/visa-e-invitations"
                        text={t(
                          "navbar.megaMenu.immigration.items.visaInvitations.title",
                          {
                            defaultValue: "Visa Invitations",
                          }
                        )}
                      />
                      <MobileSubMenuItem
                        href="/work-permit"
                        text={t(
                          "navbar.megaMenu.immigration.items.workPermit.title",
                          {
                            defaultValue: "Turkish Work Permit",
                          }
                        )}
                      />
                      <MobileSubMenuItem
                        href="/immigration/turkey-residence-permit"
                        text={t("navbar.megaMenu.immigration.title", {
                          defaultValue: "Turkish Residence Permit",
                        })}
                      />
                      <MobileSubMenuItem
                        href="/turkey-citizenship"
                        text={t(
                          "navbar.megaMenu.immigration.items.citizenship.title",
                          {
                            defaultValue: "Turkish Citizenship",
                          }
                        )}
                      />
{/* Disabled: Company Registration page
                      <MobileSubMenuItem
                        href="/register-your-company"
                        text={t(
                          "navbar.megaMenu.immigration.items.companyRegistration.title",
                          {
                            defaultValue: "Company Registration",
                          }
                        )}
                      />
*/}
                      <MobileSubMenuItem
                        href="/resume-generator"
                        text={t("navbar.cv", {
                          defaultValue: "Resume Generator",
                        })}
                      />
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs Link */}
            <MobileNavItem
              href="/job"
              text={t("navbar.jobs", { defaultValue: "Available Jobs" })}
              active={activeItem === "jobs"}
              onClick={() => {
                handleNavClick("jobs");
                setIsMenuOpen(false);
              }}
            />
          </div>

          {/* Partner with Us - Mobile */}

          {/* Register Button - Mobile */}
          <div className="border-b border-gray-100">
            <button
              className="flex items-center justify-between w-full py-4 text-left"
              onClick={() => setPartnerDropdownOpen(!partnerDropdownOpen)}
            >
              <span className="text-lg font-medium text-gray-700">
                {t("navbar.partnerWithUs", { defaultValue: "Partner with Us" })}
              </span>
              <ChevronDown
                size={20}
                className={`transition-transform ${partnerDropdownOpen ? "rotate-180 text-sky-500" : "text-gray-400"}`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ${partnerDropdownOpen ? "max-h-screen pb-4" : "max-h-0"}`}
            >
              <div className="pl-4 space-y-3">
                <a
                  href="/partner/recruiter-agency"
                  className="flex items-center py-2 text-gray-600 transition-colors hover:text-sky-500"
                >
                  <Users size={16} className="mr-3" />
                  {t("navbar.recruitmentAgency", {
                    defaultValue: "Recruitment Agency",
                  })}
                </a>

                <a
                  href="/partner/job-provider"
                  className="flex items-center py-2 text-gray-600 transition-colors hover:text-sky-500"
                >
                  <Briefcase size={16} className="mr-3" />
                  {t("navbar.jobProvider", { defaultValue: "Job Provider" })}
                </a>

                {/* <a href="/partner/register-as-candidate" className="flex items-center py-2 text-gray-600 transition-colors hover:text-sky-500">
        <UserPlus size={16} className="mr-3" />
        Candidates
      </a> */}
              </div>
            </div>
          </div>

          {/* Contact Info - Mobile */}
          <div className="mt-8 space-y-4">
            <div className="space-y-2">
              <a
                href="tel:+905011240340"
                className="flex items-center text-gray-700 transition-colors hover:text-sky-500"
              >
                <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-sky-100 text-sky-500">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">
                    {t("navbar.candidateHRCompanies", {
                      defaultValue: "Candidate & HR Companies",
                    })}
                  </div>
                  <div className="font-medium">+90 501 124 03 40</div>
                </div>
              </a>

              <a
                href="tel:+905533832549"
                className="flex items-center text-gray-700 transition-colors hover:text-sky-500"
              >
                <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-sky-100 text-sky-500">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">
                    {t("navbar.jobProvider", { defaultValue: "Job Provider" })}
                  </div>
                  <div className="font-medium">+90 553 383 2549</div>
                </div>
              </a>
            </div>
            <a
              href={EMAIL_URL}
              className="flex items-center text-gray-700 transition-colors hover:text-sky-500"
            >
              <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-sky-100 text-sky-500">
                <Mail size={18} />
              </div>
              <span>{EMAIL_URL.replace("mailto:", "")}</span>
            </a>
            <div className="flex items-center text-gray-700">
              <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-sky-100 text-sky-500">
                <MapPin size={18} />
              </div>
              <span>
                {t("navbar.location", { defaultValue: "Istanbul, Turkey" })}
              </span>
            </div>
          </div>

          {/* Social Media Icons - Mobile */}
          <div className="pt-6 mt-8 border-t border-gray-100">
            <p className="mb-4 text-sm text-center text-gray-500">
              {t("navbar.mobile.connectWithUs", {
                defaultValue: "Connect with us",
              })}
            </p>
            <div className="flex justify-center space-x-4">
              <SocialIcon href={FACEBOOK_URL} icon={<Facebook size={18} />} />
              <SocialIcon href={INSTAGRAM_URL} icon={<Instagram size={18} />} />
              <SocialIcon href={LINKEDIN_URL} icon={<Linkedin size={18} />} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Desktop Navigation Item
const NavItem = ({ href, text, active, onClick }) => (
  <a
    href={href}
    onClick={(e) => {
      onClick();
      // Remove the immediate navigation for better UX
      // window.location.href = href;
    }}
    className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
      active
        ? "bg-sky-600 text-white shadow-md"
        : "text-gray-700 hover:bg-sky-600 hover:text-white"
    }`}
  >
    {text}
  </a>
);

// Mega Menu Item with description
const MegaMenuItem = ({ href, text, description }) => (
  <li>
    <a href={href} className="block group">
      <div className="font-medium text-gray-700 transition-colors duration-200 group-hover:text-sky-500">
        {text}
      </div>
      {description && (
        <p className="text-sm text-gray-500 transition-colors duration-200 group-hover:text-sky-400">
          {description}
        </p>
      )}
    </a>
  </li>
);

// Mobile Navigation Item
const MobileNavItem = ({ href, text, active, onClick }) => (
  <a
    href={href}
    onClick={(e) => {
      onClick();
      // Remove the immediate navigation for better UX
      // window.location.href = href;
    }}
    className={`flex items-center justify-between py-4 border-b border-gray-100 transition-colors ${
      active ? "text-sky-500 font-medium" : "text-gray-700 hover:text-sky-500"
    }`}
  >
    <span>{text}</span>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>}
  </a>
);

// Mobile Submenu Item
const MobileSubMenuItem = ({ href, text }) => (
  <li>
    <a
      href={href}
      className="flex items-center space-x-2 py-1.5 text-gray-600 transition-all hover:text-sky-500 hover:translate-x-1"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-sky-200"></div>
      <span>{text}</span>
    </a>
  </li>
);

// Social Media Icon - Regular
const SocialIcon = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-sky-100 text-sky-500 hover:bg-sky-500 hover:text-white hover:scale-105"
  >
    {icon}
  </a>
);

// Social Media Icon - Top bar (smaller)
const SocialIconTop = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-6 h-6 transition-all duration-300 text-white/80 hover:text-white hover:scale-110"
  >
    {icon}
  </a>
);

export default Navbar;
