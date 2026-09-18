import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// R25: vitest runs without `globals: true`, so RTL never registers its own cleanup —
// without this every component test leaks its DOM into the next one.
afterEach(cleanup);
