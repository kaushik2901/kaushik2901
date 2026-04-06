"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
  { label: "About", href: "#summary" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
];

export function StickyNav() {
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      const sections = navItems.map((item) => {
        const el = document.querySelector(item.href);
        if (!el) return { href: item.href, offset: 0 };
        return { href: item.href, offset: el.getBoundingClientRect().top };
      });

      const visible = sections.find((s) => s.offset <= 100 && s.offset > -200);
      if (visible) setActiveSection(visible.href);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isScrolled) return null;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 print:hidden">
      <div className="max-w-3xl mx-auto px-6 py-2.5 flex items-center gap-1 text-sm">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className={cn(
              "px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors",
              activeSection === item.href && "text-foreground font-medium bg-accent/50"
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
