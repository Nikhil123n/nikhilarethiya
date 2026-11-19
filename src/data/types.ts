export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  accentClass: string;
};

export type SceneMeta = {
  id: string;
  navTarget: string;
  avatar: string;
  caption: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  descriptionHighlights?: string[];
  tags: string[];
  sketch: "dashboard" | "medical" | "neural";
  githubUrl: string;
  liveDemoUrl?: string;
  demoUrl?: string;
  ctaLabel: string;
  liveDemoLabel?: string;
};

export type SkillGroup = {
  title: string;
  iconIds: { label: string; symbol: string }[];
};

export type Certification = {
  title: string;
  lines?: string[];
  provider?: string;
};

export type EducationEntry = {
  school: string;
  date: string;
  degree: string;
  coursework?: string;
  icon: string;
};

export type ExperienceStoryVisual =
  | "civic-grid"
  | "neural-pipeline"
  | "validation-ledger"
  | "glucose-wave";

export type ExperienceMetric = {
  value: string;
  label: string;
};

export type ExperienceEntry = {
  id: string;
  date: string;
  role: string;
  company: string;
  chapter: string;
  metric: ExperienceMetric;
  storyVisual: ExperienceStoryVisual;
  impact: string;
  impactHighlight?: string;
  keyImpacts?: string[];
  tags: string[];
  takeaway: string;
};

export type SiteConfig = {
  displayName: string;
  title: string;
  description: string;
  githubUrl: string;
  linkedinUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactFormEndpoint: string;
  contactFormMethod: "get" | "post";
};
