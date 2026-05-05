import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(root, 'js/site-config.js');

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
