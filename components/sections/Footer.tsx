import { resumeData } from "@/data/resume";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t mt-12 text-center text-sm text-muted-foreground print:hidden">
      <p>
        © {currentYear} {resumeData.name}. Built with Next.js and shadcn/ui.
      </p>
    </footer>
  );
}
