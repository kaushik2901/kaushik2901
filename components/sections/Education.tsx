import { resumeData } from "@/data/resume";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, GraduationCap, MapPin } from "lucide-react";

export function Education() {
  const { education } = resumeData;

  return (
    <section id="education" className="py-10">
      <div className="flex items-center gap-2 mb-8">
        <GraduationCap className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold tracking-tight">Education</h2>
      </div>

      <div className="space-y-4">
        {education.map((edu, index) => (
          <Card key={index} className="rounded-md border-border/60 hover:border-border/80 transition-colors">
            <CardContent className="pt-5 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold tracking-tight">{edu.institution}</h3>
                  <p className="text-sm text-muted-foreground">{edu.degree}</p>
                </div>
                <div className="flex flex-col sm:items-end gap-1.5 text-xs text-muted-foreground shrink-0 sm:mt-1">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{edu.duration}</span>
                  </div>
                  {edu.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{edu.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
