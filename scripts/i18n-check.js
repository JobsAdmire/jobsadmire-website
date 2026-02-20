#!/usr/bin/env node
/*
  i18n key parity checker (enhanced)
  - Discovers all locale languages under public/locales
  - Uses `en` as source of truth
  - Checks ALL JSON files present in `en` locale folder
  - Reports per-language issues: missing files, missing keys, extra files, extra keys, and type mismatches
  - Exits non-zero if any errors are found
*/
const fs = require("fs");
const path = require("path");

const baseLang = "en";
const localesDir = path.join(process.cwd(), "public", "locales");

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`Failed to read/parse ${filePath}: ${e.message}`);
  }
}

function flattenKeys(obj, prefix = "") {
  const keys = new Set();
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    if (prefix) keys.add(prefix);
    return keys;
  }
  for (const [k, v] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const child = flattenKeys(v, next);
      child.forEach((ck) => keys.add(ck));
    } else {
      keys.add(next);
    }
  }
  return keys;
}

function flattenTypes(obj, prefix = "", out = {}) {
  const typeOf = (val) => {
    if (val === null) return "null";
    if (Array.isArray(val)) return "array";
    return typeof val; // 'object', 'string', 'number', 'boolean'
  };
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    if (prefix) out[prefix] = typeOf(obj);
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flattenTypes(v, next, out);
    } else {
      out[next] = typeOf(v);
    }
  }
  return out;
}

let problems = [];

// Discover languages
if (!fs.existsSync(localesDir)) {
  console.error(`Locales directory not found: ${localesDir}`);
  process.exit(1);
}
const langs = fs
  .readdirSync(localesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

if (!langs.includes(baseLang)) {
  problems.push({
    level: "error",
    message: `Base language folder '${baseLang}' not found under public/locales`,
  });
}

const targetLangs = langs.filter((l) => l !== baseLang);

// Discover all JSON files present in base language
const baseDir = path.join(localesDir, baseLang);
let baseFiles = [];
try {
  baseFiles = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith(".json"))
    .map((d) => d.name)
    .sort();
} catch (e) {
  problems.push({
    level: "error",
    message: `Unable to read base directory '${baseDir}': ${e.message}`,
  });
}

// For each language, warn for extra files not present in base
for (const lang of targetLangs) {
  const langDir = path.join(localesDir, lang);
  let langFiles = [];
  try {
    langFiles = fs
      .readdirSync(langDir, { withFileTypes: true })
      .filter((d) => d.isFile() && d.name.toLowerCase().endsWith(".json"))
      .map((d) => d.name)
      .sort();
  } catch (e) {
    problems.push({
      level: "error",
      message: `Unable to read language directory '${langDir}': ${e.message}`,
    });
    continue;
  }
  const extraFiles = langFiles.filter((f) => !baseFiles.includes(f));
  if (extraFiles.length) {
    problems.push({
      level: "warn",
      message: `[${lang}] has extra files not in '${baseLang}':\n  - ${extraFiles.join("\n  - ")}`,
    });
  }
}

// Compare files present in base across all languages
for (const fileName of baseFiles) {
  const basePath = path.join(localesDir, baseLang, fileName);
  const baseJson = readJson(basePath);
  const baseKeys = flattenKeys(baseJson);
  const baseTypes = flattenTypes(baseJson);

  for (const lang of targetLangs) {
    const langPath = path.join(localesDir, lang, fileName);
    if (!fs.existsSync(langPath)) {
      problems.push({
        level: "error",
        message: `[${lang}] missing file: ${path.relative(process.cwd(), langPath)}`,
      });
      continue;
    }
    let langJson;
    try {
      langJson = readJson(langPath);
    } catch (e) {
      problems.push({
        level: "error",
        message: `[${lang}] cannot parse ${path.relative(process.cwd(), langPath)}: ${e.message}`,
      });
      continue;
    }
    const langKeys = flattenKeys(langJson);
    const langTypes = flattenTypes(langJson);

    const missing = [...baseKeys].filter((k) => !langKeys.has(k));
    const extra = [...langKeys].filter((k) => !baseKeys.has(k));

    // Type mismatches on shared keys
    const shared = [...baseKeys].filter((k) => langKeys.has(k));
    const typeMismatches = shared.filter((k) => baseTypes[k] !== langTypes[k]);

    const rel = path.relative(process.cwd(), langPath);
    if (missing.length) {
      problems.push({
        level: "error",
        message: `[${lang}] ${fileName} missing keys (${missing.length}):\n  - ${missing.join("\n  - ")}`,
      });
    }
    if (extra.length) {
      problems.push({
        level: "warn",
        message: `[${lang}] ${fileName} has extra keys (${extra.length}):\n  - ${extra.join("\n  - ")}`,
      });
    }
    if (typeMismatches.length) {
      const details = typeMismatches
        .map((k) => `  - ${k} (en: ${baseTypes[k]} | ${lang}: ${langTypes[k]})`)
        .join("\n");
      problems.push({
        level: "error",
        message: `[${lang}] ${fileName} type mismatches (${typeMismatches.length}):\n${details}`,
      });
    }
  }
}

if (problems.length === 0) {
  console.log(
    "✓ i18n key parity check passed: all base files match across languages."
  );
  process.exit(0);
}

let errorCount = 0;
for (const p of problems) {
  if (p.level === "error") errorCount++;
  const tag = p.level === "error" ? "ERROR" : "WARN";
  console.log(`[${tag}] ${p.message}`);
}

process.exit(errorCount > 0 ? 1 : 0);
