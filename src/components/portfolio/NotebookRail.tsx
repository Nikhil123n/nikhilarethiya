"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import type { NavItem } from "@/data";

type NotebookRailProps = {
  items: NavItem[];
  activeTarget: string;
};

export function NotebookRail({ items, activeTarget }: NotebookRailProps) {
  const handleTabClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    window.history.pushState(null, "", href);
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: Math.max(0, target.getBoundingClientRect().top + window.scrollY),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <aside className="notebook-rail" aria-label="Section navigation">
      <div className="spiral" aria-hidden="true" />
      <a className="logo-mark" href="#home" aria-label="Back to top">
        NA<span>.</span>
      </a>
      <nav className="tab-nav">
        {items.map((item) => (
          <a
            key={item.id}
            className={`tab ${item.accentClass} ${activeTarget === item.id ? "active" : ""}`}
            href={item.href}
            onClick={(event) => handleTabClick(event, item.href)}
          >
            <Image src={item.icon} alt="" width={21} height={21} aria-hidden="true" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="scroll-note">
        <span>Scroll</span>
        <strong>down</strong>
      </div>
    </aside>
  );
}
