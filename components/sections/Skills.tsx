import { resumeData } from "@/data/resume";
import { Badge } from "@/components/ui/badge";

export function Skills() {
  const { skills } = resumeData;

  return (
    <section id="skills" className="py-6 border-t">
      <h2 className="text-xl font-bold mb-4">Skills</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Frontend</h3>
          <div className="flex flex-wrap gap-2">
            {skills.frontend.map((skill, i) => (
              <Badge key={i}>{skill}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Backend</h3>
          <div className="flex flex-wrap gap-2">
            {skills.backend.map((skill, i) => (
              <Badge key={i}>{skill}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Tools</h3>
          <div className="flex flex-wrap gap-2">
            {skills.tools.map((skill, i) => (
              <Badge key={i}>{skill}</Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
