import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import EngineeringImpact from "@/components/Impact";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <EngineeringImpact />
      <TechStack />
      <Projects />
      <Contact />
    </main>
  );
}
