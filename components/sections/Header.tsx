"use client";

import { resumeData } from "@/data/resume";
import { Button } from "@/components/ui/button";
import { RiMailLine, RiGithubLine, RiLinkedinLine, RiMapPinLine, RiDownloadLine } from "@remixicon/react";

export function Header() {
  const { name, role, contact } = resumeData;

  return (
    <header id="top" className="flex flex-col gap-6 pb-8 border-b border-border/50">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{name}</h1>
        <p className="text-xl font-medium text-muted-foreground">{role}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <RiMailLine className="w-3.5 h-3.5" />
            <span className="underline decoration-border hover:decoration-foreground/30">{contact.email}</span>
          </a>
          <span className="hidden sm:inline text-border">|</span>
          <a href={contact.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <RiGithubLine className="w-3.5 h-3.5" />
            <span className="underline decoration-border hover:decoration-foreground/30">GitHub</span>
          </a>
          <span className="hidden sm:inline text-border">|</span>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <RiLinkedinLine className="w-3.5 h-3.5" />
            <span className="underline decoration-border hover:decoration-foreground/30">LinkedIn</span>
          </a>
          {contact.location && (
            <>
              <span className="hidden sm:inline text-border">|</span>
              <span className="flex items-center gap-1.5">
                <RiMapPinLine className="w-3.5 h-3.5" />
                {contact.location}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
