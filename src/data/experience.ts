import type { ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    id: "nic",
    date: "Jan 2023 – Jun 2024",
    role: "Software Developer",
    company: "National Informatics Centre",
    chapter: "Civic systems",
    metric: { value: "708", label: "districts modernized" },
    storyVisual: "civic-grid",
    impact:
      "Modernized a 12-year-old Java platform supporting 708 districts and millions of citizens.",
    impactHighlight: "708 districts",
    keyImpacts: [
      "708 districts served",
      "~8s → ~4s latency",
      "22 official languages",
      "63% fewer complaints",
      "5 zero-fail releases",
    ],
    tags: ["Java", "JSP", "Oracle", "Spring", "Linux"],
    takeaway: "Legacy systems deserve careful migration notes.",
  },
  {
    id: "sndl",
    date: "Mar 2025 - May 2025",
    role: "Backend Software Engineer",
    company: "System Neural Development Lab",
    chapter: "Observable infrastructure",
    metric: { value: "TB-scale", label: "neural data processing" },
    storyVisual: "neural-pipeline",
    impact:
      "Automated terabyte-scale neural data processing with Django, Celery, Redis, and containerized node orchestration.",
    tags: ["Django", "Celery", "Redis", "Docker", "Kubernetes"],
    takeaway: "Reliable pipelines start with boring, observable foundations.",
  },
  {
    id: "un",
    date: "May 2025 - Aug 2025",
    role: "Data Research Intern",
    company: "United Nations",
    chapter: "Trusted data",
    metric: { value: "100K+", label: "records validated" },
    storyVisual: "validation-ledger",
    impact:
      "Validated 100K+ records through Python ETL and audits that reduced manual processing overhead.",
    tags: ["Python", "ETL", "Data QA", "Research"],
    takeaway: "Data quality is product quality when decisions depend on it.",
  },
  {
    id: "hive",
    date: "May 2025 - Dec 2025",
    role: "Software Engineer",
    company: "HIVE Labs",
    chapter: "Human-centered research",
    metric: { value: "Real-time", label: "research dashboard workflows" },
    storyVisual: "glucose-wave",
    impact:
      "Built Spark ingestion and real-time dashboard workflows for participant-scale glucose prediction research.",
    tags: ["Spark", "Vue.js", "AWS EKS", "pytest", "ML"],
    takeaway: "Research tools still need production-grade ergonomics.",
  },
];
