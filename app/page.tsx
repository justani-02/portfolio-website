import { Navigation } from "@/components/portfolio/navigation";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Projects } from "@/components/portfolio/projects";
import { Experience } from "@/components/portfolio/experience";
import { Publications } from "@/components/portfolio/publications";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";
import { CustomCursor } from "@/components/portfolio/custom-cursor";
import { Chatbot } from "@/components/portfolio/chatbot";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Publications />
      <Contact />
      <Footer />
      <Chatbot />
    </main>
  );
}
