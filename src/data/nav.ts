import { assets } from "./assets";
import type { NavItem, SceneMeta } from "./types";

export const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "#home", icon: assets.doodles.sidebarHome, accentClass: "tab-home" },
  { id: "about", label: "About", href: "#about", icon: assets.doodles.sidebarUser, accentClass: "tab-about" },
  { id: "skills", label: "Skills", href: "#toolkit", icon: assets.doodles.sidebarSkills, accentClass: "tab-skills" },
  { id: "projects", label: "Projects", href: "#projects", icon: assets.doodles.code, accentClass: "tab-projects" },
  { id: "experience", label: "Experience", href: "#experience", icon: assets.doodles.briefcase, accentClass: "tab-experience" },
  { id: "education", label: "Education", href: "#education", icon: assets.doodles.educationCapSvg, accentClass: "tab-education" },
  { id: "contact", label: "Contact", href: "#contact", icon: assets.doodles.mail, accentClass: "tab-contact" },
];

export const scenes: SceneMeta[] = [
  {
    id: "home",
    navTarget: "home",
    avatar: assets.avatars.working,
    caption: "Scene 01: building from ideas.",
  },
  {
    id: "about",
    navTarget: "about",
    avatar: assets.avatars.headshotLeft,
    caption: "Scene 02: engineer by profession, creator by passion.",
  },
  {
    id: "toolkit",
    navTarget: "skills",
    avatar: assets.avatars.writing,
    caption: "Scene 03: my toolkit.",
  },
  {
    id: "projects",
    navTarget: "projects",
    avatar: assets.avatars.sketching,
    caption: "Scene 04: translating sketches into products.",
  },
  {
    id: "experience",
    navTarget: "experience",
    avatar: assets.avatars.thinking,
    caption: "Scene 05: the professional road map.",
  },
  {
    id: "education",
    navTarget: "education",
    avatar: assets.avatars.headshotLeft,
    caption: "Scene 06: education foundations.",
  },
  {
    id: "contact",
    navTarget: "contact",
    avatar: assets.avatars.celebrating,
    caption: "Scene 07: ready to ship the next thing.",
  },
];
