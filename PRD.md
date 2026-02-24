# Product Requirements Document (PRD) - JobsAdmire

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Pages and Routing](#4-pages-and-routing)
5. [API Endpoints](#5-api-endpoints)
6. [Component Architecture](#6-component-architecture)
7. [Core Business Logic and Features](#7-core-business-logic-and-features)
8. [CMS Integration](#8-cms-integration)
9. [Internationalization (i18n)](#9-internationalization-i18n)
10. [External Integrations](#10-external-integrations)
11. [Data Models](#11-data-models)
12. [Environment Variables](#12-environment-variables)
13. [Scripts and DevOps](#13-scripts-and-devops)

---

## 1. Product Overview

### 1.1 Product Name

**JobsAdmire** (package name: `jobsadmire`, version `1.0.0`)

### 1.2 Description

JobsAdmire is a multilingual job board and immigration services platform that connects job seekers with international employment opportunities, provides immigration and visa consultancy services, offers resume building tools, and facilitates partnerships between recruitment agencies and employers. The platform is part of the Admire Group ecosystem.

### 1.3 Target Users

| User Type | Description |
|-----------|-------------|
| **Job Seekers / Candidates** | Individuals looking for international employment opportunities |
| **Employers / Companies** | Organizations looking to hire workers, particularly for international positions |
| **Immigration Applicants** | People seeking visa, residence permits, or citizenship services |
| **Recruitment Agencies** | Staffing firms looking to partner with JobsAdmire |
| **Job Providers / Business Owners** | Businesses that need to fill positions through the platform |

### 1.4 Key URLs

| Resource | URL |
|----------|-----|
| Site URL | Configured via `NEXT_PUBLIC_SITE_URL` |
| CRM | `https://crm.jobsadmire.com` |
| Application Portal | `https://apply.uniadmire.com` |
| Instagram | `https://www.instagram.com/jobsadmire_ozel_istihdam` |
| Facebook | `https://www.facebook.com/people/Jobs-Admire/61565940122054/` |
| LinkedIn | `https://www.linkedin.com/company/106312331/` |
| Contact Email | `info@jobsadmire.com` |
| WhatsApp | `+90 501 124 0340` |

### 1.5 Supported Languages

The platform supports **11 languages** with automatic geo-detection:

| Code | Language | RTL |
|------|----------|-----|
| `en` | English (default) | No |
| `fr` | French | No |
| `de` | German | No |
| `tr` | Turkish | No |
| `ar` | Arabic | Yes |
| `ru` | Russian | No |
| `fa` | Persian (Farsi) | Yes |
| `id` | Indonesian | No |
| `fil` | Filipino | No |
| `tk` | Turkmen | No |
| `tg` | Tajik | No |

---

## 2. Tech Stack

### 2.1 Core Framework

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | ^13.4.13 | React framework (Pages Router) |
| React | ^18.2.0 | UI library |
| React DOM | ^18.2.0 | DOM rendering |

### 2.2 Styling and UI Libraries

| Technology | Version | Purpose |
|-----------|---------|---------|
| Tailwind CSS | ^3.4.1 | Utility-first CSS framework |
| Ant Design (antd) | ^5.16.2 | UI component library (Typography, Select, ConfigProvider) |
| @material-tailwind/react | ^2.1.10 | Material Design components for Tailwind |
| styled-components | ^6.1.15 | CSS-in-JS styling |
| @emotion/react | ^11.14.0 | CSS-in-JS styling (Emotion) |
| @emotion/styled | ^11.14.0 | Styled components (Emotion) |
| @heroicons/react | ^2.2.0 | SVG icon library |
| lucide-react | ^0.479.0 | Icon library |
| react-icons | ^5.5.0 | Icon library |

### 2.3 Animation

| Technology | Version | Purpose |
|-----------|---------|---------|
| framer-motion | ^12.5.0 | React animation library |
| gsap | ^3.13.0 | GreenSock animation library |
| animate.css | ^4.1.1 | CSS animation library |

### 2.4 Form Handling and Inputs

| Technology | Version | Purpose |
|-----------|---------|---------|
| react-select | ^5.8.0 | Custom select dropdowns |
| react-phone-input-2 | ^2.15.1 | Phone number input with country codes |
| react-quill | ^2.0.0 | Rich text editor |
| yup | ^1.4.0 | Schema-based form validation |

### 2.5 Data Fetching and HTTP

| Technology | Version | Purpose |
|-----------|---------|---------|
| axios | ^1.8.4 | HTTP client |
| swr | ^2.2.5 | React hooks for data fetching with caching |

### 2.6 Internationalization

| Technology | Version | Purpose |
|-----------|---------|---------|
| next-i18next | ^15.4.2 | Next.js i18n framework |
| react-i18next | ^14.1.1 | React i18n bindings |
| i18n-iso-countries | ^7.11.0 | Country name translations |

### 2.7 PDF and Image Processing

| Technology | Version | Purpose |
|-----------|---------|---------|
| jspdf | ^3.0.1 | PDF document generation |
| html2canvas | ^1.4.1 | HTML to canvas rendering for PDF export |

### 2.8 Backend and Database

| Technology | Version | Purpose |
|-----------|---------|---------|
| mysql2 | ^3.14.2 | MySQL database driver (promise-based) |
| resend | ^4.5.2 | Transactional email service |

### 2.9 Monitoring and Analytics

| Technology | Version | Purpose |
|-----------|---------|---------|
| @sentry/nextjs | ^7.120.4 | Error monitoring and performance tracking |
| Google Analytics | G-77Y5KBV97L | Web analytics |
| Google Tag Manager | GTM-N2CLWJWJ | Tag management |
| Google Ads | AW-17096273578 | Conversion tracking |

### 2.10 Utilities

| Technology | Version | Purpose |
|-----------|---------|---------|
| moment | ^2.30.1 | Date formatting and manipulation |
| js-cookie | ^3.0.5 | Cookie management (locale preferences) |
| clsx | ^2.1.0 | Conditional class name construction |
| tailwind-merge | ^2.2.2 | Tailwind class conflict resolution |
| swiper | ^11.2.1 | Touch slider/carousel |
| react-collapse | ^5.1.1 | Collapsible content |
| react-hot-toast | ^2.4.1 | Toast notification system |

### 2.11 Dev Dependencies

| Technology | Version | Purpose |
|-----------|---------|---------|
| eslint | ^9.0.0 | Code linting |
| autoprefixer | ^10.4.17 | CSS vendor prefixing |
| postcss | ^8.4.33 | CSS transformation |
| dotenv | ^17.2.3 | Environment variable loading (scripts) |
| babel-plugin-styled-components | ^2.1.4 | Styled-components SSR support |
| @types/node | 20.12.7 | Node.js type definitions |

---

## 3. Architecture Overview

### 3.1 Directory Structure

```
jobsadmirewebsite/
├── public/
│   ├── locales/                    # Translation files (744 JSON files)
│   │   ├── en/                     # English translations (60+ namespaces)
│   │   ├── fr/                     # French translations
│   │   ├── de/                     # German translations
│   │   ├── tr/                     # Turkish translations
│   │   ├── ar/                     # Arabic translations
│   │   ├── ru/                     # Russian translations
│   │   ├── fa/                     # Persian translations
│   │   ├── id/                     # Indonesian translations
│   │   ├── fil/                    # Filipino translations
│   │   ├── tk/                     # Turkmen translations
│   │   └── tg/                     # Tajik translations
│   └── fonts/                      # Poppins font files
├── scripts/
│   ├── i18n-check.js               # Translation key validation
│   ├── translate-with-deepl.js     # DeepL auto-translation
│   ├── sync-locale-keys.js         # Locale key synchronization
│   └── translate-locales.js        # Translation utility
├── src/
│   ├── components/                 # React components (218+)
│   │   ├── app/                    # Layout: Header, Footer
│   │   ├── home/                   # Homepage components
│   │   ├── forms/                  # Resume builder forms
│   │   ├── candidate-form/         # Candidate registration forms
│   │   ├── resume/                 # Resume builder wizard
│   │   ├── templates/              # Resume templates (Modern, Classic, Minimal)
│   │   ├── templates1/             # Legacy resume templates (10 variants)
│   │   ├── jobdetail/              # Job detail page components
│   │   ├── blog/                   # Blog components
│   │   ├── services/               # Service page components
│   │   ├── immigration/            # Immigration page components
│   │   ├── residence/              # Residence permit components
│   │   │   ├── turkeyresidence/
│   │   │   ├── dubairesidence/
│   │   │   ├── albaniaresidence/
│   │   │   ├── kazakhstanresidence/
│   │   │   └── chinaresidence/
│   │   ├── visa/                   # Visa components
│   │   ├── visa-price/             # Visa pricing components
│   │   ├── about/                  # About page components
│   │   ├── shared/                 # Shared/reusable components
│   │   ├── core/                   # Core input components
│   │   ├── ui/                     # UI components (TemplateSelector, TabNavigation)
│   │   ├── legal/                  # Privacy and Terms components
│   │   ├── whatsapp/               # WhatsApp floating button
│   │   └── LanguageSwitcher.js     # Language selection dropdown
│   ├── pages/                      # Next.js pages (60+)
│   │   ├── api/                    # API routes (10 endpoints)
│   │   ├── blog/                   # Dynamic blog routes
│   │   ├── job-detail/             # Dynamic job detail routes
│   │   ├── profile/                # Dynamic profile routes
│   │   ├── services/               # Service sub-pages
│   │   ├── immigration/            # Immigration sub-pages
│   │   ├── partner/                # Partner registration pages
│   │   ├── _app.jsx                # App wrapper (layout, analytics, i18n)
│   │   ├── _document.jsx           # Custom HTML document
│   │   └── _error.jsx              # Error page with Sentry
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.js           # Axios-based HTTP client wrapper
│   │   │   ├── cms.js              # CMS API client (navigation, services, pages, etc.)
│   │   │   ├── cmsHelper.js        # Layout/homepage CMS data bundlers
│   │   │   ├── cmsContent.js       # Page content flattener + layout merger
│   │   │   └── services/           # API service classes
│   │   │       ├── index.js
│   │   │       ├── university-service.js
│   │   │       ├── student-service.js
│   │   │       ├── partner-service.js
│   │   │       ├── auth-service.js
│   │   │       └── accommodation-service.js
│   │   ├── context/
│   │   │   ├── CmsContext.js       # React context for structured CMS data
│   │   │   └── CmsContentContext.js # React context for page text content
│   │   ├── constants/
│   │   │   ├── env.js              # Environment variable exports (incl. CMS_API_URL)
│   │   │   ├── app.js              # App URLs and social links
│   │   │   └── filters.js          # Filter/sort option constants
│   │   ├── utils/
│   │   │   ├── toast.js            # Toast notification helpers
│   │   │   ├── number-format.js    # Number/currency formatting
│   │   │   ├── countries.js        # Country list (197 countries)
│   │   │   └── cn.js               # clsx + tailwind-merge utility
│   │   ├── hooks/
│   │   │   ├── index.js
│   │   │   ├── useToggleVisibility.js
│   │   │   └── useFormUrlSync.js   # Form state <-> URL sync
│   │   └── candidateService.js     # localStorage-based candidate CRUD
│   ├── hooks/
│   │   └── useCVData.js            # CV/Resume data management hook
│   ├── utils/
│   │   ├── crmUtils.js             # CRM API integration functions
│   │   ├── pdfGenerator.js         # PDF generation utility
│   │   └── dateUtils.js            # Date formatting utility
│   ├── utilities/
│   │   └── helper.jsx              # Country info helper (flags, names)
│   ├── data/
│   │   └── visaData.json           # Visa requirements database
│   ├── styles/
│   │   ├── globals.css             # Global styles (Poppins font, Tailwind)
│   │   ├── ui.css                  # Button styles
│   │   ├── select.css              # Select/dropdown styles
│   │   ├── header.css              # Header animation styles
│   │   ├── phone.css               # Phone input styles
│   │   └── collapse.css            # Accordion/collapse styles
│   └── middleware.js               # Geo-locale detection middleware
├── package.json
├── next.config.js                  # Next.js + Sentry configuration
├── next-i18next.config.js          # i18n configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── jsconfig.json                   # Path aliases
├── sentry.client.config.js         # Sentry client config
├── sentry.server.config.js         # Sentry server config
├── sentry.edge.config.js           # Sentry edge config
├── .env.example                    # Environment variable template
└── .gitignore
```

### 3.2 Path Aliases

Defined in `jsconfig.json` with base URL `./src`:

| Alias | Maps To | Example Usage |
|-------|---------|---------------|
| `@/*` | `./src/*` | `import X from '@/middleware'` |
| `@components/*` | `./src/components/*` | `import { Header } from '@components/app'` |
| `@styles/*` | `./src/styles/*` | `import '@styles/globals.css'` |
| `@lib/*` | `./src/lib/*` | `import { env } from '@lib/constants/env'` |
| `@utils/*` | `./src/lib/utils/*` | `import { cn } from '@utils/cn'` |
| `@constants/*` | `./src/lib/constants/*` | `import { env } from '@constants/env'` |
| `@api/*` | `./src/lib/api/*` | `import { Client } from '@api/client'` |

### 3.3 Application Layout

Every page is wrapped by the `_app.jsx` component which provides:

1. **next-i18next** integration via `appWithTranslation` HOC
2. **RTL/LTR detection** based on locale (`ar` and `fa` are RTL)
3. **Ant Design ConfigProvider** with custom theme (primary color `#51bae7`, Poppins font)
4. **CmsProvider** — wraps the app with structured CMS data (navigation, settings, services, stats, testimonials, destinations) fetched in `getStaticProps` via `getLayoutCmsProps` and `getHomeCmsProps`
5. **CmsContentProvider** — wraps the app with page-specific text content fetched via `getPageAndLayoutContent(pageSlug, locale)`, making `c()` and `cObj()` accessors available to all components
6. **Global components**: `Header`, `Footer`, `WhatsAppButton`, `Toaster`
7. **Google Analytics** script injection (`G-77Y5KBV97L`)
8. **Global link handling** for locale-prefixed navigation

### 3.4 Middleware (Geo-Locale Detection)

File: `src/middleware.js`

The middleware runs on all non-API, non-static routes and performs automatic locale detection:

1. Checks for `NEXT_LOCALE` cookie (user preference) -- if set, respects it
2. Detects country from headers (priority order):
   - `?country=` query parameter (testing)
   - `LOCAL_TEST_COUNTRY` constant (local dev)
   - `x-vercel-ip-country` header (Vercel production)
   - `cf-ipcountry` header (Cloudflare)
   - `request.geo.country` (fallback)
3. Maps country code to locale using `COUNTRY_LOCALE_MAP`
4. Redirects user to locale-prefixed URL if mismatch
5. Sets `NEXT_LOCALE` cookie (1 year expiry)

**Country-to-locale mapping covers 40+ countries** including:
- Turkish: Turkey
- Arabic: 18 countries (Saudi Arabia, UAE, Egypt, Jordan, Kuwait, etc.)
- Persian: Iran, Afghanistan
- Indonesian: Indonesia
- Filipino: Philippines
- Turkmen: Turkmenistan
- Tajik: Tajikistan
- German: Germany, Austria, Switzerland, Liechtenstein
- French: France, Belgium, Monaco, Senegal, Ivory Coast, Canada
- Russian: Russia, Belarus, Kazakhstan, Kyrgyzstan, Ukraine

### 3.5 API Service Layer

The app uses a shared `Client` class (`src/lib/api/client.js`) built on Axios. Each service extends this for a specific external API:

```
Client (Axios wrapper)
├── UniversityService   -> UNIVERSITY_API_URL
├── StudentService      -> STUDENT_API_URL
├── PartnerService      -> PARTNER_API_URL
├── AuthService         -> AUTH_API_URL
└── AccommodationService -> ACCOMMODATION_API_URL
```

CRM integration is handled separately via `src/utils/crmUtils.js` using direct `fetch` calls with bearer token authentication to `CRM_API_URL`.

### 3.6 Next.js Configuration

Defined in `next.config.js`:

- **i18n**: Imported from `next-i18next.config.js`
- **Styled Components**: Compiler enabled for SSR support
- **React Strict Mode**: Enabled
- **Image Domains**: `techadmire.s3.fr-par.scw.cloud`
- **Redirects**:
  - `/home` -> `/` (permanent)
  - `/services/career-councelling` -> `/services/career-counselling` (permanent, typo fix)
- **Sentry**: Org `jobsadmire`, project `jobsadmire-website`, tunnel route `/monitoring`

### 3.7 Tailwind Configuration

Custom design tokens in `tailwind.config.js`:

**Colors:**
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#51bae7` | Main brand color |
| `primary-dark` | `#2bb8f5` | Darker variant |
| `primary-light` | `#91d9f7` | Lighter variant |
| `primary-extra-light` | `#f0fbff` | Background tint |
| `primary-hover` | `#61c7f2` | Hover state |
| `secondary` | `#ffffff` | White |
| `secondary-dark` | `#4e4e4e` | Dark gray |
| `success` | `#5cbf54` | Success state |
| `danger` | `#f44336` | Error/danger state |

**Breakpoints:**
| Name | Width |
|------|-------|
| `xsm` | 380px |
| `xs` | 480px |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `xxl` | 1580px |

**Custom Plugins:**
- `not-hover` variant: `&:not(:hover)`
- `.no-scrollbar` utility: Hides scrollbar across browsers

---

## 4. Pages and Routing

### 4.1 Main Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `index.js` | Homepage with hero, job search, categories, latest jobs, testimonials, blog carousel, immigration carousel, stats, disclaimer banner |
| `/about` | `about.js` | About Us page with hero, values, services overview, statistics |
| `/contact-us` | `contact-us.js` | Multi-step premium contact form; submits to CRM via `createInquiry`; redirects to `/thankyou` |
| `/job` | `job.js` | Job board with search, filters (type, experience, salary, date posted), pagination, dark mode support |
| `/blog` | `blog.js` | Blog listing with category filtering, search, lazy loading, newsletter signup popup |
| `/services` | `services.js` | Services overview page |
| `/visa` | `visa.js` | Visa requirements checker; select citizenship and destination; displays status, fees, processing time, documents needed |
| `/work-permit` | `work-permit.js` | Work permit information with types, benefits, application process; popup form for inquiries |
| `/visa-e-invitations` | `visa-e-invitations.js` | Visa e-invitation packages and pricing |
| `/hire-workers-in-turkey` | `hire-workers-in-turkey.js` | Hiring services in Turkey; workforce types, benefits, hiring process with popup form |
| `/job-recruitment` | `job-recruitment.js` | Job recruitment services overview |
| `/turkey-citizenship` | `turkey-citizenship.js` | Turkish citizenship pathways, benefits, application steps, contact form |
| `/certifications` | `certifications.js` | Company certifications gallery |
| `/thankyou` | `thankyou.js` | Post-submission thank you page with Google Ads conversion tracking |

### 4.2 Dynamic Routes

| Route | File | Description |
|-------|------|-------------|
| `/blog/[slug]` | `blog/[slug].js` | Blog post detail page; SSR via `getServerSideProps`; fetches from Blog API by slug; table of contents, newsletter signup |
| `/job-detail/[id]` | `job-detail/[id].js` | Job detail page; SSR; tabbed interface (description, requirements, details); apply modal with resume upload; share/save |
| `/profile/[id]` | `profile/[id].js` | Candidate profile page; fetches via `candidateService`; personal/professional info, skills, education, download resume, share |

### 4.3 Registration and Authentication Pages

| Route | File | Description |
|-------|------|-------------|
| `/register-as-candidate` | `register-as-candidate.js` | Candidate registration: personal, professional, education, skills, legal info; Gemini AI profile summary generation |
| `/register-as-company` | `register-as-company.js` | Company registration: company details, HR contact, recruitment preferences, documents, account info |
| `/login-companies` | `login-companies.js` | Login page with category selection (agency, job-provider, candidate) |
| `/apply-online` | `apply-online.js` | Visa application: two-step form (application details, payment info) |
| `/candidate-apply` | `candidate-apply.js` | Candidate application wrapper rendering `HomeForm` |

### 4.4 Resume and Templates Pages

| Route | File | Description |
|-------|------|-------------|
| `/resume-generator` | `resume-generator.js` | Resume builder wizard (6-step process) |
| `/templates` | `templates.js` | Resume template selector; browse/search/filter templates; PDF download via `html2canvas` + `jspdf`; data from `localStorage` |

### 4.5 Service Sub-Pages

| Route | File | Description |
|-------|------|-------------|
| `/services/career-counselling` | `services/career-counselling.js` | Career counselling service details |
| `/services/global-job-placement` | `services/global-job-placement.js` | Global job placement service |
| `/services/human-resource` | `services/human-resource.js` | HR services: strategic/operational tabs, industries, testimonials |
| `/services/immigration` | `services/immigration.js` | Immigration consultancy service |
| `/services/interview-coaching-service` | `services/interview-coaching-service.js` | Interview coaching service |
| `/services/remote-work-opportunity` | `services/remote-work-opportunity.js` | Remote work opportunities |
| `/services/resume-service` | `services/resume-service.js` | Resume writing service |
| `/services/skill-development-training` | `services/skill-development-training.js` | Skill development and training |
| `/services/talent-acquisition-process` | `services/talent-acquisition-process.js` | Talent acquisition process |
| `/services/visa` | `services/visa.js` | Visa assistance service |

### 4.6 Immigration Sub-Pages

| Route | File | Description |
|-------|------|-------------|
| `/immigration/immigrate-to-usa` | `immigration/immigrate-to-usa.js` | USA immigration guide (visa options, requirements, costs) |
| `/immigration/immigrate-to-uk` | `immigration/immigrate-to-uk.js` | UK immigration guide |
| `/immigration/immigrate-to-canada` | `immigration/immigrate-to-canada.js` | Canada immigration guide |
| `/immigration/immigrate-to-australia` | `immigration/immigrate-to-australia.js` | Australia immigration guide |
| `/immigration/immigrate-to-turkey` | `immigration/immigrate-to-turkey.js` | Turkey immigration guide |
| `/immigration/turkey-residence-permit` | `immigration/turkey-residence-permit.js` | Turkey residence permit (benefits, stages, why choose us) |
| `/immigration/kazakhstan-residence-permit` | `immigration/kazakhstan-residence-permit.js` | Kazakhstan residence permit |

### 4.7 Partner Pages

| Route | File | Description |
|-------|------|-------------|
| `/partner/register-as-candidate` | `partner/register-as-candidate.js` | Extended partner candidate registration (personal, contact, professional, education, skills, languages, documents, relocation, legal) |
| `/partner/recruiter-agency` | `partner/recruiter-agency.js` | Recruiter agency partner registration (company/contact info, staffing needs, industry focus); submits via `createInquiryFromRecruiter` |
| `/partner/job-provider` | `partner/job-provider.js` | Job provider registration (company details, legal info, hiring requirements); submits via `createInquiryFromBusinessOwner` |

### 4.8 Legal Pages

| Route | File | Description |
|-------|------|-------------|
| `/privacy` | `privacy.js` | Privacy policy with floating navigation, sectioned content, intersection observer |
| `/terms` | `terms.js` | Terms and conditions with accordion sections |

### 4.9 Deprecated/Redirect Pages

| Route | File | Description |
|-------|------|-------------|
| `/register-your-company` | `register-your-company.js` | Deprecated; redirects to `/` |

---

## 5. API Endpoints

### 5.1 Application Submission

**`POST /api/submit-application`** (`src/pages/api/submit-application.js`)

Saves candidate applications to a MySQL database.

**Request Body:**
```json
{
  "personalInfo": {
    "name": "string",
    "surname": "string",
    "email": "string",
    "phone": "string",
    "dateOfBirth": "string",
    "jobCategory": "string",
    "password": "string",
    "address": "string",
    "country": "string",
    "city": "string",
    "state": "string",
    "placeOfBirth": "string",
    "passportNumber": "string",
    "gender": "string",
    "abroadResidenceAddress": "string",
    "weight": "number",
    "height": "number",
    "programmingLanguages": "string",
    "experience": "number",
    "medicalLicense": "string",
    "specialization": "string"
  },
  "projects": [{ "title": "", "organization": "", "startDate": "", "endDate": "", "reference": "" }],
  "candidateJobs": [{ "title": "", "organization": "", "startDate": "", "endDate": "", "reference": "" }],
  "qualifications": [{ "title": "", "organization": "", "startDate": "", "endDate": "", "reference": "" }],
  "skills": [{ "type": "", "title": "", "organization": "", "startDate": "", "endDate": "", "reference": "" }]
}
```

**Response:** `{ success: true, applicationId: number, experiencesInserted: number }`

**Database tables used:** `applications`, `experiences` (with type column: `project`, `work`, `qualification`, `skill`)

### 5.2 Contact Form

**`POST /api/contact`** (`src/pages/api/contact.jsx`)

Forwards contact form submissions to the CRM API.

**Request Body:** `{ name, email, message }`

**Behavior:** Validates required fields, then POSTs to `CRM_API_URL/api/lead-save`

### 5.3 Visa Application Email

**`POST /api/send-visa-application`** (`src/pages/api/send-visa-application.js`)

Sends visa application emails via Resend.

**Behavior:**
- Sends admin notification email with form data and file attachments (passport, headshot as base64)
- Sends confirmation email to the applicant
- Uses `RESEND_API_KEY`, `RECIPIENT_EMAIL`, `FROM_EMAIL`

### 5.4 Popup Form Email

**`POST /api/send-popup-form`** (`src/pages/api/send-popup-form.js`)

Handles popup service inquiry form submissions.

**Supported service types:** Work Overseas, Migration, Visit & Explore

**Behavior:** Sends service-type-specific email content via Resend

### 5.5 Residence Permit Form

**`POST /api/send-form`** (`src/pages/api/send-form.js`)

Handles residence permit application form submissions.

**Supported countries:** Turkey, Albania, Dubai, China, Kazakhstan

**Behavior:** Sends country-specific email content via Resend

### 5.6 Service Inquiry Email

**`POST /api/send-form-email`** (`src/pages/api/send-form-email.js`)

Handles service inquiry form submissions.

**Supported service types:** Study, Work, Migrate, Visit

**Behavior:** Sends admin notification and client confirmation emails with rich HTML templates via Resend

### 5.7 University Countries Proxy

**`GET /api/countries`** (`src/pages/api/countries.js`)

Proxies requests to `UNIVERSITY_API_URL/api/universities/countries`

**Response:** Array of countries where universities are available

### 5.8 University Programs Proxy

**`GET /api/programs`** (`src/pages/api/programs.js`)

Proxies requests to `UNIVERSITY_API_URL/api/programs`

**Query Parameters:** `university` (required) -- university ID

**Response:** Array of programs for the specified university

### 5.9 Universities Proxy

**`GET /api/universities`** (`src/pages/api/universities.js`)

Proxies requests to `UNIVERSITY_API_URL/api/universities/public`

**Query Parameters:** `countryCode` (optional) -- filter by country

**Response:** Array of universities

### 5.10 Sentry Test Endpoint

**`GET /api/sentry-example-api`** (`src/pages/api/sentry-example-api.js`)

Test endpoint that intentionally throws a `SentryExampleAPIError` for verifying Sentry backend error monitoring.

---

## 6. Component Architecture

### 6.1 Component Hierarchy

```
_app.jsx (App Wrapper)
├── ConfigProvider (Ant Design theme, RTL/LTR)
├── Google Analytics Scripts
├── WhatsAppButton (floating, bottom-right)
├── Header (fixed navbar, mega menu, language switcher)
├── <main>
│   └── <Component> (page content)
├── Footer (links, contact, social media)
└── Toaster (react-hot-toast notifications)
```

### 6.2 Layout Components

| Component | File | Description |
|-----------|------|-------------|
| `Header` | `components/app/Header.jsx` | Fixed navbar with scroll effects, top bar (phone, email, location), mega menu for services, partner dropdown, mobile hamburger, search overlay, language switcher, social links. Reads logo, CTA text/link from `useCms()` / `settings.header` with `ct()` and `next-i18next` fallback. |
| `Footer` | `components/app/Footer.jsx` | Footer with navigation links, contact info, social media links. Reads logo, tagline, description, copyright, company profile PDF from `useCms()` / `settings.footer` with `ct()` and `next-i18next` fallback. |
| `LanguageSwitcher` | `components/LanguageSwitcher.js` | Dropdown with 11 languages, flag icons, cookie persistence, RTL support |

### 6.3 Home Page Components

| Component | File | Description |
|-----------|------|-------------|
| `HeroSection` | `components/home/HeroSection.jsx` | Animated word rotation, job search (title + location autocomplete), service cards (migrate/work/visit), WhatsApp contact, service popup |
| `LatestJobs` | `components/home/LatestJobs.jsx` | Job listings with category filtering, search, featured badges, salary/location/experience display |
| `BlogSection` | `components/home/BlogSection.jsx` | Auto-playing blog carousel with post cards, date, read time, navigation |
| `Testimonials` | `components/home/Testimonials.jsx` | Auto-rotating testimonials with profile images, metrics, thumbnail nav, progress bar |
| `ServicesCarousel` | `components/home/ServicesCarousel.jsx` | 10 services showcase with auto-play, keyboard nav, progress bar, feature cards |
| `ImmigrationCarousel` | `components/home/ImmigrationCarousel.jsx` | 5 destinations (Canada, UK, USA, Australia, Turkey) with 3D card effects, touch/swipe, ratings |
| `PopularCategories` | `components/home/PopularCategories.jsx` | 4 job category cards with hover animations |
| `ServicePopupForm` | `components/home/ServicePopupForm.jsx` | Service inquiry popup form (migrate/work/visit/study) with country dropdowns, phone input, WhatsApp toggle, URL sync |
| `banner` | `components/home/banner.jsx` | Customizable CTA banner with intersection observer animations |
| `stats` | `components/home/stats.jsx` | Animated counter statistics with percentage indicators |

### 6.4 Form Components (Resume Builder)

| Component | File | Props |
|-----------|------|-------|
| `PersonalForm` | `components/forms/PersonalForm.jsx` | `cvData`, `updatePersonal`, `handlePhotoUpload`, `removePhoto` |
| `ExperienceForm` | `components/forms/ExperienceForm.jsx` | `cvData`, `updateExperience`, `addExperience`, `removeExperience` |
| `EducationForm` | `components/forms/EducationForm.jsx` | `cvData`, `updateEducation`, `addEducation`, `removeEducation` |
| `SkillsForm` | `components/forms/SkillsForm.jsx` | `cvData`, `updateSkills`, `addSkill`, `removeSkill` |
| `CertificationsForm` | `components/forms/CertificationsForm.jsx` | `cvData`, `updateCertification`, `addCertification`, `removeCertification` |

### 6.5 Resume Builder Components

| Component | File | Description |
|-----------|------|-------------|
| `ResumeBuilder` | `components/resume/ResumeBuilder.jsx` | 6-step wizard orchestrator with progress indicator, step navigation, localStorage persistence, confetti on completion |
| `stepone` | `components/resume/stepone.jsx` | Step 1 -- Personal information with image cropping modal, validation, localStorage |

### 6.6 Resume Templates

| Template | File | Style |
|----------|------|-------|
| `ModernTemplate` | `components/templates/ModernTemplate.jsx` | Blue gradient header, modern layout |
| `ClassicTemplate` | `components/templates/ClassicTemplate.jsx` | Colorful sections, timeline-style |
| `MinimalTemplate` | `components/templates/MinimalTemplate.jsx` | Clean, minimal design |

All templates accept a `cvData` prop containing personal, experience, education, skills, and certifications data.

Additionally, there are 10 legacy resume templates in `components/templates1/` (professional-resume1 through professional-resume10, clean-resume variants).

### 6.7 Job Detail Components

| Component | File | Description |
|-----------|------|-------------|
| `hero` | `components/jobdetail/hero.jsx` | Job detail hero with title, company, stats cards (salary, location, experience), CTA buttons |
| `description` | `components/jobdetail/description.jsx` | Tabbed interface (Description/Requirements/Details), application modal with progress, share modal, save job, resume upload, form validation |

### 6.8 Blog Components

| Component | File | Description |
|-----------|------|-------------|
| `BlogCards` | `components/blog/BlogCards.jsx` | Blog page with hero search, category filtering, featured post, card grid, load more, newsletter, dark mode, trending tags |

### 6.9 Shared/Reusable Components

| Component | File | Description |
|-----------|------|-------------|
| `SectionHeader` | `components/shared/SectionHeader.jsx` | Section header with surtitle, title, description (Ant Design Typography) |
| `SectionContainer` | `components/shared/SectionContainer.jsx` | Responsive section container with padding, snap scrolling |
| `PartnersSection` | `components/shared/PartnersSection.jsx` | Infinite scroll partner/university logo marquee with SWR data fetching |
| `DisclaimerBanner` | `components/shared/DisclaimerBanner.jsx` | Dismissible fixed bottom disclaimer banner |

### 6.10 Core Input Components

| Component | File | Key Props |
|-----------|------|-----------|
| `SelectInput` | `components/core/inputs/SelectInput.jsx` | `label`, `value`, `onSelect`, `options`, `placeholder`, `isMulti`, `error` (wraps react-select) |
| `SearchInput` | `components/core/inputs/SearchInput.jsx` | `id`, `placeholder`, `onChange`, `value` (search input with icon) |
| `PhoneInput` | `components/core/inputs/PhoneInput.jsx` | `id`, `label`, `value`, `onChange`, `country` (wraps react-phone-input-2) |

### 6.11 UI Components

| Component | File | Description |
|-----------|------|-------------|
| `TemplateSelector` | `components/ui/TemplateSelector.jsx` | Resume template picker with previews (Modern, Classic, Minimal) |
| `TabNavigation` | `components/ui/TabNavigation.jsx` | Resume builder tab nav (Templates, Personal, Experience, Education, Skills, Certifications) |

### 6.12 Utility Components

| Component | File | Description |
|-----------|------|-------------|
| `WhatsAppButton` | `components/whatsapp/whatsapp.jsx` | Floating WhatsApp button (bottom-right), rotating welcome messages, bounce animation, online status, ripple effect |

### 6.13 Immigration and Residence Components

Country-specific component groups for immigration guides:

- `components/immigration/i-us/` -- USA immigration
- `components/immigration/i-uk/` -- UK immigration
- `components/immigration/i-canada/` -- Canada immigration
- `components/immigration/i-australia/` -- Australia immigration
- `components/immigration/i-turkey/` -- Turkey immigration

Each includes: hero, visa options, requirements, costs, facts, moving guides, job sections.

Residence permit components:

- `components/residence/turkeyresidence/`
- `components/residence/dubairesidence/`
- `components/residence/albaniaresidence/`
- `components/residence/kazakhstanresidence/`
- `components/residence/chinaresidence/`

Each includes: hero, benefits, stages, and "why choose us" sections.

---

## 7. Core Business Logic and Features

### 7.1 Job Board

**Route:** `/job`

The job board is the primary feature of the platform, allowing users to search and browse international job opportunities.

**Capabilities:**
- Full-text job search by title and location
- Filtering by job type, experience level, salary range, date posted
- Job category filtering
- Pagination for large result sets
- Featured job highlighting with badges
- Job cards display: title, company, salary, location, experience, job type
- Dark mode support
- Mobile-responsive filters panel
- Each job links to `/job-detail/[id]` for full details

**Data Source:** Jobs are fetched from the CRM API (`CRM_API_URL`) at runtime.

### 7.2 Job Detail and Application

**Route:** `/job-detail/[id]`

**Capabilities:**
- Server-side rendered job detail page
- Tabbed interface: Description, Requirements, Details
- Application modal with multi-step progress
- Resume upload support
- Share job via modal (link copy, social sharing)
- Save job functionality
- Form validation for applications
- Contact section with company information
- HTML content processing for rich job descriptions

### 7.3 Resume Builder

**Route:** `/resume-generator` and `/templates`

A full-featured resume/CV builder with a 6-step wizard:

| Step | Section | Fields |
|------|---------|--------|
| 1 | Personal Info | Photo upload (with cropping), first/middle/last name, email, phone, location, LinkedIn, website, professional summary |
| 2 | Experience | Multiple entries: job title, company, location, date range, current job toggle, description |
| 3 | Education | Multiple entries: degree, school, location, date range, GPA |
| 4 | Skills | Multiple entries: skill name, proficiency level (Beginner/Intermediate/Advanced/Expert) |
| 5 | Certifications | Multiple entries: name, issuing organization, date obtained |
| 6 | Template Selection | Choose from 3 templates (Modern, Classic, Minimal) |

**Additional Features:**
- Data persistence via `localStorage`
- PDF export via `html2canvas` + `jspdf`
- Print-to-PDF via `pdfGenerator.js`
- Confetti animation on completion
- Step validation before proceeding
- CV data managed by `useCVData` hook (`src/hooks/useCVData.js`)

### 7.4 Candidate Registration

**Routes:** `/register-as-candidate`, `/partner/register-as-candidate`

**Standard Registration** (`/register-as-candidate`):
- Multi-step form collecting: personal details, professional info, education, skills, legal information
- Gemini AI integration for auto-generating professional profile summaries
- Uses `COUNTRIES_LIST` (197 countries) for nationality/country selection
- Form validation with error handling

**Partner Registration** (`/partner/register-as-candidate`):
- Extended form with additional sections: contact details, languages, documents, relocation preferences
- Legal agreements acceptance
- Redirects to `/thankyou` on success

### 7.5 Company Registration

**Route:** `/register-as-company`

Collects:
- Company details (name, industry, size, location)
- HR contact information
- Recruitment preferences
- Document uploads
- Account credentials

### 7.6 Immigration Services

**Routes:** `/immigration/*` (5 country pages + 2 residence permit pages)

Country-specific immigration guides for:
- USA, UK, Canada, Australia, Turkey

Each guide includes:
- Hero section with country information
- Visa types and options
- Requirements and documentation
- Costs and processing times
- Living/moving guides
- Job market information

**Residence Permits** for: Turkey, Kazakhstan (with dedicated pages for Dubai, Albania, China via components)

### 7.7 Visa Requirements Checker

**Route:** `/visa`

An interactive tool for checking visa requirements between country pairs.

**Capabilities:**
- Select citizenship country and destination country
- Displays: visa requirement status, processing time, validity period, fees, required documents
- Data sourced from `src/data/visaData.json` (10,000+ lines covering country pairs)
- Categories: Tourism & Business, Work & Immigration
- Uses `COUNTRIES_LIST` for dropdowns

### 7.8 Visa Application

**Route:** `/apply-online`

Two-step form process:
1. **Step 1 -- Application Details:** Personal info, travel info, visa type
2. **Step 2 -- Payment:** Payment information

Submissions trigger email notifications via `/api/send-visa-application` (admin notification + applicant confirmation).

### 7.9 Contact and Inquiry System

Multiple forms funnel inquiries through two channels:

**Channel 1 -- CRM API** (via `crmUtils.js`):
| Function | CRM Endpoint | Used By |
|----------|-------------|---------|
| `createInquiry()` | `/api/consultancy/inquiries/create` | Contact form, general inquiries, citizenship page |
| `createInquiryFromRecruiter()` | `/api/consultancy/inquiries/recruiters` | Recruiter agency registration |
| `createInquiryFromBusinessOwner()` | `/api/consultancy/inquiries/business-owners` | Job provider registration |

All CRM calls use bearer token authentication.

**Channel 2 -- Email via Resend** (via API routes):
| API Route | Purpose |
|-----------|---------|
| `/api/send-popup-form` | Service popup forms (Work Overseas, Migration, Visit) |
| `/api/send-form` | Residence permit applications |
| `/api/send-form-email` | Service inquiries (Study, Work, Migrate, Visit) |
| `/api/send-visa-application` | Visa applications (with file attachments) |

### 7.10 Partner System

Three partner registration types:

| Type | Route | CRM Function |
|------|-------|-------------|
| Partner Candidate | `/partner/register-as-candidate` | Direct form submission |
| Recruiter Agency | `/partner/recruiter-agency` | `createInquiryFromRecruiter()` |
| Job Provider | `/partner/job-provider` | `createInquiryFromBusinessOwner()` |

Both recruiter and job provider registrations include Sentry event tracking for monitoring.

### 7.11 Blog

**Routes:** `/blog`, `/blog/[slug]`

**Listing Page:**
- Fetches posts from Blog API
- Category filtering
- Full-text search
- Lazy loading / load more
- Newsletter subscription popup
- Dark mode support
- Trending tags display

**Detail Page:**
- Server-side rendered via `getServerSideProps`
- Rich content display
- Auto-generated table of contents
- Newsletter signup
- Related content

### 7.12 Candidate Profile Management

**Route:** `/profile/[id]`

Uses `candidateService.js` -- a localStorage-based service with:

**CRUD Operations:**
- `saveCandidate()` / `saveCandidateWithImage()` -- Create with base64 image handling
- `getCandidateById()` -- Read single profile
- `getAllCandidates()` -- List all profiles
- `updateCandidate()` -- Update profile
- `deleteCandidate()` -- Remove profile

**Search and Filter:**
- `searchCandidates(query)` -- Search by name, profession, location, skills
- `filterCandidates(filters)` -- Filter by category, location, experience range, skills
- `getCandidatesByCategory(category)` -- Filter by category

**Analytics:**
- `getCategoryStats()` -- Category distribution statistics
- `getTopSkills(limit)` -- Most common skills across candidates
- `getRecentCandidates(days)` -- Recently added candidates

**Auto-Categorization:**
- `categorizeByProfession(profession)` -- Maps profession keywords to categories:
  - `software-development`, `design`, `data-science`, `marketing`, `customer-support`, `business` (default)

**React Hooks:**
- `useCandidates()` -- Hook for loading candidates with reactive updates
- `useCategoryStats()` -- Hook for category statistics

**Data Import/Export:**
- `exportData()` -- JSON backup
- `importData(jsonData)` -- Restore from backup

### 7.13 Service Pages

10 dedicated service pages under `/services/`:

| Service | Key Features |
|---------|-------------|
| Career Counselling | Multi-section guide with career advice |
| Global Job Placement | International job placement process |
| Human Resource | Strategic/operational HR tabs, industry coverage, testimonials |
| Immigration | Immigration consultancy with process visualization |
| Interview Coaching | Coaching sessions, timing info |
| Remote Work Opportunity | Remote job opportunities |
| Resume Service | Professional resume writing service |
| Skill Development Training | Training programs |
| Talent Acquisition Process | Recruitment process overview |
| Visa | Visa assistance and guidance |

Each service page typically includes: Hero section, content sections, `ServicesCarousel` (cross-linking other services), and CTA `Banner`.

---

## 8. CMS Integration

The website fetches all page content, navigation, services, and other structured data from the JobsAdmire CMS API (`jobsadmire-cms`) instead of relying on hardcoded values. Translation JSON files in `public/locales/` serve as fallbacks.

### 8.1 CMS API Client

**File:** `src/lib/api/cms.js`

A lightweight fetch-based client that calls the CMS REST API with ISR revalidation (`revalidate: 60`).

| Function | CMS Endpoint | Description |
|----------|-------------|-------------|
| `getNavigation(location, locale)` | `/navigation/{location}` | Fetch menu by location (HEADER, FOOTER, SERVICES_MEGA, PARTNER_DROPDOWN) |
| `getServices(locale)` | `/services` | List visible services |
| `getServiceBySlug(slug, locale)` | `/services/{slug}` | Get a single service by slug |
| `getTestimonials(locale)` | `/testimonials` | List visible testimonials |
| `getStats(locale)` | `/stats` | List visible homepage statistics |
| `getDestinations(locale)` | `/destinations` | List visible immigration destinations |
| `getPage(slug, locale)` | `/pages/{slug}` | Get page with locale-filtered sections |
| `getFaqs(pageSlug, locale)` | `/faqs/page/{slug}` | Fetch visible FAQs for a page |
| `getSettings(group)` | `/settings/group/{group}` | Get settings by group (contact, social, header, footer) |

### 8.2 CMS Helper Functions

**File:** `src/lib/api/cmsHelper.js`

| Function | Fetches | Used By |
|----------|---------|---------|
| `getLayoutCmsProps(locale)` | Navigation (4 menus) + Settings (contact, social, **header**, **footer**) | All pages in `getStaticProps`; layout props include `cmsSettings.header` and `cmsSettings.footer` |
| `getHomeCmsProps(locale)` | Services, Stats, Testimonials, Destinations | Homepage `getStaticProps` |

### 8.3 Page Content Flattener

**File:** `src/lib/api/cmsContent.js`

| Function | Description |
|----------|-------------|
| `flattenPageSections(page)` | Converts nested page sections into a flat `{ "sectionKey.field": value }` map |
| `getCmsPageContent(slug, locale)` | Fetches a page and flattens its sections |
| `getPageAndLayoutContent(pageSlug, locale)` | Fetches both page-specific and `_layout` content, merges them (page values override layout) |

### 8.4 React Contexts

**CmsContext** (`src/lib/context/CmsContext.js`):
- Provides structured CMS data: `nav`, `settings`, `services`, `stats`, `testimonials`, `destinations`.
- Access via `useCms()` hook.
- Populated in `_app.jsx` from props returned by `getLayoutCmsProps` and `getHomeCmsProps`.

**CmsContentContext** (`src/lib/context/CmsContentContext.js`):
- Provides flattened page text content as a key-value map.
- Access via `useCmsContent()` hook.
- Returns `c(key, defaultValue)` for string values and `cObj(key, defaultValue)` for JSON-parsed arrays/objects.
- Populated in `_app.jsx` from `pageProps.cmsPageContent`.

### 8.5 Content Access Pattern

Components use a CMS-first approach with translation fallback:

```jsx
const { c } = useCmsContent();
const { t } = useTranslation("common");

<h1>{c("hero.title", t("hero.title"))}</h1>
```

The `ct` helper pattern (used in **Header** and **Footer** for CMS-managed labels: logo, CTA, tagline, description, copyright, profile link) combines both, with `next-i18next` as fallback:

```jsx
const ct = (key, options) => c(key) || t(key, options);
```

### 8.6 Data Fetching in Pages

Every page's `getStaticProps` (or `getServerSideProps`) follows this pattern:

```javascript
export async function getStaticProps({ locale }) {
  const { getLayoutCmsProps } = require("@/lib/api/cmsHelper");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const [layoutProps, cmsPageContent] = await Promise.all([
    getLayoutCmsProps(locale),
    getPageAndLayoutContent("page-slug", locale),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      ...layoutProps,
      cmsPageContent,
    },
    revalidate: 60,
  };
}
```

### 8.7 What is NOT in the CMS

| Content | Source |
|---------|--------|
| Blog posts | External phpstack API (`BLOG_API_URL`) |
| Job listings & applications | CRM API (`crm.jobsadmire.com`) |
| Visa requirements data | Local file `src/data/visaData.json` |

### 8.8 FAQs from CMS

The CMS exposes per-page FAQs via `getFaqs(pageSlug, locale)`. Website pages that show FAQs fetch `cmsFaqs` in `getStaticProps` (or client-side where needed) and render them with fallback to `t()` for question/answer text. Pages using CMS FAQs include: `hire-workers-in-turkey`, `register-your-company`, `partner/register-as-candidate`, and the UK immigration pets component (`components/i-uk/pet.jsx`).

### 8.9 Header and Footer from Settings

**Header:** Logo URL, logo alt text, and main CTA button text/link come from `settings.header` (keys: `header_logo_url`, `header_logo_alt`, `header_cta_text`, `header_cta_link`). The Header component uses `ct()` or `c()` with `t()` fallback.

**Footer:** Logo URL, tagline, description, copyright text, and company profile PDF download link come from `settings.footer` (keys: `footer_logo_url`, `footer_tagline`, `footer_description`, `footer_copyright`, `footer_profile_pdf`). Same fallback pattern.

---

## 9. Internationalization (i18n)

### 9.1 Configuration

Defined in `next-i18next.config.js`:

- **Default locale:** `en`
- **Supported locales:** `en`, `fr`, `de`, `tr`, `ar`, `ru`, `fa`, `id`, `fil`, `tk`, `tg`
- **Locale detection:** Disabled (handled by custom middleware)
- **Fallback:** `en`
- **Debug:** Enabled in development

### 9.2 Content Strategy: CMS-First with Translation Fallback

All website text content is now primarily managed through the CMS via the Pages module (see Section 8). The `next-i18next` translation files in `public/locales/` serve as a **fallback layer** — they are still loaded and available via `t()`, but components check CMS content first using `c()`.

The CMS stores all 11 locales' content in `PageSectionContent.contentJson` fields, seeded from the original translation JSON files via `scripts/seed-pages-from-translations.js` in the CMS project.

### 9.3 Translation Namespaces (Fallback)

Each locale has 60+ translation JSON files in `public/locales/{locale}/`. Key namespaces include:

| Namespace | Content |
|-----------|---------|
| `common.json` | Shared translations (hero, jobs, services, navigation, footer) |
| `about.json` | About page content |
| `blogpage.json` | Blog page translations |
| `contact.json` | Contact form translations |
| `jobboard.json` | Job board UI translations |
| `immigrationservices.json` | Immigration services content |
| `resumeservice.json` | Resume service content |
| `talentacquisition.json` | Talent acquisition content |
| `turkeyimmi.json` | Turkey immigration content |
| `usaimmi.json` | USA immigration content |
| `ukimmi.json` | UK immigration content |
| `canadaimmi.json` | Canada immigration content |
| `hire-workers.json` | Hire workers page content |
| `work-permit.json` | Work permit page content |
| `citizenship.json` | Citizenship page content |
| `visa.json` | Visa page content |
| `services.json` | Services overview content |

Total: **744 translation JSON files** across all locales.

### 9.4 RTL Support

Arabic (`ar`) and Persian (`fa`) locales receive:
- `dir="rtl"` on document root
- RTL Ant Design `ConfigProvider` direction
- RTL font family: `Noto Sans Arabic, Poppins, sans-serif`
- RTL toast notification positioning (`top-left` instead of `top-right`)
- RTL CSS class (`rtl-layout`) on app wrapper

### 9.5 Geo-Detection Middleware

Automatic locale assignment based on visitor's country (see Section 3.4 for full details).

### 9.6 Translation Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `i18n-check.js` | `npm run i18n:check` | Validates translation keys across all locales; reports missing keys |
| `translate-with-deepl.js` | `npm run translate` | Auto-translates missing keys using DeepL API |
| `sync-locale-keys.js` | (manual) | Synchronizes locale keys across all languages |
| `translate-locales.js` | (manual) | Translation utility |

---

## 10. External Integrations

### 10.1 CRM API

**Base URL:** `https://crm.jobsadmire.com` (configurable via `NEXT_PUBLIC_CRM_API_URL`)

**Authentication:** Bearer JWT token (hardcoded in `crmUtils.js`)

**Endpoints Used:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/consultancy/inquiries/create` | POST | General inquiry creation (contact forms, service inquiries) |
| `/api/consultancy/inquiries/recruiters` | POST | Recruiter agency registration |
| `/api/consultancy/inquiries/business-owners` | POST | Job provider/business owner registration |
| `/api/lead-save` | POST | Contact form lead capture |
| Job listing endpoints | GET | Fetching jobs for job board and homepage |
| Category endpoints | GET | Fetching job categories |

### 10.2 Blog API

**Base URL:** `https://phpstack-1309382-5454384.cloudwaysapps.com/api/blogs.php` (configurable via `NEXT_PUBLIC_BLOG_API_URL`)

**Usage:**
- Fetching blog post listings with category filtering
- Fetching individual blog posts by slug (SSR)
- Blog category retrieval

### 10.3 University API

**Base URL:** `https://dev-university-service.uniadmire.com/` (configurable via `NEXT_PUBLIC_UNIVERSITY_API_URL`)

**Endpoints proxied through Next.js API routes:**

| Proxy Route | External Endpoint | Purpose |
|-------------|-------------------|---------|
| `/api/countries` | `/api/universities/countries` | List countries with universities |
| `/api/universities` | `/api/universities/public` | List universities (optional country filter) |
| `/api/programs` | `/api/programs` | List programs for a university |

**API Services using University API:**
- `UniversityService`: `getAllPrograms()`, `getAllProgramsNames()`, `getCountries()`, `getUniversitiesIdsAndNames()`, `getUniversitiesCount()`
- `StudentService`: `getStudentsCount()`, `getCountries()`

### 10.4 Google Gemini AI API

**Base URL:** `https://generativelanguage.googleapis.com/v1beta` (configurable via `NEXT_PUBLIC_GEMINI_API_URL`)

**API Key:** `NEXT_PUBLIC_GEMINI_API_KEY`

**Usage:** Auto-generating professional profile summaries during candidate registration (`/register-as-candidate`). The AI takes candidate information and produces a polished professional summary.

### 10.5 Resend (Email)

**API Key:** `RESEND_API_KEY`

**Used by 4 API routes for transactional emails:**

| Route | Email Type |
|-------|-----------|
| `/api/send-visa-application` | Admin notification (with attachments) + applicant confirmation |
| `/api/send-popup-form` | Service-type-specific inquiry notification |
| `/api/send-form` | Country-specific residence permit inquiry |
| `/api/send-form-email` | Admin notification + client confirmation with rich HTML |

**Email addresses configured via:**
- `FROM_EMAIL` -- Sender address
- `TO_EMAIL` -- Default admin recipient
- `RECIPIENT_EMAIL` -- Additional recipient

### 10.6 RestCountries API

**Base URL:** `https://restcountries.com/v3.1` (configurable via `NEXT_PUBLIC_RESTCOUNTRIES_API_URL`)

**Usage:** Fetching country data for dropdowns and country information display.

### 10.7 Sentry (Error Monitoring)

**Configuration:**
- Organization: `jobsadmire`
- Project: `jobsadmire-website`
- Tunnel route: `/monitoring` (bypasses ad-blockers)
- Source maps upload enabled
- Logger tree-shaking enabled
- Vercel Cron Monitors enabled

**Config files:**
- `sentry.client.config.js` -- Client-side Sentry initialization
- `sentry.server.config.js` -- Server-side Sentry initialization
- `sentry.edge.config.js` -- Edge runtime Sentry initialization

**Usage in application:**
- Error page (`_error.jsx`) reports to Sentry
- Partner registration pages (`recruiter-agency.js`, `job-provider.js`) use Sentry event tracking
- Test endpoint at `/api/sentry-example-api`

### 10.8 Google Analytics, GTM, and Google Ads

**Google Analytics:**
- Tracking ID: `G-77Y5KBV97L`
- Injected via `next/script` in `_app.jsx`

**Google Tag Manager:**
- Container ID: `GTM-N2CLWJWJ`
- Injected in `_document.jsx`

**Google Ads:**
- Conversion ID: `AW-17096273578`
- Conversion tracking on `/thankyou` page

### 10.9 Scaleway Object Storage

**Domain:** `techadmire.s3.fr-par.scw.cloud`

Configured as an allowed image domain in `next.config.js` for Next.js Image optimization.

---

## 11. Data Models

### 11.1 MySQL Database -- Applications

**Table: `applications`**

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (auto) | Primary key |
| `name` | VARCHAR | First name |
| `surname` | VARCHAR | Last name |
| `email` | VARCHAR | Email address |
| `phone` | VARCHAR | Phone number |
| `date_of_birth` | VARCHAR | Date of birth |
| `job_category` | VARCHAR | Job category |
| `password` | VARCHAR | Account password |
| `address` | VARCHAR | Address |
| `country` | VARCHAR | Country |
| `city` | VARCHAR | City |
| `state` | VARCHAR | State/province |
| `place_of_birth` | VARCHAR | Place of birth |
| `passport_number` | VARCHAR | Passport number |
| `gender` | VARCHAR | Gender |
| `abroad_residence_address` | VARCHAR | Abroad residence address |
| `weight` | FLOAT | Weight |
| `height` | FLOAT | Height |
| `programming_languages` | VARCHAR | Programming languages known |
| `experience` | INT | Years of experience |
| `medical_license` | VARCHAR | Medical license info |
| `specialization` | VARCHAR | Specialization |
| `created_at` | DATETIME | Creation timestamp |

**Table: `experiences`**

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (auto) | Primary key |
| `application_id` | INT (FK) | References `applications.id` |
| `type` | ENUM | `project`, `work`, `qualification`, `skill` |
| `skill_type` | VARCHAR | Skill sub-type (for type=`skill`) |
| `title` | VARCHAR | Title/name |
| `organization` | VARCHAR | Organization/company |
| `start_date` | VARCHAR | Start date |
| `end_date` | VARCHAR | End date |
| `reference` | VARCHAR | Reference info |

### 11.2 LocalStorage -- Candidate Profiles

Managed by `candidateService.js` (key: `job_platform_candidates`).

**Candidate Object:**

```json
{
  "id": "number (timestamp)",
  "fullName": "string",
  "profession": "string",
  "location": "string",
  "profileImage": "string (base64 or URL)",
  "skills": ["string"],
  "expertise": ["string"],
  "category": "string (auto-categorized)",
  "yearsOfExperience": "number",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

**Categories:** `software-development`, `design`, `data-science`, `marketing`, `customer-support`, `business`

### 11.3 LocalStorage -- CV/Resume Data

Managed by `useCVData` hook. Structure:

```json
{
  "personal": {
    "firstName": "",
    "middleName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": "",
    "summary": "",
    "photo": "base64 string or null"
  },
  "experience": [
    {
      "jobTitle": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "school": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "gpa": ""
    }
  ],
  "skills": [
    {
      "name": "",
      "level": "Beginner | Intermediate | Advanced | Expert"
    }
  ],
  "certifications": [
    {
      "name": "",
      "organization": "",
      "date": ""
    }
  ]
}
```

### 11.4 Visa Data (JSON)

File: `src/data/visaData.json` (10,000+ lines)

Organized by country pairs (e.g., `"Pakistan-UK"`, `"Pakistan-USA"`):

```json
{
  "CountryA-CountryB": {
    "Tourism & Business": {
      "visa_required": true,
      "processing_time": "string",
      "validity": "string",
      "fees": "string",
      "documents": ["string"],
      "visa_types": ["string"]
    },
    "Work & Immigration": {
      "visa_required": true,
      "processing_time": "string",
      "validity": "string",
      "fees": "string",
      "documents": ["string"]
    }
  }
}
```

### 11.5 Countries List

File: `src/lib/utils/countries.js`

Array of **197 countries** with:
- `code` -- ISO country code
- `name` -- English country name
- Used for all country dropdown selectors across the application

### 11.6 Filter Constants

File: `src/lib/constants/filters.js`

| Filter Type | Options |
|-------------|---------|
| Sort | Suggested, Low to high, High to low, Approaching deadline |
| University Type | State, Private |
| Degree | Associate, Bachelor, Master (with/without thesis), PhD |
| Mode of Study | Full time, Part time, Online |
| Attendance | On site, Remote |
| Duration | 6 months, 1 year, 2 years, 3 years, 4 years, 5 years, 6 years |
| Gender | Male, Female |

---

## 12. Environment Variables

All environment variables are documented in `.env.example`:

### 12.1 API URLs (Public / Client-side)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_CMS_API_URL` | `http://localhost:4000/api/v1` | CMS API base URL for content, navigation, settings |
| `NEXT_PUBLIC_CRM_API_URL` | `https://crm.jobsadmire.com` | CRM API base URL for jobs, inquiries, leads |
| `NEXT_PUBLIC_BLOG_API_URL` | `https://phpstack-1309382-5454384.cloudwaysapps.com/api/blogs.php` | Blog API endpoint |
| `NEXT_PUBLIC_UNIVERSITY_API_URL` | `https://dev-university-service.uniadmire.com/` | University service API |
| `NEXT_PUBLIC_GEMINI_API_KEY` | (none) | Google Gemini API key for AI profile summaries |
| `NEXT_PUBLIC_GEMINI_API_URL` | `https://generativelanguage.googleapis.com/v1beta` | Gemini API endpoint |
| `NEXT_PUBLIC_RESTCOUNTRIES_API_URL` | `https://restcountries.com/v3.1` | RestCountries API |
| `NEXT_PUBLIC_SITE_URL` | (none) | Public site URL |

### 12.2 Email (Resend) -- Server-side only

| Variable | Default | Description |
|----------|---------|-------------|
| `RESEND_API_KEY` | (none) | Resend API key for transactional emails |
| `RECIPIENT_EMAIL` | (none) | Admin recipient email |
| `FROM_EMAIL` | (none) | Sender email address |
| `TO_EMAIL` | (none) | Default recipient email |

### 12.3 Database (MySQL) -- Server-side only

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | MySQL host |
| `DB_USER` | `root` | MySQL username |
| `DB_PASSWORD` | (none) | MySQL password |
| `DB_NAME` | `job_applications` | MySQL database name |
| `DB_PORT` | `3306` | MySQL port |

### 12.4 Legacy/Optional API URLs

Defined in `src/lib/constants/env.js` but not in `.env.example`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_ACCOMMODATION_API_URL` | Accommodation service API |
| `NEXT_PUBLIC_PARTNER_API_URL` | Partner service API |
| `NEXT_PUBLIC_STUDENT_API_URL` | Student service API |
| `NEXT_PUBLIC_AUTH_URL` | Authentication service API |

---

## 13. Scripts and DevOps

### 13.1 NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev -p 7100` | Start development server on port 7100 |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server |
| `lint` | `next lint` | Run ESLint |
| `i18n:check` | `node scripts/i18n-check.js` | Validate translation keys across all locales |
| `translate` | `node scripts/translate-with-deepl.js` | Auto-translate missing keys via DeepL |

### 13.2 Translation Scripts

| Script | File | Description |
|--------|------|-------------|
| i18n Check | `scripts/i18n-check.js` | Scans all locale directories, compares translation keys against the English (`en`) base, and reports any missing keys per locale/namespace |
| DeepL Translation | `scripts/translate-with-deepl.js` | Takes missing keys from `i18n:check` and auto-translates them using the DeepL API, then writes results back to locale files |
| Locale Sync | `scripts/sync-locale-keys.js` | Ensures all locale files have the same keys structure as the base locale |
| Translate Locales | `scripts/translate-locales.js` | General translation utility script |

### 13.3 Sentry Configuration

| File | Purpose |
|------|---------|
| `sentry.client.config.js` | Client-side Sentry SDK initialization |
| `sentry.server.config.js` | Server-side Sentry SDK initialization |
| `sentry.edge.config.js` | Edge runtime Sentry SDK initialization |

**Sentry Webpack Plugin settings** (in `next.config.js`):
- Organization: `jobsadmire`
- Project: `jobsadmire-website`
- Source maps: Wide client file upload enabled
- Tunnel route: `/monitoring` (avoids ad-blocker issues)
- Logger: Auto tree-shaken in production
- Vercel Cron Monitors: Enabled

### 13.4 Build and Deployment Notes

- The project uses the **Next.js Pages Router** (not App Router)
- React Strict Mode is enabled
- Styled Components compiler is enabled for SSR
- Images are optimized via Next.js Image component with allowed domain `techadmire.s3.fr-par.scw.cloud`
- Two permanent redirects are configured (`/home` -> `/`, `/services/career-councelling` -> `/services/career-counselling`)
- The middleware handles geo-based locale routing for all non-API, non-static paths

---

*This document was generated from a comprehensive scan of the JobsAdmire codebase.*
