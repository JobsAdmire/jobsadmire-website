export { Breadcrumbs, type Crumb } from './Breadcrumbs';
export { ClosingCtaBand, type Cta } from './ClosingCtaBand';
export { ContactCta, type ContactCtaProps, type PageContactPlacement } from './ContactCta';
export { EmptyState, type EmptyStateCta } from './EmptyState';
export { FaqBlock, type FaqAskCard, type FaqItem } from './FaqBlock';
export { ImageSlot, type ImageSlotProps } from './ImageSlot';
export { LogoMarquee, type Logo } from './LogoMarquee';
export { MetricStrip } from './MetricStrip';
export { NewsletterBand } from './NewsletterBand';
export { OfficeCard } from './OfficeCard';
export { PostCard } from './PostCard';
export { ProcessSteps, type ProcessStep } from './ProcessSteps';
export { StoreBadges } from './StoreBadges';
// Row types come from T0b — one definition (`src/content/collections.ts`), re-exported here
// so a page that composes blocks needs one import.
export type { BlogPost, Metric, MetricKey, Office } from '@/content/collections';
