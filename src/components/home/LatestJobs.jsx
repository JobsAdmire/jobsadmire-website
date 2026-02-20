import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import {
  MapPin,
  ChevronRight,
  ArrowRight,
  Briefcase,
  Search,
  Sliders,
  Building,
  Star,
  Filter,
  X,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import axios from "axios";
import { env } from "@/lib/constants/env";

const JobBoard = () => {
  const { t } = useTranslation("common");
  // const initialJobs = [
  //   {
  //     id: 1,
  //     title: "Digital Marketing Executive",
  //     location: "Karachi",
  //     salary: "PKR 80000 - PKR 120000",
  //     position: "Full Time",
  //     currency: "PKR",
  //     company: "TechVista Inc.",
  //     featured: true,
  //     category: "Marketing",
  //     experience: "2-3 years",
  //     posted: "2 days ago",
  //   },
  //   {
  //     id: 2,
  //     title: "Junior SEO Executive",
  //     location: "Karachi",
  //     salary: "$ 40000 - $ 60000",
  //     position: "Part Time",
  //     currency: "$",
  //     company: "Global Search Experts",
  //     featured: false,
  //     category: "SEO",
  //     experience: "1-2 years",
  //     posted: "1 week ago",
  //   },
  //   {
  //     id: 3,
  //     title: "Senior SEO Executive",
  //     location: "Karachi",
  //     salary: "TL 60000 - TL 90000",
  //     position: "Full Time",
  //     currency: "TL",
  //     company: "Strategy Digital",
  //     featured: true,
  //     category: "SEO",
  //     experience: "4-5 years",
  //     posted: "Just now",
  //   },
  //   {
  //     id: 4,
  //     title: "Senior PHP Developer",
  //     location: "Karachi",
  //     salary: "PKR 100000 - PKR 150000",
  //     position: "Contract",
  //     currency: "PKR",
  //     company: "CodeCraft Solutions",
  //     featured: false,
  //     category: "Development",
  //     experience: "5+ years",
  //     posted: "3 days ago",
  //   },
  // ];

  // initialJobs
  const [jobs, setJobs] = useState([]);
  const [jobCategory, setCategory] = useState([]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    position: "All",
    experience: "All",
    featured: false,
  });

  const categories = ["All", "Marketing", "SEO", "Development"];
  const positions = ["All", "Full Time", "Part Time", "Contract", "Freelance"];
  const experiences = [
    "All",
    "0-1 years",
    "1-2 years",
    "2-3 years",
    "4-5 years",
    "5+ years",
  ];

  useEffect(() => {
    fetchJobCategories();
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `${env.CRM_API_URL}/api/get-jobs?v=${Date.now()}&page=1&per_page=4`
      );
      setJobs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to fetch posts. Please try again.",
      //   variant: "destructive"
      // });
    } finally {
      // setIsLoading(false);
    }
  };

  const fetchJobCategories = async () => {
    try {
      const response = await axios.get(
        `${env.CRM_API_URL}/api/get-categories?v=${Date.now()}`
      );

      const cat_data = response.data.data.reduce((acc, cat) => {
        acc[cat.id] = cat;
        return acc;
      }, {});

      setCategory(cat_data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to fetch posts. Please try again.",
      //   variant: "destructive"
      // });
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    filterJobs();
  }, [searchTerm, activeCategory, filters]);

  const filterJobs = () => {
    let filteredJobs = [...jobs];

    // Filter by search term
    if (searchTerm) {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (activeCategory !== "All") {
      filteredJobs = filteredJobs.filter(
        (job) => job.category === activeCategory
      );
    }

    // Filter by position
    if (filters.position !== "All") {
      filteredJobs = filteredJobs.filter(
        (job) => job.position === filters.position
      );
    }

    // Filter by experience
    if (filters.experience !== "All") {
      filteredJobs = filteredJobs.filter(
        (job) => job.experience === filters.experience
      );
    }

    // Filter by featured
    if (filters.featured) {
      filteredJobs = filteredJobs.filter((job) => job.featured);
    }

    setJobs(filteredJobs);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveCategory("All");
    setFilters({
      position: "All",
      experience: "All",
      featured: false,
    });
  };

  return (
    <div className="p-6 font-sans bg-gradient-to-br from-sky-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with animated gradient */}
        <div className="relative mb-10 text-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-200 to-blue-200 blur-3xl opacity-20"></div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
              {t("jobsInDemand.title", { defaultValue: "Jobs In Demand" })}
            </span>
          </h2>
          <br></br>
          <p className="relative max-w-3xl mx-auto text-gray-600">
            {t("jobsInDemand.description", {
              defaultValue:
                "Search all the open 100+ positions on the web. Get your own personalized salary estimate. Read reviews on over 30+ companies worldwide.",
            })}
          </p>
        </div>

        {/* Search Bar */}

        {/* Category Filter */}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-medium text-gray-600">
            {t("jobsInDemand.showingJobs", { defaultValue: "Showing" })}{" "}
            <span className="text-sky-600">{jobs.length}</span>{" "}
            {t("jobsInDemand.jobs", { defaultValue: "jobs" })}
          </p>

          {/* Active filters */}
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800">
                "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="ml-1">
                  <X size={12} />
                </button>
              </span>
            )}
            {activeCategory !== "All" && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800">
                {t(`labels.jobs.${activeCategory.toLowerCase()}`, { defaultValue: activeCategory })}
                <button
                  onClick={() => setActiveCategory("All")}
                  className="ml-1"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.position !== "All" && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800">
                {t(`labels.jobs.${filters.position.toLowerCase().replace(/\s+/g, '')}`, { defaultValue: filters.position })}
                <button
                  onClick={() => setFilters({ ...filters, position: "All" })}
                  className="ml-1"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Job Listings */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`bg-white rounded-xl overflow-hidden transition-all duration-300 group hover:shadow-xl ${
                  job.featured
                    ? "ring-2 ring-sky-400 shadow-lg"
                    : "border border-sky-100 shadow-sm"
                }`}
              >
                {job.featured && (
                  <div className="bg-gradient-to-r from-sky-500 to-blue-600 py-1.5 px-4 text-xs font-medium text-white flex items-center justify-center">
                    <Star size={12} className="mr-1 fill-white" />{" "}
                    {t("jobsInDemand.featured", {
                      defaultValue: "Featured Opportunity",
                    })}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 mt-1 rounded-lg shadow-sm bg-gradient-to-br from-sky-100 to-blue-100">
                      <Building size={20} className="text-sky-600" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-500">
                          {job.company}
                        </h4>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="flex items-center text-xs text-gray-400">
                          <Clock size={12} className="mr-1" /> {job.posted}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 transition-colors group-hover:text-sky-600">
                        {job.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="flex items-center px-3 py-1 text-xs font-medium rounded-full bg-sky-50 text-sky-700">
                      <Briefcase size={12} className="mr-1" /> {job.position}
                    </span>
                    <span className="flex items-center px-3 py-1 text-xs font-medium rounded-full bg-sky-50 text-sky-700">
                      <MapPin size={12} className="mr-1" /> {job.location}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
                      {jobCategory[job.category_id]?.title ?? ""}
                    </span>
                  </div>

                  <div className="p-4 mb-5 rounded-lg bg-gradient-to-r from-sky-50 to-blue-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="flex items-center mb-1 text-xs font-medium text-gray-500 uppercase">
                          {t("jobsInDemand.salaryRange", {
                            defaultValue: "Salary Range",
                          })}
                        </p>
                        <p className="font-semibold text-gray-800">
                          {job.currency}- {job.salary_start} - {job.salary_end}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center mb-1 text-xs font-medium text-gray-500 uppercase">
                          <Calendar size={12} className="mr-1" />{" "}
                          {t("jobsInDemand.experience", {
                            defaultValue: "Experience",
                          })}
                        </p>
                        <p className="font-semibold text-gray-800">
                          {job.experience}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button className="flex items-center text-sm text-gray-500 transition-colors hover:text-sky-600">
                      {t("jobsInDemand.saveForLater", {
                        defaultValue: "Save for later",
                      })}
                    </button>
                    <a href={`/job-detail/${job.job_id}`}>
                      <button className="flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-600 group-hover:bg-sky-600 group-hover:text-white">
                        {t("jobsInDemand.viewDetails", {
                          defaultValue: "View Details",
                        })}
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-sky-50">
              <Search size={24} className="text-sky-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              {t("jobsInDemand.noJobsFound", { defaultValue: "No jobs found" })}
            </h3>
            <p className="mb-6 text-gray-600">
              {t("jobsInDemand.tryAdjusting", {
                defaultValue: "Try adjusting your search or filter criteria",
              })}
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 font-medium text-white transition-colors rounded-lg bg-sky-600 hover:bg-sky-700"
            >
              {t("jobsInDemand.clearAllFilters", {
                defaultValue: "Clear All Filters",
              })}
            </button>
          </div>
        )}

        {/* See More Button */}
        {jobs.length > 0 && (
          <div className="mt-12 text-center">
            <a href="/job">
              <button className="inline-flex items-center px-8 py-3 font-medium text-white transition-all bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl hover:shadow-lg">
                {t("jobsInDemand.seeMoreJobs", {
                  defaultValue: "See More Jobs",
                })}
                <ArrowRight size={16} className="ml-2" />
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;
