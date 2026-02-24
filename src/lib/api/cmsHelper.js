import * as cms from './cms'

/**
 * Fetches shared layout data (navigation, settings) from the CMS.
 * Call this inside getStaticProps / getServerSideProps and spread into props.
 */
export async function getLayoutCmsProps(locale) {
  const [headerNav, footerNav, servicesMegaNav, partnerNav, contactSettings, socialSettings, headerSettings, footerSettings] =
    await Promise.all([
      cms.getNavigation('HEADER', locale),
      cms.getNavigation('FOOTER', locale),
      cms.getNavigation('SERVICES_MEGA', locale),
      cms.getNavigation('PARTNER_DROPDOWN', locale),
      cms.getSettings('contact'),
      cms.getSettings('social'),
      cms.getSettings('header'),
      cms.getSettings('footer'),
    ])

  return {
    cmsNav: {
      header: headerNav,
      footer: footerNav,
      servicesMega: servicesMegaNav,
      partner: partnerNav,
    },
    cmsSettings: {
      contact: settingsArrayToMap(contactSettings),
      social: settingsArrayToMap(socialSettings),
      header: settingsArrayToMap(headerSettings),
      footer: settingsArrayToMap(footerSettings),
    },
  }
}

/**
 * Fetches homepage-specific CMS data (services, stats, testimonials, destinations).
 */
export async function getHomeCmsProps(locale) {
  const [services, stats, testimonials, destinations] = await Promise.all([
    cms.getServices(locale),
    cms.getStats(locale),
    cms.getTestimonials(),
    cms.getDestinations(locale),
  ])

  return {
    cmsServices: services || [],
    cmsStats: stats || [],
    cmsTestimonials: testimonials || [],
    cmsDestinations: destinations || [],
  }
}

function settingsArrayToMap(settings) {
  if (!settings) return {}
  if (typeof settings === 'object' && !Array.isArray(settings)) return settings
  if (!Array.isArray(settings)) return {}
  const map = {}
  for (const s of settings) {
    map[s.key] = s.valueJson
  }
  return map
}
