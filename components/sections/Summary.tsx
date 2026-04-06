import { resumeData } from "@/data/resume";

export function Summary() {
  return (
    <section id="summary" className="py-6 border-t">
      <h2 className="text-xl font-bold mb-4">Professional Summary</h2>
      <p className="leading-relaxed text-muted-foreground">{resumeData.summary}</p>
    </section>
  );
}
