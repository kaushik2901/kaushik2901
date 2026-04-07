import { resumeData } from "@/data/resume";
import { Badge } from "@/components/ui/badge";
import { RiBrainLine, RiCodeLine, RiDatabaseLine, RiCloudLine, RiApps2Line } from "@remixicon/react";

const skillIcons = {
  systemDesign: RiBrainLine,
  languagesAndFrameworks: RiCodeLine,
  databases: RiDatabaseLine,
  cloudAndInfrastructure: RiCloudLine,
};

export function Skills() {
  const { skills } = resumeData;

  const skillCategories = [
    { key: "systemDesign" as const, label: "System Design" },
    { key: "languagesAndFrameworks" as const, label: "Languages & Frameworks" },
    { key: "databases" as const, label: "Databases" },
    { key: "cloudAndInfrastructure" as const, label: "Cloud & Infrastructure" },
  ];

  return (
    <section id="skills" className="py-10">
      <div className="flex items-center gap-2 mb-8">
        <RiApps2Line className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold tracking-tight">Technical Skills</h2>
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
                {skills[key].map((skill: string, i: number) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs font-medium px-3 py-1"
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
