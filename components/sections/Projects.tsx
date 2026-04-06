import { resumeData } from "@/data/resume";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FolderGit2 } from "lucide-react";

export function Projects() {
  const { projects } = resumeData;

  return (
    <section id="projects" className="py-10">
      <div className="flex items-center gap-2 mb-8">
        <FolderGit2 className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <Card key={index} className="border-border/60 hover:border-border/80 transition-colors flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-semibold tracking-tight leading-snug">
                  {project.title}
                </CardTitle>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
                  aria-label={`View ${project.title} project`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <CardDescription className="text-sm leading-relaxed line-clamp-3">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-0">
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tech, i) => (
                  <Badge key={i} variant="secondary" className="text-[11px] font-medium px-2 py-0.5">
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
