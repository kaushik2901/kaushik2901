import { resumeData } from "@/data/resume";
import { Badge } from "@/components/ui/badge";
import { Code2, Database, Wrench } from "lucide-react";

const skillIcons = {
  frontend: Code2,
  backend: Database,
  tools: Wrench,
};

export function Skills() {
  const { skills } = resumeData;

  const skillCategories = [
    { key: "frontend" as const, label: "Frontend" },
    { key: "backend" as const, label: "Backend" },
    { key: "tools" as const, label: "Tools & DevOps" },
  ];

  return (
    <section id="skills" className="py-10">
      <div className="flex items-center gap-2 mb-8">
        <Code2 className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold tracking-tight">Skills</h2>
      </div>
      
      <div className="space-y-6">
        {skillCategories.map(({ key, label }) => {
          const Icon = skillIcons[key];
          return (
            <div key={key} className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold tracking-tight text-foreground">{label}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills[key].map((skill, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="text-sm font-medium px-3 py-1 border-border/60 hover:border-border/80 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
