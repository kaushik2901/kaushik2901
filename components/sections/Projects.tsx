import { resumeData } from "@/data/resume";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export function Projects() {
  const { projects } = resumeData;

  return (
    <section id="projects" className="py-6 border-t">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {project.title}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground print:hidden"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
              <CardDescription className="text-sm">{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px]">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
