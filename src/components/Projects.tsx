"use client";

import FadeIn from "./FadeIn";
import styles from "./Projects.module.css";
import { ExternalLink, Github } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "Airtel Acquisition & SKYC Onboarding",
      description: "Architected scalable React/TypeScript frontend interfaces for critical telecom journeys. Managed delivery lifecycle and optimized PageSpace integrations for high-traffic environments.",
      tags: ["React", "TypeScript", "Groovy", "Spring Boot", "PWA"],
      company: "Airtel Digital Ltd."
    },
    {
      title: "MMT Hotels Booking Funnel",
      description: "Optimized the entire booking funnel achieving a 40% reduction in page load time. Implemented advanced SSR for SEO indexing and A/B experimentation frameworks.",
      tags: ["React", "SSR", "SEO", "Web Performance"],
      company: "MakeMyTrip"
    },
    {
      title: "Paytm Merchant Platform Modernization",
      description: "Migrated legacy merchant workflows to a modern React architecture. Revamped the Soundbox purchase journey, resulting in a 40% increase in EDC device sales.",
      tags: ["React", "Redux", "Spring Boot", "Analytics"],
      company: "Paytm"
    }
  ];

  const aiProjects = [
    {
      title: "insaneResumake",
      description: "AI-powered resume builder with ATS scoring engine, job description match analysis, and AI bullet rewriter — integrating Claude and Gemini APIs with real-time PDF generation.",
      tags: ["React", "TypeScript", "LLM APIs", "Vercel"],
      status: "In Progress",
      link: "https://insaneresumake.vercel.app"
    },
    {
      title: "cravingTrust",
      description: "Hyperlocal street food discovery platform — AI recommendation engine for craving-to-vendor matching using sentiment analysis, image classification, and AI-generated trust scoring.",
      tags: ["Node.js", "LLM APIs", "Maps"],
      status: "In Progress"
    },
    {
      title: "insaneFit",
      description: "AI-powered Indian fitness and nutrition tracker with AI workout recommendations, Indian food calorie database, and progress analytics — targeting iOS, Android, and MWeb.",
      tags: ["React Native", "REST APIs", "AI"],
      status: "In Progress"
    }
  ];

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <div className={styles.header}>
            <h2 className={styles.sectionTitle}>
              Featured <span className="gradient-text">Platforms</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              High-scale case studies deployed to millions of active users.
            </p>
          </div>
        </FadeIn>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className={styles.projectCard}>
                <div className={styles.projectContent}>
                  <div className={styles.companyBadge}>{project.company}</div>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDesc}>{project.description}</p>
                  
                  <div className={styles.tags}>
                    {project.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className={styles.header} style={{ marginTop: '8rem' }}>
            <h2 className={styles.sectionTitle}>
              AI Projects & <span className="gradient-text">Side Builds</span>
            </h2>
          </div>
        </FadeIn>

        <div className={styles.grid}>
          {aiProjects.map((project, index) => (
            <FadeIn key={`ai-${index}`} delay={index * 0.1}>
              {project.link ? (
                <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: '100%' }}>
                  <div className={styles.projectCard}>
                    <div className={styles.projectContent}>
                      <div className={styles.companyBadge} style={{ color: '#fbbf24' }}>{project.status}</div>
                      <h3 className={styles.projectTitle}>
                        {project.title}
                        <ExternalLink size={18} style={{ marginLeft: '0.5rem', display: 'inline-block', verticalAlign: 'middle', marginTop: '-4px' }} />
                      </h3>
                      <p className={styles.projectDesc}>{project.description}</p>
                      <div className={styles.tags}>
                        {project.tags.map((tag, i) => (
                          <span key={i} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              ) : (
                <div className={styles.projectCard}>
                  <div className={styles.projectContent}>
                    <div className={styles.companyBadge} style={{ color: '#fbbf24' }}>{project.status}</div>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectDesc}>{project.description}</p>
                    <div className={styles.tags}>
                      {project.tags.map((tag, i) => (
                        <span key={i} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
