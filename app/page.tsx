import { Header } from "@/components/sections/Header";
import { Summary } from "@/components/sections/Summary";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { Footer } from "@/components/sections/Footer";
import { StickyNav } from "@/components/StickyNav";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <StickyNav />
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-2 md:py-20 lg:py-24 print:p-0 print:m-0 print:max-w-none">
        <Header />
        <Summary />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Footer />
      </main>
    </div>
  );
}
