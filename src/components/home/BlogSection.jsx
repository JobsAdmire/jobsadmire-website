import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  TrendingUp,
  Eye,
} from "lucide-react";
import { env } from "@/lib/constants/env";

// Import translation files for all 7 languages
import enTranslations from "../../../public/locales/en/blogcarousel.json";
import trTranslations from "../../../public/locales/tr/blogcarousel.json";
import frTranslations from "../../../public/locales/fr/blogcarousel.json";
import deTranslations from "../../../public/locales/de/blogcarousel.json";
import arTranslations from "../../../public/locales/ar/blogcarousel.json";
import ruTranslations from "../../../public/locales/ru/blogcarousel.json";
import faTranslations from "../../../public/locales/fa/blogcarousel.json";

export default function BlogCarousel() {
  const { locale } = useRouter();

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

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        console.log("Starting to fetch blogs...");

        let res;
        let data;

        try {
          res = await fetch(
            `${env.BLOG_API_URL}/blogs?v=${Date.now()}&website=jobsadmire`
          );
          if (res.ok) {
            data = await res.json();
          }
        } catch (e) {
          console.log("First endpoint failed, trying alternative...");
        }

        if (!data) {
          try {
            res = await fetch(
              `${env.BLOG_API_URL}/blogs?v=${Date.now()}&website=jobsadmire`
            );
            if (res.ok) {
              data = await res.json();
            }
          } catch (e) {
            console.log("Second endpoint failed, trying third...");
          }
        }

        if (!data) {
          res = await fetch(
            `${env.BLOG_API_URL}/blogs/list?v=${Date.now()}`
          );
          if (!res.ok) {
            throw new Error(
              `Failed to fetch blogs: ${res.status} ${res.statusText}`
            );
          }
          data = await res.json();
        }

        console.log("Raw API response:", data);

        let blogsArray = [];
        if (Array.isArray(data)) {
          blogsArray = data;
        } else if (data && data.blogs && Array.isArray(data.blogs)) {
          blogsArray = data.blogs;
        } else if (data && data.data && Array.isArray(data.data)) {
          blogsArray = data.data;
        } else if (data && typeof data === "object") {
          const arrayProperty = Object.values(data).find((value) =>
            Array.isArray(value)
          );
          if (arrayProperty) {
            blogsArray = arrayProperty;
          }
        }

        setBlogs(blogsArray.slice(0, 6));
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length <= 1 || !isAutoPlaying) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === blogs.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [blogs.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === blogs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? blogs.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
  };

  const resumeAutoPlay = () => {
    setIsAutoPlaying(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return t.readTime?.defaultMinutes ?? "5 min";
    const plainText = content.replace(/<[^>]*>/g, "");
    const words = plainText.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    const suffix = t.readTime?.suffix ?? "min read";
    return `${minutes} ${suffix}`;
  };

  const truncateText = (text, maxLength = 140) => {
    if (!text) return "";
    const plainText = text.replace(/<[^>]*>/g, "");
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  };

  if (loading) {
    return (
      <section className="relative py-12 overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative px-6 mx-auto max-w-5xl lg:px-8">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4 overflow-hidden rounded-full bg-gradient-to-r from-sky-400 to-blue-500 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 animate-spin"></div>
              <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text mb-1 leading-tight">
              {t.loading.title}
            </h3>

            <p className="text-slate-600 text-base leading-snug">
              {t.loading.description}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-12 overflow-hidden bg-gradient-to-br from-red-50 via-rose-50/30 to-pink-50">
        <div className="relative px-6 mx-auto max-w-7xl lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="p-6 text-center bg-white/80 backdrop-blur-sm border border-red-100 rounded-3xl shadow-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-red-400 to-rose-500 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-800 leading-tight">
                {t.error.title}
              </h3>
              <p className="mb-4 text-red-600 leading-snug text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 font-semibold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
              >
                {t.error.button}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <section className="relative py-12 overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50/30 to-orange-50">
        <div className="relative px-6 mx-auto max-w-7xl lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="p-6 text-center bg-white/80 backdrop-blur-sm border border-amber-100 rounded-3xl shadow-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-800 leading-tight">
                {t.empty.title}
              </h3>
              <p className="text-slate-600 leading-snug text-sm">
                {t.empty.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!mounted) return null;

  return (
    <section className="relative py-12 overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50/20 to-blue-50/30">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-sky-300 to-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-gradient-to-r from-indigo-300 to-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float-delayed"></div>
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-cyan-300 to-sky-400 rounded-full mix-blend-multiply filter blur-xl animate-float-slow"></div>
      </div>

      <div className="relative px-5 mx-auto max-w-7xl lg:px-5">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
              {t.header.title.line1}
            </span>
          </h2>

          <br></br>
          <p className="max-w-3xl mx-auto text-base text-slate-600 leading-snug md:text-lg">
            {t.header.description}
          </p>
        </div>

        <div
          className="relative group"
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >
          <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/70 backdrop-blur-sm border border-white/20">
            <div
              className="flex transition-all duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {blogs.map((blog, index) => (
                <div key={blog.id || index} className="flex-shrink-0 w-full">
                  <div className="grid gap-8 p-6 lg:grid-cols-2 lg:gap-10 items-center min-h-[300px]">
                    <div className="flex flex-col justify-center space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-100 to-blue-100 border border-sky-200/50">
                          <Calendar size={14} className="mr-1.5 text-sky-600" />
                          <span className="text-xs font-semibold text-sky-700 leading-none">
                            {formatDate(blog.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200/50">
                          <Clock
                            size={14}
                            className="mr-1.5 text-emerald-600"
                          />
                          <span className="text-xs font-semibold text-emerald-700 leading-none">
                            {calculateReadTime(blog.content)}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-800 lg:text-2xl xl:text-3xl leading-tight">
                        {blog.title}
                      </h3>

                      <p className="text-base text-slate-600 leading-snug lg:text-lg">
                        {truncateText(blog.excerpt || blog.content)}
                      </p>

                      <div className="pt-1">
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="inline-flex items-center px-6 py-3 font-bold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 hover:shadow-xl shadow-lg group/btn text-sm"
                        >
                          <span className="mr-2">{t.blog.readMore}</span>
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover/btn:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>

                    <div className="order-first lg:order-last">
                      <div className="relative group/img">
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl blur-lg opacity-25 group-hover/img:opacity-40 transition-opacity duration-300"></div>
                        <div className="relative overflow-hidden rounded-2xl transform transition-transform duration-500 group-hover/img:scale-105 branded-image-container">
                          <img
                            src={blog.featuredImage || "/images/journey.svg"}
                            alt={blog.title}
                            className="object-cover w-full h-64 lg:h-80 xl:h-[320px]"
                          />
                          <div className="brand-overlay"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                          {blog.tags && blog.tags.length > 0 && (
                            <div className="absolute top-4 left-4 z-10">
                              <span className="px-3 py-1.5 text-xs font-bold text-white rounded-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg backdrop-blur-sm leading-none">
                                {blog.tags[0]}
                              </span>
                            </div>
                          )}

                          <div className="absolute bottom-4 right-4 z-10">
                            <div className="flex items-center px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
                              <Eye
                                size={12}
                                className="mr-1.5 text-slate-600"
                              />
                              <span className="text-xs font-semibold text-slate-700 leading-none">
                                {t.blog.featured}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {blogs.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-xl border border-white/20 text-slate-700 hover:text-sky-600 hover:bg-white transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                aria-label={t.navigation.previous}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-xl border border-white/20 text-slate-700 hover:text-sky-600 hover:bg-white transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                aria-label={t.navigation.next}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {blogs.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {blogs.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 w-10 shadow-lg"
                    : "bg-slate-300 hover:bg-slate-400 w-2.5"
                }`}
                aria-label={`${t.navigation.goTo} ${index + 1}`}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-3.5 font-bold text-slate-700 transition-all duration-300 border-2 rounded-full border-slate-200 hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 transform hover:scale-105 hover:shadow-lg group/all bg-white/70 backdrop-blur-sm text-sm"
          >
            <TrendingUp size={18} className="mr-2 text-sky-600" />
            <span>{t.viewAll.text}</span>
            <ArrowRight
              size={16}
              className="ml-2 transition-transform duration-300 group-hover/all:translate-x-1"
            />
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(90deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
          animation-delay: 4s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .branded-image-container {
          position: relative;
          overflow: hidden;
        }

        .brand-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
          background-image: url("/images/blogcover.png");
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
        }

        .branded-image-container img {
          position: relative;
          z-index: 0;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
