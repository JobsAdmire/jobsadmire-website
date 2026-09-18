// Named `JsonLdScript` rather than `JsonLd` because macOS' case-insensitive filesystem cannot
// tell `JsonLd.tsx` from the builders' `jsonld.ts`: TS resolves `@/lib/seo/JsonLd` to
// `jsonld.ts` and fails the build (TS1149). The exported component keeps its name.

/** Renders a JSON-LD graph node. `<` is escaped so a string from the bundle can never close
 *  the script tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
