import { getPage } from './cms'

/**
 * Flatten CMS page sections into a single { "sectionKey.field": value } map.
 */
export function flattenPageSections(page) {
  if (!page?.sections) return {}
  const flat = {}
  for (const section of page.sections) {
    const content = section.contents?.[0]
    if (!content?.contentJson) continue
    for (const [key, value] of Object.entries(content.contentJson)) {
      flat[`${section.sectionKey}.${key}`] = value
    }
  }
  return flat
}

/**
 * Fetch a CMS page by slug + locale, flatten its sections, and return the map.
 * If the page doesn't exist, returns an empty object (graceful fallback).
 */
export async function getCmsPageContent(slug, locale) {
  const page = await getPage(slug, locale)
  return flattenPageSections(page)
}

/**
 * Fetch page content AND shared layout content, merging them.
 * Page-specific values override layout values on collision.
 */
export async function getPageAndLayoutContent(pageSlug, locale) {
  const [pageContent, layoutContent] = await Promise.all([
    getCmsPageContent(pageSlug, locale),
    getCmsPageContent('_layout', locale),
  ])
  return { ...layoutContent, ...pageContent }
}
