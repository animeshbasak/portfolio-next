"use client";

import FadeIn from "./FadeIn";
import styles from "./Projects.module.css";
import { Github, ExternalLink } from "lucide-react";

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
      title: "Lakshya लक्ष्य",
      description: "AI-powered personal job hunting OS. Scrapes LinkedIn, Indeed & Naukri daily via Apify. Claude AI scores every listing against your resume, generates cover letters, interview prep, and cold DMs — so you wake up to ranked matches every morning.",
      tags: ["Next.js", "Claude AI", "Supabase", "Apify", "TypeScript"],
      status: "LIVE",
      label: "PERSONAL OS",
      link: "/lakshya"
    },
    {
      title: "insaneResumake",
      description: "ATS-optimized resume builder with hybrid 3-layer scoring engine (Keywords 40%, Structure 35%, Readability 25%). JD matcher, cover letter generator, recruiter heatmap, shareable score cards, and BYOK AI support for Claude, Gemini & OpenAI. 98-test suite. V3.5 live.",
      tags: ["React", "TypeScript", "Vite", "Supabase", "Claude AI"],
      status: "LIVE",
      label: "AI RESUME TOOL",
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
          {aiProjects.map((project, index) => {
            const isLive = project.status === 'LIVE';
            const isLakshya = project.title.includes('Lakshya');
            const isExternal = project.link && !project.link.startsWith('/');
            
            // Apply special gradient border for Lakshya
            const cardStyle: React.CSSProperties = isLakshya ? {
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            } : {};

            const cardContent = (
              <div 
                className={styles.projectCard} 
                style={cardStyle}
              >
                {/* Custom gradient border for Lakshya to make it stand out */}
                {isLakshya && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'linear-gradient(90deg, #22d3ee, #a855f7)',
                    zIndex: 2
                  }} />
                )}

                <div className={styles.projectContent}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 600, 
                      color: '#22d3ee', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em' 
                    }}>
                      {project.label || 'SIDE PROJECT'}
                    </span>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      color: isLive ? '#10b981' : '#fbbf24',
                      background: isLive ? 'rgba(16,185,129,0.1)' : 'rgba(251,191,36,0.1)',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      border: isLive ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(251,191,36,0.2)'
                    }}>
                      {isLive && (
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: '#10b981', display: 'inline-block',
                          animation: 'pulse 2s infinite'
                        }} />
                      )}
                      {project.status.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                    <h3 className={styles.projectTitle} style={{ marginBottom: 0 }}>{project.title}</h3>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                      >
                        <ExternalLink size={16} style={{ color: '#22d3ee', opacity: 0.7, cursor: 'pointer', transition: 'opacity 0.2s' }} />
                      </a>
                    )}
                  </div>
                  <p className={styles.projectDesc}>{project.description}</p>
                  
                  <div className={styles.tags}>
                    {project.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            );

            return (
              <FadeIn key={`ai-${index}`} delay={index * 0.1}>
                {cardContent}
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
