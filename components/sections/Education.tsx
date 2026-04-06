import { resumeData } from "@/data/resume";

export function Education() {
  const { education } = resumeData;

  return (
    <section id="education" className="py-6 border-t">
      <h2 className="text-xl font-bold mb-4">Education</h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
            <div>
              <h3 className="text-lg font-semibold">{edu.institution}</h3>
              <p className="text-sm text-muted-foreground">{edu.degree}</p>
            </div>
            <span className="text-sm text-muted-foreground italic">{edu.duration}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
