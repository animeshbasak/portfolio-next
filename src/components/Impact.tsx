"use client";

import FadeIn from "./FadeIn";
import styles from "./Impact.module.css";
import { Layers, Zap, Server, Activity, Accessibility } from "lucide-react";

export default function EngineeringImpact() {
  const impacts = [
    {
      title: "Frontend Architecture",
      icon: <Layers size={32} />,
      description: "Designing modular, reusable component systems using React and TypeScript. Establishing scalable patterns across large engineering squads for PWA and desktop platforms."
    },
    {
      title: "Web Performance",
      icon: <Zap size={32} />,
      description: "Specialized in browser internals, rendering lifecycle, and Code Splitting. Consistent track record of reducing page loads by 40%+ and achieving 90+ Lighthouse scores."
    },
    {
      title: "Server Side Rendering",
      icon: <Server size={32} />,
      description: "Implementing advanced SSR and SSG strategies to maximize SEO visibility, improve crawl efficiency, and deliver instant First Contentful Paint metrics."
    },
    {
      title: "Experimentation Systems",
      icon: <Activity size={32} />,
      description: "Building robust A/B testing frameworks, analytics instrumentation, and feature flag management to drive conversion optimization and platform reliability."
    },
    {
      title: "Accessibility Engineering",
      icon: <Accessibility size={32} />,
      description: "Accessibility-first development ensuring strict WCAG and ARIA compliance. Crafting inclusive UI experiences for diverse user demographics."
    }
  ];

  return (
    <section id="engineering-impact" className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <div className={styles.header}>
            <h2 className={styles.sectionTitle}>
              Engineering <span className="gradient-text">Impact</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Translating deep technical expertise into measurable business outcomes and premium user experiences.
            </p>
          </div>
        </FadeIn>

        <div className={styles.grid}>
          {impacts.map((impact, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className={styles.impactCard}>
                <div className={styles.iconWrapper}>
                  {impact.icon}
                </div>
                <h3 className={styles.cardTitle}>{impact.title}</h3>
                <p className={styles.cardDesc}>{impact.description}</p>
                <div className={styles.cardGlow} />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
