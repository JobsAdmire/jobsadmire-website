// The barrel for `@/lib/format/date` — forbidden outside the dev gallery (W147/W156) because it
// would pull both full message catalogues (`formatReadMinutes`) into anything that reaches it. A
// real consumer imports the specific file it needs, e.g. `@/lib/format/date/formatDate` — see
// `PostCard.tsx`. This barrel exists only so the dev gallery (which proves the set compiles) and
// tests can import the whole module by its old, single-file name.
export { formatDate } from './formatDate';
export { formatMonth } from './formatMonth';
export { formatReadMinutes } from './formatReadMinutes';
