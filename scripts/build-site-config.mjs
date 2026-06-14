import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(root, 'js/site-config.js');
const contentSourcePath = resolve(root, 'src/content/portfolio.ts');
const contentOutputPath = resolve(root, 'js/portfolio-content.js');
const envPath = resolve(root, '.env');

function loadLocalEnv() {
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) return;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) return;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '').trim();
  });
}

loadLocalEnv();

function readPublicEnv(name) {
  return (process.env[name] || '').trim();
}

const displayName = readPublicEnv('PUBLIC_SITE_DISPLAY_NAME');
const siteTitle = readPublicEnv('PUBLIC_SITE_TITLE');
const siteDescription = readPublicEnv('PUBLIC_SITE_DESCRIPTION');
const contactFormMethod = readPublicEnv('PUBLIC_CONTACT_FORM_METHOD') || 'post';

const config = {
  displayName,
  siteTitle: siteTitle || (displayName ? `${displayName} | Software Engineer Portfolio` : ''),
  siteDescription,
  githubUrl: readPublicEnv('PUBLIC_GITHUB_URL'),
  linkedinUrl: readPublicEnv('PUBLIC_LINKEDIN_URL'),
  contactEmail: readPublicEnv('PUBLIC_CONTACT_EMAIL'),
  contactPhone: readPublicEnv('PUBLIC_CONTACT_PHONE'),
  contactFormEndpoint: readPublicEnv('PUBLIC_CONTACT_FORM_ENDPOINT'),
  contactFormMethod
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `window.PORTFOLIO_CONFIG = ${JSON.stringify(config, null, 2)};\n`,
  'utf8'
);

console.log('Generated js/site-config.js from PUBLIC_* environment variables.');

if (existsSync(contentSourcePath)) {
  const source = readFileSync(contentSourcePath, 'utf8')
    .replace(/export\s+const\s+portfolioContent\s*=/, 'window.PORTFOLIO_CONTENT =')
    .replace(/\nexport\s+default\s+portfolioContent;\s*$/m, '\n');

  mkdirSync(dirname(contentOutputPath), { recursive: true });
  writeFileSync(
    contentOutputPath,
    `// Generated from src/content/portfolio.ts. Edit the source file, not this file.\n${source}`,
    'utf8'
  );

  console.log('Generated js/portfolio-content.js from src/content/portfolio.ts.');
}
