import { env } from '../constants/env'

const CMS_BASE = env.CMS_API_URL

async function cmsGet(path, { locale, params = {} } = {}) {
  const url = new URL(`${CMS_BASE}${path}`)
  if (locale) url.searchParams.set('locale', locale)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v)
  })

  try {
    const res = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data ?? json
  } catch {
    return null
  }
}

// ── Navigation ──────────────────────────────────────────────────────
export function getNavigation(location, locale) {
  return cmsGet(`/navigation/${location}`, { locale })
}

// ── Services ────────────────────────────────────────────────────────
export function getServices(locale) {
  return cmsGet('/services', { locale })
}

export function getServiceBySlug(slug, locale) {
  return cmsGet(`/services/${slug}`, { locale })
}

// ── Testimonials ────────────────────────────────────────────────────
export function getTestimonials() {
  return cmsGet('/testimonials')
}

// ── Stats ───────────────────────────────────────────────────────────
export function getStats(locale) {
  return cmsGet('/stats', { locale })
}

// ── Destinations (Immigration) ──────────────────────────────────────
export function getDestinations(locale) {
  return cmsGet('/destinations', { locale })
}

// ── Pages ───────────────────────────────────────────────────────────
export function getPage(slug, locale) {
  return cmsGet(`/pages/${slug}`, { locale })
}

// ── FAQs ─────────────────────────────────────────────────────────────
export function getFaqs(pageSlug, locale) {
  return cmsGet(`/faqs/page/${encodeURIComponent(pageSlug)}`, { locale })
}

// ── Settings ────────────────────────────────────────────────────────
export function getSettings(group) {
  return cmsGet(`/settings/group/${group}`)
}

