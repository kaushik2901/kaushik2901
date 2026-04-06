export const resumeData = {
  name: "Kaushik",
  role: "Senior Software Engineer",
  contact: {
    email: "kaushikjadav602@gmail.com",
    github: "https://github.com/kaushik2901",
    linkedin: "https://linkedin.com/in/kaushik2901",
    location: "Ahmedabad, India",
  },
  summary:
    "I care about two things: systems that don't break in embarrassing ways, and codebases that the next engineer doesn't curse. Everything else — cloud, microservices, observability, AI tooling — is just the current vocabulary for those two problems.",
  skills: {
    systemDesign: [
      "Microservices",
      "Distributed Systems",
      "Event-Driven Architecture",
      "Clean Architecture",
      "Async Processing",
    ],
    languagesAndFrameworks: [
      "C#",
      ".NET Core",
      "EF Core",
      "xUnit",
      "SQL",
      "T-SQL",
      "JavaScript",
      "TypeScript",
      "Node.js",
    ],
    databases: ["SQL Server", "Redis", "SQLite", "MongoDB"],
    cloudAndInfrastructure: [
      "Docker",
      "NGINX",
      "Azure App Services",
      "Azure Functions",
      "Azure Event Grid",
      "Azure Blob Storage",
      "Azure Application Insights",
      "Azure DevOps",
    ],
  },
  experience: [
    {
      company: "Globant",
      role: "Senior Software Engineer",
      duration: "August 2024 – Present",
      location: "Ahmedabad (Remote)",
      achievements: [
        "Led OpenTelemetry adoption across distributed services, enabling end-to-end distributed tracing, unified metrics, and structured logs — replacing fragmented Azure Table Storage logging with a production-grade observability stack.",
        "Optimized a high-volume Job Tracker handling 100K+ rows by rewriting stored procedures, adding indexes, and implementing archival jobs — reducing average response time from 60s to under 1s.",
        "Re-architected a CSV export API for large financial datasets using streaming responses, rented memory pools, and read-only spans — doubling concurrent user capacity and increasing throughput from 3k to 7k req/s under load tests.",
        "Eliminated memory and server overhead for large file downloads (GB-scale) by replacing in-memory fetch with signed Azure Data Lake URLs, enabling browser-native downloads resilient to page refreshes.",
        "Engineered a unified NuGet caching library adopted across all services — standardizing resilience patterns, implementing proactive cache warming to prevent thundering herd, and enabling project-level cache invalidation.",
      ],
    },
    {
      company: "Liquidly",
      role: "Technical Lead",
      duration: "April 2020 – August 2024",
      location: "Ahmedabad (Remote)",
      achievements: [
        "Architected a centralized authentication platform using IdentityServer4 and OAuth 2.0, unifying identity across multiple trading workflow applications and eliminating redundant onboarding for Organizations and Users.",
        "Led migration from monolithic to distributed architecture — decomposing into Business APIs, Identity, Notification, and Background Job services — achieving 50%+ reduction in average API response time.",
        "Designed and built production-grade REST APIs following Clean Architecture and TDD; implemented HTTP client code generation, saving tens of dev hours and reducing PR comments by 90% through tooling and guidelines.",
        "Led the team of 8 engineers — translating business requirements into sprint tasks, conducting design reviews, driving agile ceremonies, and mentoring junior developers on architectural best practices.",
        "Reduced CI/CD pipeline runtime by optimizing configuration files, cutting execution time from 15 to 8 minutes.",
      ],
    },
    {
      company: "Marg Sahayak, Government of Gujarat",
      role: "Software Engineer",
      duration: "April 2018 – March 2020",
      location: "Ahmedabad",
      achievements: [
        "Designed and launched a scalable grievance management portal serving 1,400 government officers across 33 districts with GIS-based road lookup — handling 18,000 complaints in 3 days on a Node.js and MongoDB backend.",
        "Built a stateless backend using JWT and distributed caching to enable horizontal scaling, achieving 2x throughput on existing infrastructure — replacing a slow hierarchical offline system presented to the World Bank.",
      ],
    },
  ],
  projects: [
    {
      title: "AsyncEndpoints",
      description:
        "An AOT-compatible distributed background job processing NuGet library supporting .NET 8–10, with Redis-based job store using Lua scripting for atomic operations and sub-millisecond API response times.",
      details:
        "Engineered a resilient async processing pipeline with configurable retry strategies, bounded concurrency controls, automatic stuck job recovery, and built-in structured metrics and tracing for full observability.",
      link: "https://github.com/kaushik2901/async-endpoints",
      website: "https://asyncendpoints.com",
    },
  ],
  education: [
    {
      institution: "Vishwakarma Government Engineering College",
      degree: "Bachelor of Engineering in Information Technology",
      duration: "August 2016 – September 2020",
      location: "Ahmedabad",
    },
  ],
};
