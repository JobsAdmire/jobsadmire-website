#!/usr/bin/env node

/**
 * Translation Sync Script
 *
 * Usage:
 *   node scripts/sync-translations.js import   # Push local JSON files → CMS
 *   node scripts/sync-translations.js export   # Pull CMS translations → local JSON files
 *
 * Requires the CMS to be running (default http://localhost:4000).
 * Uses ADMIN_EMAIL / ADMIN_PASSWORD from .env or defaults to seed credentials.
 */

const fs = require('fs');
const path = require('path');

// ── Configuration ──────────────────────────────────────────────────
const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:4000/api/v1';
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL || 'admin@jobsadmire.com';
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD || 'admin123456';
const LOCALES_DIR = path.resolve(__dirname, '../public/locales');

// ── Helpers ────────────────────────────────────────────────────────

function flatten(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, fullKey));
    } else {
      result[fullKey] = typeof value === 'string' ? value : JSON.stringify(value);
    }
  }
  return result;
}

function unflatten(flat) {
  const result = {};
  for (const [dottedKey, value] of Object.entries(flat)) {
    const parts = dottedKey.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) current[parts[i]] = {};
      current = current[parts[i]];
    }
    let parsed = value;
    try {
      const tmp = JSON.parse(value);
      if (typeof tmp !== 'string') parsed = tmp;
    } catch {}
    current[parts[parts.length - 1]] = parsed;
  }
  return result;
}

async function login() {
  const res = await fetch(`${CMS_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.data?.accessToken || data.accessToken;
}

async function cmsPost(path, body, token) {
  const res = await fetch(`${CMS_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

async function cmsGet(path, token) {
  const res = await fetch(`${CMS_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`GET ${path} failed: ${res.status}`);
  }
  return res.json();
}

// ── Import: local JSON → CMS ──────────────────────────────────────

async function importTranslations() {
  console.log('Logging in to CMS...');
  const token = await login();
  console.log('Authenticated.\n');

  const locales = fs.readdirSync(LOCALES_DIR).filter((d) =>
    fs.statSync(path.join(LOCALES_DIR, d)).isDirectory()
  );

  let totalImported = 0;

  for (const locale of locales) {
    const localeDir = path.join(LOCALES_DIR, locale);
    const files = fs.readdirSync(localeDir).filter((f) => f.endsWith('.json'));

    for (const file of files) {
      const namespace = file.replace('.json', '');
      const filePath = path.join(localeDir, file);
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const flat = flatten(raw);
      const keyCount = Object.keys(flat).length;

      if (keyCount === 0) continue;

      try {
        const result = await cmsPost('/admin/translations/import', {
          namespace,
          locale,
          data: flat,
        }, token);
        const imported = result.data?.imported ?? result.imported ?? keyCount;
        totalImported += imported;
        console.log(`  [${locale}] ${namespace}: ${imported} keys imported`);
      } catch (err) {
        console.error(`  [${locale}] ${namespace}: FAILED - ${err.message}`);
      }
    }
  }

  console.log(`\nDone. Total keys imported: ${totalImported}`);
}

// ── Export: CMS → local JSON ──────────────────────────────────────

async function exportTranslations() {
  console.log('Logging in to CMS...');
  const token = await login();
  console.log('Authenticated.\n');

  const nsResult = await cmsGet('/admin/translations/namespaces', token);
  const namespaces = (nsResult?.data || nsResult || []).map((ns) => ns.namespaceKey);

  if (namespaces.length === 0) {
    console.log('No namespaces found in CMS. Nothing to export.');
    return;
  }

  const locales = fs.readdirSync(LOCALES_DIR).filter((d) =>
    fs.statSync(path.join(LOCALES_DIR, d)).isDirectory()
  );

  let totalExported = 0;

  for (const locale of locales) {
    const localeDir = path.join(LOCALES_DIR, locale);

    for (const namespace of namespaces) {
      try {
        const flat = await cmsGet(
          `/admin/translations/${namespace}/export?locale=${locale}`,
          token
        );
        const data = flat?.data || flat || {};
        const keyCount = Object.keys(data).length;

        if (keyCount === 0) continue;

        const nested = unflatten(data);
        const filePath = path.join(localeDir, `${namespace}.json`);
        fs.writeFileSync(filePath, JSON.stringify(nested, null, 2) + '\n', 'utf-8');
        totalExported += keyCount;
        console.log(`  [${locale}] ${namespace}: ${keyCount} keys exported`);
      } catch (err) {
        console.error(`  [${locale}] ${namespace}: FAILED - ${err.message}`);
      }
    }
  }

  console.log(`\nDone. Total keys exported: ${totalExported}`);
}

// ── Main ──────────────────────────────────────────────────────────

const command = process.argv[2];

if (command === 'import') {
  importTranslations().catch((err) => {
    console.error('Import failed:', err.message);
    process.exit(1);
  });
} else if (command === 'export') {
  exportTranslations().catch((err) => {
    console.error('Export failed:', err.message);
    process.exit(1);
  });
} else {
  console.log('Usage: node scripts/sync-translations.js [import|export]');
  console.log('  import - Push local JSON translation files to CMS');
  console.log('  export - Pull CMS translations to local JSON files');
  process.exit(1);
}
