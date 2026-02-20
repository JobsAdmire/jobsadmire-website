export const env = {
  // External API bases (no trailing slash unless path includes query)
  CRM_API_URL: process.env.NEXT_PUBLIC_CRM_API_URL || 'https://crm.jobsadmire.com',
  BLOG_API_URL: process.env.NEXT_PUBLIC_BLOG_API_URL || 'https://phpstack-1309382-5454384.cloudwaysapps.com/api/blogs.php',
  UNIVERSITY_API_URL: process.env.NEXT_PUBLIC_UNIVERSITY_API_URL || 'https://dev-university-service.uniadmire.com/',
  GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  GEMINI_API_URL: process.env.NEXT_PUBLIC_GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta',
  RESTCOUNTRIES_API_URL: process.env.NEXT_PUBLIC_RESTCOUNTRIES_API_URL || 'https://restcountries.com/v3.1',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '',
  // Legacy / optional
  ACCOMMODATION_API_URL: process.env.NEXT_PUBLIC_ACCOMMODATION_API_URL,
  PARTNER_API_URL: process.env.NEXT_PUBLIC_PARTNER_API_URL,
  STUDENT_API_URL: process.env.NEXT_PUBLIC_STUDENT_API_URL,
  AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_URL,
}
