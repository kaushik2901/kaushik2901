import { resumeData } from "@/data/resume";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border/50 mt-8 text-center text-xs text-muted-foreground/70 print:hidden">
      <p>
        &copy; {currentYear} {resumeData.name}. Crafted with Next.js &amp; shadcn/ui.
      </p>
    </footer>
  );
}
