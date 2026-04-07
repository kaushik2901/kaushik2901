import { resumeData } from "@/data/resume";
import { Card, CardContent } from "@/components/ui/card";
import { RiExternalLinkLine, RiGitRepositoryLine, RiLink } from "@remixicon/react";

export function Projects() {
  const { projects } = resumeData;

  return (
    <section id="projects" className="py-10">
      <div className="flex items-center gap-2 mb-8">
        <RiGitRepositoryLine className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
      </div>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <div key={index} className="relative">
            {index < projects.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-px" />
            )}
            <Card className="transition-colors py-0">
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold tracking-tight">{project.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 sm:mt-1">
                    {project.website && (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`Visit ${project.title} website`}
                      >
                        <RiLink className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`View ${project.title} repository`}
                    >
                      <RiExternalLinkLine className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2.5">
                    <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0" />
                    <span>{project.description}</span>
                  </li>
                  {project.details && (
                    <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2.5">
                      <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0" />
                      <span>{project.details}</span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
