import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { showSuccess, showError, showWarning } from "@/lib/utils/toast";
import {
  Calendar,
  Clock,
  Bookmark,
  Share2,
  Award,
  BookOpen,
} from "lucide-react";
import "react-quill/dist/quill.snow.css";
import Head from "next/head";
import BlogCarousel from "@components/home/BlogSection";
import { env } from "@/lib/constants/env";

export default function BlogDetail() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableOfContents, setTableOfContents] = useState([]);

  useEffect(() => {
    if (!slug) return; // Wait until slug is available from router

    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        // Use your API endpoint for fetching blog by slug
        const res = await fetch(
          `${env.BLOG_API_URL}/blogs/view-data/slug/${slug}?v=${Date.now()}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch blog: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched blog detail:", data);
        setBlog(data);

        // Extract headings for table of contents
        extractTableOfContents(data.content);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [slug]);

  // Function to extract headings from content for table of contents
  const extractTableOfContents = (content) => {
    if (!content) return;

    try {
      // Improved regex to extract h2/h3 tags from content
      const headings = [];
      const regex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/g;
      let match;

      while ((match = regex.exec(content)) !== null) {
        const headingText = match[1].replace(/<[^>]*>/g, ""); // Remove any HTML tags inside heading
        const headingId = headingText.toLowerCase().replace(/[^\w]+/g, "-"); // Create an ID for anchor links

        headings.push({
          title: headingText,
          id: headingId,
        });
      }

      setTableOfContents(headings);
    } catch (err) {
      console.error("Error extracting table of contents:", err);
    }
  };

  // Process content to preserve HTML formatting
  const processContent = (content) => {
    if (!content) return "";

    // Parse the content as HTML without manipulating the actual structure
    // First, add IDs to headings for TOC links
    let processedContent = content.replace(
      /<(h[2-3])>(.*?)<\/\1>/g,
      (match, tag, text) => {
        const id = text.toLowerCase().replace(/[^\w]+/g, "-");
        return `<${tag} id="${id}" class="mt-8 mb-4 text-2xl font-bold text-sky-800">${text}</${tag}>`;
      }
    );

    // IMPORTANT: We're now preserving the original HTML structure
    // instead of trying to manipulate it with regex replacements

    // Only add styling for basic elements without changing structure
    processedContent = processedContent.replace(
      /<p>/g,
      '<p class="mb-6 text-gray-700 leading-relaxed">'
    );
    processedContent = processedContent.replace(
      /<ul>/g,
      '<ul class="mb-6 pl-5 list-disc space-y-2 text-gray-700">'
    );
    processedContent = processedContent.replace(
      /<ol>/g,
      '<ol class="mb-6 pl-5 list-decimal space-y-2 text-gray-700">'
    );
    processedContent = processedContent.replace(
      /<a /g,
      '<a class="text-sky-600 hover:text-sky-800 underline" '
    );
    processedContent = processedContent.replace(
      /<blockquote>/g,
      '<blockquote class="p-4 my-6 border-l-4 border-sky-500 bg-sky-50 text-gray-700 italic">'
    );
    processedContent = processedContent.replace(
      /<pre>/g,
      '<pre class="p-4 mb-6 bg-gray-100 rounded-lg overflow-x-auto">'
    );
    processedContent = processedContent.replace(
      /<code>/g,
      '<code class="font-mono text-sm">'
    );
    processedContent = processedContent.replace(
      /<img /g,
      '<img class="rounded-lg shadow-md my-6 max-w-full h-auto" '
    );

    return processedContent;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate read time (approx 200 words per minute)
  const calculateReadTime = (content) => {
    if (!content) return "5 min";

    const plainText = content.replace(/<[^>]*>/g, "");
    const words = plainText.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} ${t("labels.blogDetail.minRead", { defaultValue: "min read" })}`;
  };

  // Handle share button click
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // Fallback - copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      showSuccess(t("labels.blogDetail.linkCopied", { defaultValue: "Link copied to clipboard!" }));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-t-4 rounded-full border-sky-600 border-t-transparent animate-spin"></div>
            <p className="text-xl font-medium text-sky-800">{t("labels.blogDetail.loadingBlog", { defaultValue: "Loading blog..." })}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md p-8 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-500"
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
            <h3 className="mb-2 text-xl font-bold text-center text-gray-800">
              {t("labels.blogDetail.errorLoadingBlog", { defaultValue: "Error Loading Blog" })}
            </h3>
            <p className="mb-4 text-center text-gray-600">{error}</p>
            <button
              onClick={() => router.push("/blog")}
              className="w-full px-4 py-2 text-white transition-colors rounded-lg bg-sky-600 hover:bg-sky-700"
            >
              {t("labels.blogDetail.backToBlogs", { defaultValue: "Back to Blogs" })}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Blog not found
  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md p-8 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 01.56.56M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-center text-gray-800">
              {t("labels.blogDetail.blogNotFound", { defaultValue: "Blog Not Found" })}
            </h3>
            <p className="mb-4 text-center text-gray-600">
              {t("labels.blogDetail.blogNotFoundMessage", { defaultValue: "The blog you're looking for could not be found." })}
            </p>
            <button
              onClick={() => router.push("/blog")}
              className="w-full px-4 py-2 text-white transition-colors rounded-lg bg-sky-600 hover:bg-sky-700"
            >
              {t("labels.blogDetail.backToBlogs", { defaultValue: "Back to Blogs" })}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Head>
        <title>{blog.seo?.metaTitle || blog.title}</title>
        <meta
          name="description"
          content={blog.seo?.metaDescription || blog.excerpt}
        />
        <meta name="keywords" content={blog.seo?.focusKeyword || ""} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={blog.seo?.metaTitle || blog.title} />
        <meta
          property="og:description"
          content={blog.seo?.metaDescription || blog.excerpt}
        />
        <meta property="og:type" content="website" />
      </Head>

      {/* Hero Section */}
      <header className="px-5 pt-8 pb-4 mx-auto md:px-10 max-w-7xl">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4 space-x-2 text-sky-600">
            <Award size={20} />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {blog.tags && blog.tags.length > 0
                ? blog.tags[0]
                : "Educational Opportunities"}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold text-center text-transparent sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-sky-800 to-sky-500 bg-clip-text">
            {blog.title}
          </h1>

          <div className="flex items-center mb-6 space-x-4 text-sky-700">
            <div className="flex items-center text-sm">
              <Calendar size={16} className="mr-1" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock size={16} className="mr-1" />
              <span>{calculateReadTime(blog.content)}</span>
            </div>
          </div>

          <div className="flex mb-8 space-x-4">
            <button className="flex items-center px-3 py-1 space-x-2 transition border rounded-full text-sky-700 hover:text-sky-500 border-sky-200 bg-sky-50 hover:bg-sky-100">
              <Bookmark size={16} />
              <span className="text-sm font-medium">{t("labels.blogDetail.save", { defaultValue: "Save" })}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center px-3 py-1 space-x-2 transition border rounded-full text-sky-700 hover:text-sky-500 border-sky-200 bg-sky-50 hover:bg-sky-100"
            >
              <Share2 size={16} />
              <span className="text-sm font-medium">{t("labels.blogDetail.share", { defaultValue: "Share" })}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {/* Hero Image */}
      <div className="px-5 mx-auto mb-12 md:px-10 max-w-7xl">
        <div className="overflow-hidden border shadow-lg rounded-2xl border-sky-100 branded-image-container">
          <img
            src={blog.featuredImage || "/images/journey.svg"}
            alt={`${blog.title} illustration`}
            className="object-cover w-full h-auto"
          />
          <div className="brand-overlay"></div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-5 pb-20 mx-auto max-w-7xl md:px-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="prose prose-lg max-w-none">
              <div className="p-8 mb-12 bg-white border shadow-sm rounded-2xl border-sky-100">
                {/* Introduction */}
                <h2 className="mb-4 text-2xl font-bold md:text-3xl text-sky-800">
                  {t("labels.blogDetail.introduction", { defaultValue: "Introduction" })}
                </h2>
                <div className="w-20 h-1 mb-6 rounded-full bg-sky-500"></div>

                {/* Blog Content with Enhanced Styling */}
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{
                    __html: processContent(blog.content),
                  }}
                />

                {/* Advice Section */}
                <div className="pt-10 border-t border-sky-100">
                  <h2 className="mb-4 text-2xl font-bold md:text-3xl text-sky-800">
                    {t("labels.blogDetail.conclusion", { defaultValue: "Conclusion" })}
                  </h2>
                  <div className="w-20 h-1 mb-6 rounded-full bg-sky-500"></div>

                  {/* If there's no explicit conclusion, we use the last part of content or a default */}
                  <div className="p-5 rounded-lg shadow-sm bg-gradient-to-br from-sky-100 to-sky-50">
                    <p className="text-lg text-gray-600">
                      {t("labels.blogDetail.thankYouMessage", { defaultValue: "Thank you for reading this article. We hope you found it informative and valuable." })}
                    </p>
                  </div>
                </div>

                {/* Author Information */}
                {blog.author && (
                  <div className="flex items-center p-6 mt-10 border rounded-lg border-sky-100 bg-sky-50">
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {t("labels.blogDetail.writtenBy", { defaultValue: "Written by:" })} {blog.author}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("labels.blogDetail.publishedOn", { defaultValue: "Published on" })} {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              {/* Table of Contents */}
              <div className="p-6 mb-8 bg-white border shadow-sm rounded-2xl border-sky-100">
                <h3 className="mb-4 text-lg font-bold text-sky-800">
                  {t("labels.blogDetail.tableOfContents", { defaultValue: "Table of Contents" })}
                </h3>
                <ul className="space-y-2">
                  {/* Always include Introduction */}
                  <li>
                    <a
                      href="#"
                      className="transition text-sky-600 hover:text-sky-800"
                    >
                      {t("labels.blogDetail.introduction", { defaultValue: "Introduction" })}
                    </a>
                  </li>

                  {/* Dynamic headings from content */}
                  {tableOfContents.length > 0 ? (
                    tableOfContents.map((heading, index) => (
                      <li key={index}>
                        <a
                          href={`#${heading.id}`}
                          className="transition text-sky-600 hover:text-sky-800"
                        >
                          {heading.title}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li>
                      <a
                        href="#"
                        className="transition text-sky-600 hover:text-sky-800"
                      >
                        {t("labels.blogDetail.content", { defaultValue: "Content" })}
                      </a>
                    </li>
                  )}

                  {/* Always include Conclusion */}
                  <li>
                    <a
                      href="#"
                      className="transition text-sky-600 hover:text-sky-800"
                    >
                      {t("labels.blogDetail.conclusion", { defaultValue: "Conclusion" })}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Newsletter Signup */}
              <div className="p-6 mb-8 border shadow-sm bg-gradient-to-b from-sky-100 to-sky-50 rounded-2xl border-sky-100">
                <h3 className="mb-2 text-lg font-bold text-sky-800">
                  {t("labels.blogDetail.stayUpdated", { defaultValue: "Stay Updated" })}
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  {t("labels.blogDetail.newsletterDescription", { defaultValue: "Get the latest scholarship opportunities delivered to your inbox" })}
                </p>
                <input
                  type="email"
                  placeholder={t("labels.blogCards.enterYourEmail")}
                  className="w-full px-4 py-2 mb-2 border rounded-lg border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
                <button className="w-full px-4 py-2 font-medium text-white transition rounded-lg bg-sky-600 hover:bg-sky-700">
                  {t("labels.blogDetail.subscribe", { defaultValue: "Subscribe" })}
                </button>
              </div>

              {/* Related Blogs */}
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-sky-100">
                <h3 className="mb-4 text-lg font-bold text-sky-800">
                  {t("labels.blogDetail.relatedArticles", { defaultValue: "Related Articles" })}
                </h3>
                <ul className="space-y-4">
                  {blog.tags &&
                    blog.tags.map((tag, index) => (
                      <li key={index}>
                        <a
                          href={`/blog?tag=${tag}`}
                          className="flex items-start p-2 transition rounded-lg hover:bg-sky-50"
                        >
                          <span className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 rounded-full bg-sky-100 text-sky-600">
                            <BookOpen size={16} />
                          </span>
                          <span className="text-sm text-sky-700">
                            {t("labels.blogDetail.moreArticlesAbout", { defaultValue: "More articles about" })} {tag}
                          </span>
                        </a>
                      </li>
                    ))}

                  {/* Default link if no tags */}
                  {(!blog.tags || blog.tags.length === 0) && (
                    <li>
                      <a
                        href="/blog"
                        className="flex items-start p-2 transition rounded-lg hover:bg-sky-50"
                      >
                        <span className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 rounded-full bg-sky-100 text-sky-600">
                          <BookOpen size={16} />
                        </span>
                        <span className="text-sm text-sky-700">
                          {t("labels.blogDetail.viewAllBlogPosts", { defaultValue: "View all blog posts" })}
                        </span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <BlogCarousel />
      </div>

      {/* Global CSS for content styling */}
      <style jsx global>{`
        .blog-content {
          /* General styling */
          font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            sans-serif;
          line-height: 1.7;
          color: #374151;
        }

        /* Preserve white space and line breaks */
        .blog-content {
          white-space: normal;
        }

        /* Additional heading styling */
        .blog-content h2 {
          font-size: 1.875rem;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: #075985;
          font-weight: 700;
          line-height: 1.2;
          border-bottom: 2px solid #e0f2fe;
          padding-bottom: 0.5rem;
        }

        .blog-content h3 {
          font-size: 1.5rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #0284c7;
          font-weight: 600;
        }

        .blog-content h4 {
          font-size: 1.25rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #0369a1;
          font-weight: 600;
        }

        /* Paragraph styling */
        .blog-content p {
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
        }

        /* Link styling with hover effects */
        .blog-content a {
          color: #0284c7;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: all 0.2s ease;
        }

        .blog-content a:hover {
          color: #0369a1;
          text-decoration-thickness: 2px;
        }

        /* List styling */
        .blog-content ul,
        .blog-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
          padding-left: 1rem;
        }

        .blog-content ul {
          list-style-type: disc;
        }

        .blog-content ol {
          list-style-type: decimal;
        }

        .blog-content li {
          margin-bottom: 0.5rem;
        }

        /* Table styling */
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }

        .blog-content th {
          background-color: #e0f2fe;
          color: #0c4a6e;
          font-weight: 600;
          padding: 0.75rem;
          border: 1px solid #bae6fd;
          text-align: left;
        }

        .blog-content td {
          padding: 0.75rem;
          border: 1px solid #bae6fd;
        }

        .blog-content tr:nth-child(even) {
          background-color: #f0f9ff;
        }

        /* Keep the rich text editor styling for content */
        .ck-content h1,
        .blog-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #075985;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .ck-content h2,
        .blog-content h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #075985;
          margin-top: 2rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #e0f2fe;
          padding-bottom: 0.5rem;
        }

        .ck-content h3,
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #0284c7;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }

        .ck-content h4,
        .blog-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0369a1;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }

        /* Ensure proper display of divs */
        .blog-content div {
          margin-bottom: 1rem;
        }

        /* Preserve any custom classes that might come from the editor */
        .blog-content .callout {
          background-color: #e0f2fe;
          border-left: 4px solid #0ea5e9;
          border-radius: 0 0.5rem 0.5rem 0;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
        }

        .blog-content .note {
          background-color: #fef9c3;
          border-left: 4px solid #ca8a04;
          border-radius: 0 0.5rem 0.5rem 0;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
        }

        .blog-content .warning {
          background-color: #fee2e2;
          border-left: 4px solid #ef4444;
          border-radius: 0 0.5rem 0.5rem 0;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
        }

        .blog-content .key-point {
          background-color: #ecfdf5;
          border-left: 4px solid #10b981;
          border-radius: 0 0.5rem 0.5rem 0;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
        }
        /* Brand Overlay for Blog Images */
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
      `}</style>
    </div>
  );
}

export const getServerSideProps = async ({ locale }) => {
  const { getLayoutCmsProps } = require("@/lib/api/cmsHelper");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");

  const [layoutProps, cmsPageContent] = await Promise.all([
    getLayoutCmsProps(locale),
    getPageAndLayoutContent("blog", locale),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "blogcarousel"])),
      ...layoutProps,
      cmsPageContent,
    },
  };
};
