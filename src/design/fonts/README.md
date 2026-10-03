# src/design/fonts

Font bytes read at request time by the Open Graph image route (`src/app/og/[locale]/[pageKey]/route.tsx`). The site's own text uses `next/font/google` (`src/app/[locale]/layout.tsx`); those self-hosted woff2 files live inside `.next/` and are neither readable by a route handler nor a format Satori (`next/og`) can rasterise, hence a static TTF here.

| File               | Source                                                                                                       | SHA-256                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `Archivo-Bold.ttf` | https://github.com/Omnibus-Type/Archivo — `fonts/ttf/Archivo-Bold.ttf` (static Bold instance, 192,180 bytes) | `951a0ebab63b1bb0d90a26c27625bda803d570dace3851fa2f1eea65852d8983` |
| `OFL.txt`          | same repository — SIL Open Font License 1.1 (Copyright 2020 The Archivo Project Authors)                     | `108b4e57c9c796d3d38d0428ca7ee39de47ad93187302718d9b2d8864b9b716b` |

`fonts.test.ts` pins both sizes and hashes. Google Fonts' copy of Archivo is the variable font only (`Archivo[wdth,wght].ttf`); Satori renders a variable font at its default (Regular) instance, which is why the static Bold is vendored from upstream instead. `next.config.ts` lists this folder in `outputFileTracingIncludes` for the route so the bytes always ship with the serverless function.
