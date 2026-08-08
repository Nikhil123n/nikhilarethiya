import { assets } from "./assets";
import type { EducationEntry } from "./types";

export const education: EducationEntry[] = [
  {
    school: "The George Washington University, Washington DC, USA",
    date: "Aug 2024 - May 2026",
    degree: "Master of Science in Computer Science (GPA: 3.89/4)",
    coursework: "Design & Analysis of Algorithms, Advanced Software Paradigms, Component Based Software Architecture",
    icon: assets.doodles.educationCampus,
  },
  {
    school: "University of Mumbai, India",
    date: "Aug 2019 - May 2023",
    degree: "Bachelor of Engineering in Computer Engineering (GPA: 3.78/4)",
    icon: assets.doodles.educationCap,
  },
];
