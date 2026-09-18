import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // D23: the generated bundles are loaded through the content adapter, which is the only
  // place the production fixture guard runs. A direct import would walk straight past it.
  {
    files: ['src/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/content/local/*'],
              message: 'Bundles are loaded only through src/content/adapter.ts (D23)',
            },
          ],
        },
      ],
    },
  },
  // The only files that fail the rule and should: two component tests that render the chrome
  // against the real generated TR bundle as a fixture. D23 governs how the *running site*
  // loads a bundle — `adapter.ts`'s own loader is a template-literal dynamic import the rule
  // cannot see, and the lint/contract tests read the JSON with `readFileSync`, so neither
  // needs an exemption. Keep this list exact; do not widen it to a glob.
  {
    files: [
      'src/design/chrome/__tests__/Footer.test.tsx',
      'src/design/chrome/__tests__/Header.test.tsx',
    ],
    rules: { 'no-restricted-imports': 'off' },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Reference design runtime (not shipped, not linted)
    'design-package/**',
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
