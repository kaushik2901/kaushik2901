import { resumeData } from "@/data/resume";
import { Separator } from "@/components/ui/separator";

export function Experience() {
  const { experience } = resumeData;

  return (
    <section id="experience" className="py-6 border-t">
      <h2 className="text-xl font-bold mb-4">Professional Experience</h2>
      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div key={index} className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
              <h3 className="text-lg font-semibold">{exp.company}</h3>
              <span className="text-sm text-muted-foreground">{exp.duration}</span>
            </div>
            <p className="text-md font-medium text-muted-foreground italic">{exp.role}</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {exp.achievements.map((achievement, i) => (
                <li key={i}>{achievement}</li>
              ))}
            </ul>
            {index < experience.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </div>
    </section>
  );
}
