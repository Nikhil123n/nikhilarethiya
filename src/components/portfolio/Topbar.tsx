import { GitHubMark, LinkedInMark, MailMark } from "./icons";
import type { SiteConfig } from "@/data";

type TopbarProps = {
  site: SiteConfig;
};

export function Topbar({ site }: TopbarProps) {
  const emailHref = site.contactEmail ? `mailto:${site.contactEmail}` : "#contact";

  return (
    <header className="topbar">
      <div className="top-socials" aria-label="Contact and social links">
        <a href={site.githubUrl || "#contact"} target="_blank" rel="noreferrer" aria-label="GitHub">
          <GitHubMark />
        </a>
        <a href={site.linkedinUrl || "#contact"} target={site.linkedinUrl ? "_blank" : undefined} rel={site.linkedinUrl ? "noreferrer" : undefined} aria-label="LinkedIn">
          <LinkedInMark />
        </a>
        <a href={emailHref} aria-label="Email">
          <MailMark />
        </a>
      </div>
    </header>
  );
}
