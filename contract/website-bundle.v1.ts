import { z } from 'zod';

export const CONTRACT_VERSION = '1.0' as const;

export const LocaleSchema = z.enum(['tr', 'en']);

export const NavItemSchema = z.object({
  group: z.enum([
    'slimBarLeft',
    'slimBarRight',
    'desktopNav',
    'hamburger',
    'footerEmployers',
    'footerCompany',
    'footerContact',
    'mobileBottomBar',
    'socialRail',
  ]),
  order: z.number().int().nonnegative(),
  labelId: z.string().min(1),
  href: z.string().min(1),
  external: z.boolean(),
  visibleOn: z.array(z.enum(['desktop', 'mobile'])).min(1),
});

export const SettingsSchema = z.object({
  siteUrl: z.string().url(),
  phone: z.string().regex(/^\+\d{8,15}$/),
  phoneDisplay: z.string(),
  partnershipsPhone: z
    .string()
    .regex(/^\+\d{8,15}$/)
    .nullable(),
  email: z.string().email(),
  careersEmail: z.string().email(),
  whatsappNumber: z.string().regex(/^\d{8,15}$/),
  telegramUrl: z.string().url(),
  social: z.object({
    instagram: z.string().url(),
    tiktok: z.string().url(),
    linkedin: z.string().url(),
    facebook: z.string().url(),
  }),
  licence: z.object({ permitNo: z.string(), lawRef: z.string(), taxNo: z.string() }),
  storeLinks: z.object({ android: z.string().url().nullable(), ios: z.string().url().nullable() }),
  portal: z.object({ host: z.string().url(), loginPath: z.string(), forgotPath: z.string() }),
  maps: z.object({ antalya: z.string().url(), karachi: z.string().url() }),
  analytics: z.object({
    ga4Id: z.string().nullable(),
    gtmId: z.string().nullable(),
    adsId: z.string().nullable(),
    adsConversionLabel: z.string().nullable(),
    consentMode: z.boolean(),
  }),
  turnstileSiteKey: z.string().nullable(),
});

export const PageSeoSchema = z.object({
  titleId: z.string(),
  descriptionId: z.string(),
  ogImage: z.string().url().nullable(),
  canonical: z.string().url().nullable(),
  robots: z.enum(['index', 'noindex']),
  jsonLd: z.array(
    z.enum(['organization', 'website', 'breadcrumb', 'faq', 'article', 'jobPosting']),
  ),
});

export const RedirectSchema = z.object({
  from: z.string(),
  to: z.string(),
  status: z.union([z.literal(301), z.literal(308)]),
});

export const BundleSchema = z.object({
  contractVersion: z.literal(CONTRACT_VERSION),
  locale: LocaleSchema,
  generatedAt: z.string().datetime(),
  strings: z.record(z.string(), z.string()),
  nav: z.array(NavItemSchema),
  settings: SettingsSchema,
  pages: z.record(z.string(), PageSeoSchema),
  /** collections are typed per key as pages are ported (additive within 1.x) */
  collections: z.record(z.string(), z.array(z.record(z.string(), z.unknown()))),
  redirects: z.array(RedirectSchema),
});

export type Bundle = z.infer<typeof BundleSchema>;
export type NavItem = z.infer<typeof NavItemSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
