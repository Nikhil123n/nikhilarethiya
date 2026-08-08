import type { Certification, SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    title: "Languages",
    iconIds: [
      { label: "Python", symbol: "icon-python" },
      { label: "JavaScript", symbol: "icon-javascript" },
      { label: "TypeScript", symbol: "icon-typescript" },
      { label: "Java", symbol: "icon-java" },
      { label: "C++", symbol: "icon-cpp" },
    ],
  },
  {
    title: "Frameworks",
    iconIds: [
      { label: "React", symbol: "icon-react" },
      { label: "Vue", symbol: "icon-vue" },
      { label: "Node.js", symbol: "icon-node" },
      { label: "Django", symbol: "icon-django" },
      { label: "FastAPI", symbol: "icon-fastapi" },
    ],
  },
  {
    title: "Databases & Cloud",
    iconIds: [
      { label: "PostgreSQL", symbol: "icon-postgresql" },
      { label: "MongoDB", symbol: "icon-mongodb" },
      { label: "GCP", symbol: "icon-gcp" },
      { label: "Firebase", symbol: "icon-firebase" },
    ],
  },
  {
    title: "DevOps & Tools",
    iconIds: [
      { label: "Docker", symbol: "icon-docker" },
      { label: "Kubernetes", symbol: "icon-kubernetes" },
      { label: "Jenkins", symbol: "icon-jenkins" },
      { label: "Git", symbol: "icon-git" },
      { label: "GitHub", symbol: "icon-github" },
    ],
  },
];

export const certifications: Certification[] = [
  { title: "Building Production Ready React Apps", lines: ["Building Production", "Ready React Apps"], provider: "Linkedin" },
  { title: "AWS Cloud Foundations", lines: ["AWS Cloud", "Foundations"] },
  { title: "MongoDB Developers' Toolkit", lines: ["MongoDB Developers'", "Toolkit"] },
];
