# Pending Static Labels – Components & Pages Used on the Website

Components and pages below are **used on the website** and may still contain **static (hardcoded) user-facing labels**. Move these into locale files and replace with `t()` for full i18n.

**Fully implemented:** Candidate-form homeform, resume forms (PersonalForm–SkillsForm), templates (alts, fallbacks, TemplateSelector, yourResume, clean-resume, professional-resume1–10), residence heroes (dubai, kazakhstan, china, albania), privacy (hero, nav, about, section titles **and full body copy** – all sections use `page.body.*` from `privacy.json`), home/BlogSection (blogcarousel + readTime labels), jobdetail/hero.jsx (all labels use `job-detail` hero keys), jobdetail/description.jsx (uses job-detail namespace), LanguageSwitcher (aria-label uses `labels.general.selectLanguageAria`), partner pages (recruiter-agency, job-provider use t() for image alt and placeholders).

---

## 1. Pages (direct routes)

| Page | Route | Status |
|------|--------|--------|
| **Partner recruiter-agency** | `/partner/recruiter-agency` | Wired (t for alt, placeholders) |
| **Partner job-provider** | `/partner/job-provider` | Wired (t for alt, placeholders) |
| **Blog** | `/blog` | Blog carousel uses blogcarousel.json + readTime |
| **Privacy** | `/privacy` | Full body in `privacy.json` `page.body.*` |

---

## 2. Components – status

| Component | Status |
|-----------|--------|
| **home/BlogSection.jsx** | Uses blogcarousel.json; readTime uses `readTime.defaultMinutes` / `readTime.suffix` |
| **jobdetail/description.jsx** | Uses job-detail namespace |
| **jobdetail/hero.jsx** | Uses job-detail `hero.*` keys |
| **LanguageSwitcher.js** | aria-label uses `labels.general.selectLanguageAria` |
| **legal/privacy.jsx** | All body sections use `t("page.body.*")` |  

---

## 4. Namespaces in use

- **common** – shared labels, footer, blog, templates, visa page, register company/candidate, profile, humanResource, submitResume, partnerRegister, residenceHero, candidateForm, etc.
- **resume-generator** – resume builder steps, forms, alts, fallbacks, templateSelector
- **privacy** – privacy page (hero, about, section titles; body copy pending)
- **terms** – terms page
- **job-detail** – job detail page
- **work-permit** – work permit page
- **thankyou** – thank you page
- **recruiter-agency**, **job-provider** – partner pages
