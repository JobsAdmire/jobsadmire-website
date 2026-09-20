// Vitest stand-in for Next's `server-only` marker. There is no top-level `server-only` package
// in node_modules: Next ships `next/dist/compiled/server-only` (whose default export condition
// throws) and aliases the bare specifier at build time, and `next/types/global.d.ts` declares
// the module for tsc. Vitest sees neither, so `vitest.config.mts` points the specifier here.
// Empty on purpose (R2): the guard is a build-time one, and the modules that carry it are
// unit-tested here as plain functions.
export {};
