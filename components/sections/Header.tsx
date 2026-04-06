"use client";

import { resumeData } from "@/data/resume";
import { Button } from "@/components/ui/button";
import { Mail, Link, MapPin, Download, ExternalLink } from "lucide-react";

export function Header() {
  const { name, role, tagline, contact } = resumeData;

  return (
    <header id="top" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{name}</h1>
        <p className="text-xl text-muted-foreground">{role}</p>
        <p className="text-sm text-muted-foreground max-w-md">{tagline}</p>
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground md:items-end">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <a href={`mailto:${contact.email}`} className="hover:text-foreground">
            {contact.email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4" />
          <a href={contact.github} target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </a>
        </div>
        <div className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground">
            LinkedIn
          </a>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{contact.location}</span>
        </div>
        <Button variant="outline" size="sm" className="mt-2 group print:hidden" onClick={() => window.print()}>
          <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
          Download Resume
        </Button>
      </div>
    </header>
  );
}
