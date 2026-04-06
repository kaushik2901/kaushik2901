import { resumeData } from "@/data/resume";
import { User } from "lucide-react";

export function Summary() {
  return (
    <section id="summary" className="py-10">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold tracking-tight">About</h2>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{resumeData.summary}</p>
    </section>
  );
}
