import { createContext, useContext } from 'react'

const CmsContext = createContext({
  nav: { header: null, footer: null, servicesMega: null, partner: null },
  settings: { contact: {}, social: {} },
  services: [],
  stats: [],
  testimonials: [],
  destinations: [],
})

export function CmsProvider({ value, children }) {
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  return useContext(CmsContext)
}
