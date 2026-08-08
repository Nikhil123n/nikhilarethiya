import type { ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    id: "nic",
    date: "Jan 2023 - Jun 2024",
    role: "Software Developer",
    company: "National Informatics Centre",
    impact:
      "Modernized a district-scale JSP platform into REST-backed React workflows, improving page and query latency for 708 districts.",
    tags: ["React", "REST APIs", "SQL", "Unicode"],
    takeaway: "Legacy systems deserve careful migration notes.",
    side: "left",
  },
  {
    id: "sndl",
    date: "Mar 2025 - May 2025",
    role: "Backend Software Engineer",
    company: "System Neural Development Lab",
    impact:
      "Automated terabyte-scale neural data processing with Django, Celery, Redis, and containerized node orchestration.",
    tags: ["Django", "Celery", "Redis", "Docker", "Kubernetes"],
    takeaway: "Reliable pipelines start with boring, observable foundations.",
    side: "right",
  },
  {
    id: "un",
    date: "May 2025 - Aug 2025",
    role: "Data Research Intern",
    company: "United Nations",
    impact:
      "Validated 100K+ records through Python ETL and audits that reduced manual processing overhead.",
    tags: ["Python", "ETL", "Data QA", "Research"],
    takeaway: "Data quality is product quality when decisions depend on it.",
    side: "left",
  },
  {
    id: "hive",
    date: "May 2025 - Dec 2025",
    role: "Software Engineer",
    company: "HIVE Labs",
    impact:
      "Built Spark ingestion and real-time dashboard workflows for participant-scale glucose prediction research.",
    tags: ["Spark", "Vue.js", "AWS EKS", "pytest", "ML"],
    takeaway: "Research tools still need production-grade ergonomics.",
    side: "right",
  },
];
