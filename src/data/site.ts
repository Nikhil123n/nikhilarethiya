import type { SiteConfig } from "./types";

function clean(value: string | undefined) {
  return value?.trim() ?? "";
}

export const siteConfig: SiteConfig = {
  displayName: clean(process.env.PUBLIC_SITE_DISPLAY_NAME) || "Nikhil Arethiya",
  title: clean(process.env.PUBLIC_SITE_TITLE) || "Nikhil Arethiya | Software Engineer Portfolio",
  description:
    clean(process.env.PUBLIC_SITE_DESCRIPTION) ||
    "Sketchbook style scroll-telling software engineering portfolio.",
  githubUrl: clean(process.env.PUBLIC_GITHUB_URL) || "https://github.com/Nikhil123n",
  linkedinUrl: clean(process.env.PUBLIC_LINKEDIN_URL),
  contactEmail: clean(process.env.PUBLIC_CONTACT_EMAIL),
  contactPhone: clean(process.env.PUBLIC_CONTACT_PHONE),
  contactFormEndpoint: clean(process.env.PUBLIC_CONTACT_FORM_ENDPOINT),
  contactFormMethod: clean(process.env.PUBLIC_CONTACT_FORM_METHOD).toLowerCase() === "get" ? "get" : "post",
};
