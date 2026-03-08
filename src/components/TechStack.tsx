"use client";

import FadeIn from "./FadeIn";
import styles from "./TechStack.module.css";

export default function TechStack() {
  const categories = [
    {
      title: "Frontend & Core Web",
      skills: ["React", "TypeScript", "JavaScript ES6+", "HTML5", "CSS3 / SCSS", "DOM manipulation", "Web performance", "Accessibility", "Async programming"]
    },
    {
      title: "Backend & State",
      skills: ["Node.js", "Spring Boot", "REST APIs", "Redux", "Unistore"]
    },
    {
      title: "Testing & Performance",
      skills: ["SSR", "Lighthouse", "Code Splitting", "Web Vitals", "Vitest", "Jest", "React Testing Library", "Sentry"]
    },
    {
      title: "DevOps & Tools",
      skills: ["Webpack", "Vite", "Docker", "GitHub Actions", "Jenkins", "Figma", "Stitch", "JIRA"]
    },
    {
      title: "AI & LLM",
      skills: ["OpenAI API", "Anthropic Claude", "Gemini API", "HuggingFace", "Ollama", "Groq", "LlamaIndex", "RAG pipelines"]
    },
    {
      title: "AI Tooling",
      skills: ["GitHub Copilot", "Cursor", "Claude Code", "Stable Diffusion", "ComfyUI", "ControlNet", "Flux", "Streamlit"]
    }
  ];

  return (
    <section id="tech-stack" className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <div className={styles.header}>
            <h2 className={styles.sectionTitle}>
              Technical <span className="gradient-text">Arsenal</span>
            </h2>
          </div>
        </FadeIn>

        <div className={styles.grid}>
          {categories.map((category, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className={styles.categoryCard}>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
                <div className={styles.skillsGrid}>
                  {category.skills.map((skill, i) => (
                    <div key={i} className={styles.skillBadge}>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
