import { NextResponse } from 'next/server';

// Supported locales (must match next-i18next.config.js)
const SUPPORTED_LOCALES = ['en', 'fr', 'de', 'tr', 'ar', 'ru', 'fa', 'id', 'fil', 'tk', 'tg'];
const DEFAULT_LOCALE = 'en';

// For local testing: set this to a country code to simulate geo-detection
// e.g., 'TR' for Turkey, 'SA' for Saudi Arabia, 'IR' for Iran
// Set to null for production behavior
const LOCAL_TEST_COUNTRY = null;

// Country code to locale mapping
const COUNTRY_LOCALE_MAP = {
  // Turkish
  TR: 'tr',
  
  // Arabic countries
  SA: 'ar', // Saudi Arabia
  AE: 'ar', // UAE (Dubai, Abu Dhabi, etc.)
  EG: 'ar', // Egypt
  JO: 'ar', // Jordan
  KW: 'ar', // Kuwait
  BH: 'ar', // Bahrain
  QA: 'ar', // Qatar
  OM: 'ar', // Oman
  IQ: 'ar', // Iraq
  LB: 'ar', // Lebanon
  SY: 'ar', // Syria
  YE: 'ar', // Yemen
  LY: 'ar', // Libya
  DZ: 'ar', // Algeria
  MA: 'ar', // Morocco
  TN: 'ar', // Tunisia
  SD: 'ar', // Sudan
  PS: 'ar', // Palestine
  
  // Persian/Farsi countries
  IR: 'fa', // Iran
  AF: 'fa', // Afghanistan
  
  // Indonesian
  ID: 'id', // Indonesia
  
  // Filipino
  PH: 'fil', // Philippines
  
  // Turkmen
  TM: 'tk', // Turkmenistan
  
  // Tajik
  TJ: 'tg', // Tajikistan
  
  // German-speaking countries
  DE: 'de', // Germany
  AT: 'de', // Austria
  CH: 'de', // Switzerland (primarily German)
  LI: 'de', // Liechtenstein
  
  // French-speaking countries
  FR: 'fr', // France
  BE: 'fr', // Belgium (primarily French in Wallonia)
  MC: 'fr', // Monaco
  SN: 'fr', // Senegal
  CI: 'fr', // Ivory Coast
  CA: 'fr', // Canada (Quebec - French speaking)
  
  // Russian-speaking countries
  RU: 'ru', // Russia
  BY: 'ru', // Belarus
  KZ: 'ru', // Kazakhstan
  KG: 'ru', // Kyrgyzstan
  UA: 'ru', // Ukraine
};

// Get locale from country code
function getLocaleFromCountry(countryCode) {
  if (!countryCode) return DEFAULT_LOCALE;
  const locale = COUNTRY_LOCALE_MAP[countryCode.toUpperCase()];
  return locale && SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

// Get current locale from pathname
function getLocaleFromPathname(pathname) {
  const segments = pathname.split('/');
  const firstSegment = segments[1]; // First segment after leading slash
  if (SUPPORTED_LOCALES.includes(firstSegment)) {
    return firstSegment;
  }
  return DEFAULT_LOCALE;
}

// Check if path should be excluded from locale processing
function shouldExcludePath(pathname) {
  // Exclude static files, API routes, and internal Next.js paths
  const excludePatterns = [
    /^\/api\//,           // API routes
    /^\/_next\//,         // Next.js internal
    /^\/monitoring/,      // Sentry tunnel
    /^\/favicon/,         // Favicon
    /\.[^/]+$/,           // Files with extensions (images, css, js, etc.)
  ];
  
  return excludePatterns.some(pattern => pattern.test(pathname));
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip excluded paths
  if (shouldExcludePath(pathname)) {
    return NextResponse.next();
  }
  
  // Get user's locale preference from cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  
  // If user has a saved preference, respect it (don't redirect)
  if (localeCookie && SUPPORTED_LOCALES.includes(localeCookie)) {
    return NextResponse.next();
  }
  
  // Get current locale from URL or Next.js locale
  // Note: When Next.js i18n is enabled, the locale prefix is stripped from pathname
  // We need to check the nextUrl.locale which contains the actual locale
  const currentLocale = request.nextUrl.locale || getLocaleFromPathname(pathname);
  
  // Get country from various sources (in order of priority):
  // 1. Query parameter for testing (e.g., ?country=TR)
  // 2. Local test override
  // 3. Vercel's geo header (production)
  // 4. Cloudflare header (if behind Cloudflare)
  // 5. Request geo object
  const countryParam = request.nextUrl.searchParams.get('country');
  const country = countryParam?.toUpperCase() || 
                  LOCAL_TEST_COUNTRY || 
                  request.headers.get('x-vercel-ip-country') || 
                  request.headers.get('cf-ipcountry') ||
                  request.geo?.country;
  
  // Determine the target locale based on country
  const targetLocale = getLocaleFromCountry(country);
  
  
  // If already on the correct locale, continue without redirect
  if (currentLocale === targetLocale) {
    // Still set the cookie if not already set
    const response = NextResponse.next();
    if (!localeCookie) {
      response.cookies.set('NEXT_LOCALE', targetLocale, {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
      });
    }
    return response;
  }
  
  // Build the new URL with the target locale
  const url = request.nextUrl.clone();
  
  // Remove the country param from URL (it's only for testing)
  if (countryParam) {
    url.searchParams.delete('country');
  }
  
  // Remove current locale prefix if present
  let newPathname = pathname;
  if (SUPPORTED_LOCALES.includes(pathname.split('/')[1])) {
    newPathname = pathname.replace(/^\/[a-z]{2}/, '') || '/';
  }
  
  // Add target locale prefix (only if not default locale, as Next.js handles default differently)
  if (targetLocale !== DEFAULT_LOCALE) {
    url.pathname = `/${targetLocale}${newPathname}`;
  } else {
    url.pathname = newPathname;
  }
  
  // Create response with redirect
  const response = NextResponse.redirect(url);
  
  // Set cookie to remember the detected locale (expires in 1 year)
  response.cookies.set('NEXT_LOCALE', targetLocale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
  });
  
  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Match root and all page paths
    '/',
    '/((?!api|_next|favicon.ico).*)',
  ],
};
