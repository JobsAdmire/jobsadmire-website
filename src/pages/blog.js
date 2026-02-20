import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { showSuccess, showError, showWarning } from "@/lib/utils/toast";
import { env } from "@/lib/constants/env";

// Import translation files for all 7 languages
import enTranslations from "../../public/locales/en/blogpage.json";
import trTranslations from "../../public/locales/tr/blogpage.json";
import frTranslations from "../../public/locales/fr/blogpage.json";
import deTranslations from "../../public/locales/de/blogpage.json";
import arTranslations from "../../public/locales/ar/blogpage.json";
import ruTranslations from "../../public/locales/ru/blogpage.json";
import faTranslations from "../../public/locales/fa/blogpage.json";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [isSticky, setIsSticky] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { locale } = router;

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "fr":
        return frTranslations;
      case "de":
        return deTranslations;
      case "ar":
        return arTranslations;
      case "ru":
        return ruTranslations;
      case "fa":
        return faTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  // Categories for filtering - keep English values for API filtering
  const categoriesForAPI = [
    "All",
    "Career Tips",
    "Immigration Guide",
    "Job Search",
    "Work Visa",
    "Success Stories",
  ];

  // Translated categories for display
  const categoriesForDisplay = [
    t.categories.all,
    t.categories.careerTips,
    t.categories.immigrationGuide,
    t.categories.jobSearch,
    t.categories.workVisa,
    t.categories.successStories,
  ];

  // API fetching function
  const fetchBlogs = async () => {
    console.log("Starting fetch...");
    try {
      setLoading(true);
      const response = await fetch(
        `${env.BLOG_API_URL}/blogs?v=${Date.now()}&website=jobsadmire`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API response:", data);
      console.log("Setting blogs with:", data.data);
      setBlogs(data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();

    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
      if (window.scrollY > document.body.scrollHeight * 0.7 && !isSubscribed) {
        setShowNewsletter(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSubscribed]);

  const handleCategoryChange = (displayCategory) => {
    // Find the corresponding English category for API filtering
    const displayIndex = categoriesForDisplay.indexOf(displayCategory);
    const apiCategory = categoriesForAPI[displayIndex];
    setActiveCategory(apiCategory);
    setVisiblePosts(6);
  };

  const handleRedirect = (slug) => {
    console.log("Redirecting to blog with slug:", slug);
    if (slug) {
      router.push(`/blog/${slug}`);
    } else {
      console.error("Blog slug is undefined");
    }
  };

  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + 6);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribed email:", email);
      setIsSubscribed(true);
      setShowNewsletter(false);
      setEmail("");
      showSuccess(t.alerts.subscriptionSuccess);
    }
  };

  const handleCloseNewsletter = () => {
    setShowNewsletter(false);
  };

  // Filter blogs by category and search term - use English categories for API filtering
  const filteredBlogs = blogs.filter(
    (blog) =>
      (activeCategory === "All" || blog.tags?.includes(activeCategory)) &&
      (searchTerm === "" ||
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  // Get featured blog for the current category
  const featuredBlog =
    filteredBlogs.find((blog) => blog.status === "featured") ||
    filteredBlogs[0];

  // Get remaining blogs (excluding featured)
  const regularBlogs = filteredBlogs
    .filter((blog) => blog !== featuredBlog)
    .slice(0, visiblePosts);

  // Check if we have more blogs to load
  const hasMoreBlogs = regularBlogs.length < filteredBlogs.length - 1;

  // Generate trending tags for job portal
  const trendingTags = [
    t.trendingTags.remoteJobs,
    t.trendingTags.workVisa,
    t.trendingTags.immigration,
    t.trendingTags.careerGrowth,
    t.trendingTags.jobInterview,
    t.trendingTags.resumeTips,
  ];

  // Loading state UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {t.loading.title}
            </h3>
            <p className="text-gray-600">{t.loading.description}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error && blogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-lg p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {t.error.title}
            </h3>
            <p className="text-gray-600 mb-6">{t.error.description}</p>
            <button
              onClick={fetchBlogs}
              className="px-8 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              {t.error.retryButton}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-sky-500 via-sky-500 to-sky-500 pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-5"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 mb-8 bg-white bg-opacity-10 backdrop-blur-md rounded-full border border-white border-opacity-20">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-medium text-white">
                {t.header.badge}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              {t.header.title.part1}
              <span className="block bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
                {t.header.title.part2}
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t.header.subtitle}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.header.searchPlaceholder}
                  className="w-full px-6 py-5 text-lg text-gray-800 bg-white rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-sky-500 focus:ring-opacity-50 pl-14"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-5 top-6 w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <button className="absolute right-3 top-3 px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                  {t.header.searchButton}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-auto"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* Blog Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Featured Article */}
        {featuredBlog && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-12 bg-gradient-to-b from-sky-500 to-sky-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                {t.featuredArticle.title.part1}{" "}
                <span className="text-sky-500">
                  {t.featuredArticle.title.part2}
                </span>
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-500">
              <div className="lg:flex">
                <div className="lg:w-1/2 relative">
                  <div className="aspect-[4/3] lg:aspect-auto lg:h-full relative overflow-hidden branded-image-container">
                    <img
                      src={
                        featuredBlog.featuredImage || "/images/placeholder.jpg"
                      }
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="brand-overlay"></div>
                    <div className="absolute top-6 left-6 z-10">
                      <span className="px-4 py-2 bg-sky-500 text-white rounded-full text-sm font-semibold">
                        {(featuredBlog.tags && featuredBlog.tags[0]) ||
                          t.featuredArticle.defaultTag}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          {`${Math.ceil(featuredBlog.content?.length / 1000) || 5} ${t.featuredArticle.minRead}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          {new Date(featuredBlog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                      {featuredBlog.title}
                    </h3>

                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                      {featuredBlog.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {featuredBlog.tags &&
                        featuredBlog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {(featuredBlog.author || "A")[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {featuredBlog.author || t.featuredArticle.anonymous}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t.featuredArticle.careerExpert}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRedirect(featuredBlog.slug)}
                      className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-500 transition-colors font-semibold shadow-lg hover:shadow-xl"
                    >
                      {t.featuredArticle.readFullArticle}
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-2 h-12 bg-gradient-to-b from-sky-500 to-sky-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">
              {t.latestInsights.title.part1}{" "}
              <span className="text-sky-500">
                {t.latestInsights.title.part2}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularBlogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="relative branded-image-container">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={blog.featuredImage || "/images/placeholder.jpg"}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="brand-overlay"></div>
                  </div>

                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-sky-500 text-white rounded-full text-sm font-medium">
                      {(blog.tags && blog.tags[0]) ||
                        t.latestInsights.defaultTag}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 z-10">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{`${Math.ceil(blog.content?.length / 1000) || 5} ${t.latestInsights.min}`}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-sky-500 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags &&
                      blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {(blog.author || "A")[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {blog.author || t.latestInsights.anonymous}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRedirect(blog.slug)}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-sky-500 hover:text-white transition-colors font-medium text-sm"
                    >
                      {t.latestInsights.readMore}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {regularBlogs.length === 0 && searchTerm && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {t.emptyState.title}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {t.emptyState.description.replace("{searchTerm}", searchTerm)}
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-500 transition-colors font-semibold"
              >
                {t.emptyState.clearSearch}
              </button>
            </div>
          )}

          {/* Load More Button */}
          {hasMoreBlogs && regularBlogs.length > 0 && (
            <div className="text-center mt-16">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-sky-500 border-2 border-sky-500 rounded-xl hover:bg-sky-500 hover:text-white transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                {t.loadMore.button}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Popup */}
      {showNewsletter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <button
              onClick={handleCloseNewsletter}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5"
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

            <div className="bg-gradient-to-r from-sky-500 to-sky-500 p-8 text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.newsletter.title}</h3>
              <p className="text-blue-100">{t.newsletter.description}</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.newsletter.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t.newsletter.emailPlaceholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-500 transition-colors font-semibold shadow-lg hover:shadow-xl"
                >
                  {t.newsletter.subscribeButton}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  🔒 {t.newsletter.privacyNote}
                </p>
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
                  <span>✓ {t.newsletter.features.careerTips}</span>
                  <span>✓ {t.newsletter.features.visaUpdates}</span>
                  <span>✓ {t.newsletter.features.jobAlerts}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for Brand Overlay */}
      <style jsx>{`
        .branded-image-container {
          position: relative;
        }

        .brand-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
          background-image: url("/images/blogcover3.png");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* Optional: Add a subtle gradient overlay for better image visibility */
        .branded-image-container::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, 0) 70%,
            rgba(0, 0, 0, 0.1) 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        /* Ensure image is below overlay */
        .branded-image-container img {
          position: relative;
          z-index: 0;
        }
      `}</style>
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default BlogPage;
