/**
 * Sync new translation keys from en to other locales.
 * Only adds keys that are missing in the locale; uses English value.
 */
const fs = require("fs");
const path = require("path");

const LOCALES_DIR = path.join(__dirname, "..", "public", "locales");
const SOURCE_LOCALE = "en";
const TARGET_LOCALES = ["fr", "de", "tr", "ar", "ru", "fa"];
const FILES_TO_SYNC = ["common.json", "recruiter-agency.json", "job-provider.json", "resume-generator.json", "privacy.json", "servicepopup.json", "about.json"];
const FILES_TO_COPY = ["terms.json"];

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else if (target[key] === undefined) {
      target[key] = source[key];
    }
  }
  return target;
}

function syncFile(locale, filename) {
  const enPath = path.join(LOCALES_DIR, SOURCE_LOCALE, filename);
  const localePath = path.join(LOCALES_DIR, locale, filename);
  if (!fs.existsSync(enPath)) return;
  if (!fs.existsSync(localePath)) {
    const content = fs.readFileSync(enPath, "utf8");
    fs.writeFileSync(localePath, content);
    console.log(`  Created ${locale}/${filename}`);
    return;
  }
  const enData = JSON.parse(fs.readFileSync(enPath, "utf8"));
  const localeData = JSON.parse(fs.readFileSync(localePath, "utf8"));
  deepMerge(localeData, enData);
  fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2));
  console.log(`  Merged ${locale}/${filename}`);
}

function copyFile(locale, filename) {
  const enPath = path.join(LOCALES_DIR, SOURCE_LOCALE, filename);
  const localePath = path.join(LOCALES_DIR, locale, filename);
  if (!fs.existsSync(enPath)) return;
  const content = fs.readFileSync(enPath, "utf8");
  fs.writeFileSync(localePath, content);
  console.log(`  Copied ${locale}/${filename}`);
}

for (const locale of TARGET_LOCALES) {
  const localeDir = path.join(LOCALES_DIR, locale);
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
  }
  console.log(`Syncing locale: ${locale}`);
  for (const file of FILES_TO_SYNC) {
    syncFile(locale, file);
  }
  for (const file of FILES_TO_COPY) {
    copyFile(locale, file);
  }
}
console.log("Done.");
