import { createContext, useContext, useCallback } from 'react'

const CmsContentContext = createContext({})

export function CmsContentProvider({ content, children }) {
  return (
    <CmsContentContext.Provider value={content || {}}>
      {children}
    </CmsContentContext.Provider>
  )
}

/**
 * Access CMS page content.
 *
 * - `c(key, defaultValue)` -- returns a string
 * - `cObj(key, defaultValue)` -- parses JSON-encoded arrays/objects
 *
 * Usage:
 *   const { c, cObj } = useCmsContent()
 *   <h1>{c('hero.title', 'Find Your Dream Job')}</h1>
 *   {cObj('hero.animatedWords', ['Career']).map(w => ...)}
 */
export function useCmsContent() {
  const content = useContext(CmsContentContext)

  const c = useCallback(
    (key, defaultValue = '') => {
      return content[key] !== undefined ? content[key] : defaultValue
    },
    [content]
  )

  const cObj = useCallback(
    (key, defaultValue = []) => {
      const val = content[key]
      if (val === undefined) return defaultValue
      if (typeof val === 'string') {
        try { return JSON.parse(val) } catch { return defaultValue }
      }
      return val
    },
    [content]
  )

  return { c, cObj, content }
}
