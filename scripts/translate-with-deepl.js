/**
 * DeepL Translation Script
 * Translates all English locale files to target languages using DeepL API
 * 
 * Usage:
 *   npm run translate              # Translate all files to all languages
 *   npm run translate -- --lang=fr # Translate to specific language only
 *   npm run translate -- --file=common.json # Translate specific file only
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Configuration
const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');
const SOURCE_LOCALE = 'en';
const TARGET_LOCALES = ['fr', 'de', 'tr', 'ar', 'ru', 'fa'];

// DeepL API configuration
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api.deepl.com/v2/translate';
const BATCH_SIZE = 50; // Max texts per request
const DELAY_BETWEEN_BATCHES = 500; // ms delay to avoid rate limiting

// DeepL language code mapping
const DEEPL_LANG_MAP = {
  'fr': 'FR',
  'de': 'DE',
  'tr': 'TR',
  'ar': 'AR',
  'ru': 'RU',
  'fa': null // Not supported by DeepL
};

// Patterns to skip translation (URLs, emails, phone numbers, etc.)
const SKIP_PATTERNS = [
  /^https?:\/\//i,           // URLs
  /^mailto:/i,               // mailto links
  /^tel:/i,                  // tel links
  /^\+?\d[\d\s\-()]+$/,      // Phone numbers
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Emails
  /^\d+(\.\d+)?$/,           // Pure numbers
  /^#[a-fA-F0-9]{3,6}$/,     // Hex colors
  /^[A-Z_]+$/,               // Constants like "FEATURED_POSITION"
  /^\s*$/,                   // Empty or whitespace only
];

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    lang: null,
    file: null
  };
  
  for (const arg of args) {
    if (arg.startsWith('--lang=')) {
      options.lang = arg.split('=')[1];
    } else if (arg.startsWith('--file=')) {
      options.file = arg.split('=')[1];
    }
  }
  
  return options;
}

// Check if a string should be skipped
function shouldSkipTranslation(text) {
  if (typeof text !== 'string') return true;
  if (text.length === 0) return true;
  
  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(text)) return true;
  }
  
  return false;
}

// Flatten a nested object to key-value pairs with dot notation paths
function flattenObject(obj, prefix = '') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'string') {
          result[`${newKey}[${index}]`] = item;
        } else if (typeof item === 'object') {
          Object.assign(result, flattenObject(item, `${newKey}[${index}]`));
        }
      });
    } else {
      result[newKey] = value;
    }
  }
  
  return result;
}

// Unflatten a key-value object back to nested structure
// Preserves the original structure by keeping numeric string keys as objects
function unflattenObject(obj, originalStructure) {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(/\.|\[|\]/).filter(p => p !== '');
    let current = result;
    let originalCurrent = originalStructure;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      
      // Check if the original structure has an array at this position
      const isArray = originalCurrent && Array.isArray(originalCurrent[part]);
      
      if (!(part in current)) {
        current[part] = isArray ? [] : {};
      }
      current = current[part];
      
      // Navigate the original structure in parallel
      if (originalCurrent && originalCurrent[part]) {
        const idx = /^\d+$/.test(parts[i + 1]) ? parseInt(parts[i + 1]) : parts[i + 1];
        originalCurrent = isArray ? originalCurrent[part][idx] : originalCurrent[part];
      } else {
        originalCurrent = null;
      }
    }
    
    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  }
  
  return result;
}

// Translate texts using DeepL API
async function translateBatch(texts, targetLang) {
  const deeplLang = DEEPL_LANG_MAP[targetLang];
  
  if (!deeplLang) {
    console.log(`  Skipping ${targetLang} (not supported by DeepL)`);
    return texts; // Return original texts for unsupported languages
  }
  
  const response = await fetch(DEEPL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: texts,
      source_lang: 'EN',
      target_lang: deeplLang,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  return data.translations.map(t => t.text);
}

// Sleep function for rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Translate a single JSON file
async function translateFile(filename, targetLang) {
  const sourcePath = path.join(LOCALES_DIR, SOURCE_LOCALE, filename);
  const targetDir = path.join(LOCALES_DIR, targetLang);
  const targetPath = path.join(targetDir, filename);
  
  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Read source file
  const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  
  // Flatten to get all translatable strings
  const flattened = flattenObject(sourceContent);
  
  // Separate translatable and non-translatable entries
  const translatableEntries = [];
  const nonTranslatableEntries = [];
  
  for (const [key, value] of Object.entries(flattened)) {
    if (typeof value === 'string' && !shouldSkipTranslation(value)) {
      translatableEntries.push({ key, value });
    } else {
      nonTranslatableEntries.push({ key, value });
    }
  }
  
  console.log(`  ${filename}: ${translatableEntries.length} strings to translate`);
  
  // Batch translate
  const translatedEntries = [];
  
  for (let i = 0; i < translatableEntries.length; i += BATCH_SIZE) {
    const batch = translatableEntries.slice(i, i + BATCH_SIZE);
    const textsToTranslate = batch.map(e => e.value);
    
    try {
      const translatedTexts = await translateBatch(textsToTranslate, targetLang);
      
      for (let j = 0; j < batch.length; j++) {
        translatedEntries.push({
          key: batch[j].key,
          value: translatedTexts[j]
        });
      }
      
      // Progress indicator
      const progress = Math.min(i + BATCH_SIZE, translatableEntries.length);
      process.stdout.write(`\r    Progress: ${progress}/${translatableEntries.length}`);
      
      // Rate limiting delay
      if (i + BATCH_SIZE < translatableEntries.length) {
        await sleep(DELAY_BETWEEN_BATCHES);
      }
    } catch (error) {
      console.error(`\n    Error translating batch: ${error.message}`);
      // On error, keep original text
      for (const entry of batch) {
        translatedEntries.push(entry);
      }
    }
  }
  
  console.log(''); // New line after progress
  
  // Combine translated and non-translatable entries
  const resultFlattened = {};
  for (const entry of [...translatedEntries, ...nonTranslatableEntries]) {
    resultFlattened[entry.key] = entry.value;
  }
  
  // Unflatten back to nested structure, preserving original structure
  const result = unflattenObject(resultFlattened, sourceContent);
  
  // Write to target file
  fs.writeFileSync(targetPath, JSON.stringify(result, null, 2));
  
  return translatableEntries.length;
}

// Main translation function
async function main() {
  console.log('=== DeepL Translation Script ===\n');
  
  // Validate API key
  if (!DEEPL_API_KEY) {
    console.error('Error: DEEPL_API_KEY not found in environment variables');
    console.error('Please add DEEPL_API_KEY to your .env file');
    process.exit(1);
  }
  
  console.log('API Key:', DEEPL_API_KEY.substring(0, 8) + '...');
  
  // Parse arguments
  const options = parseArgs();
  
  // Get list of files to translate
  let files = fs.readdirSync(path.join(LOCALES_DIR, SOURCE_LOCALE))
    .filter(f => f.endsWith('.json'));
  
  if (options.file) {
    files = files.filter(f => f === options.file);
    if (files.length === 0) {
      console.error(`File not found: ${options.file}`);
      process.exit(1);
    }
  }
  
  // Get target languages
  let targets = TARGET_LOCALES;
  if (options.lang) {
    if (!TARGET_LOCALES.includes(options.lang)) {
      console.error(`Invalid language: ${options.lang}`);
      console.error(`Valid options: ${TARGET_LOCALES.join(', ')}`);
      process.exit(1);
    }
    targets = [options.lang];
  }
  
  console.log(`Source: ${SOURCE_LOCALE}`);
  console.log(`Targets: ${targets.join(', ')}`);
  console.log(`Files: ${files.length}\n`);
  
  // Translation stats
  const stats = {
    totalStrings: 0,
    filesProcessed: 0,
    errors: []
  };
  
  // Process each target language
  for (const targetLang of targets) {
    console.log(`\n--- Translating to ${targetLang.toUpperCase()} ---`);
    
    // Skip Persian (not supported by DeepL)
    if (!DEEPL_LANG_MAP[targetLang]) {
      console.log(`Skipping ${targetLang} (not supported by DeepL)`);
      continue;
    }
    
    for (const file of files) {
      try {
        const count = await translateFile(file, targetLang);
        stats.totalStrings += count;
        stats.filesProcessed++;
      } catch (error) {
        console.error(`  Error processing ${file}: ${error.message}`);
        stats.errors.push({ file, lang: targetLang, error: error.message });
      }
    }
  }
  
  // Summary
  console.log('\n=== Translation Complete ===');
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Total strings translated: ${stats.totalStrings}`);
  
  if (stats.errors.length > 0) {
    console.log(`\nErrors (${stats.errors.length}):`);
    for (const err of stats.errors) {
      console.log(`  - ${err.file} (${err.lang}): ${err.error}`);
    }
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
