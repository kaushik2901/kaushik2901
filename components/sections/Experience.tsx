import { resumeData } from "@/data/resume";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Briefcase, MapPin } from "lucide-react";

export function Experience() {
  const { experience } = resumeData;

  return (
    <section id="experience" className="py-10">
      <div className="flex items-center gap-2 mb-8">
        <Briefcase className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold tracking-tight">Professional Experience</h2>
      </div>

      <div className="space-y-8">
        {experience.map((exp, index) => (
          <div key={index} className="relative">
            {index < experience.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-px" />
            )}
            <Card className="rounded-md border-border/60 hover:border-border/80 transition-colors py-0">
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold tracking-tight">{exp.company}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{exp.role}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1.5 text-xs text-muted-foreground shrink-0 sm:mt-1">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>{exp.duration}</span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <ul className="space-y-2 mt-4">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2.5">
                      <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
