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

  // ════════════════════════════════════════════════════════════════
  // AI PROJECTS & SIDE BUILDS — Updated March 2026
  // Order: LIVE first, then IN PROGRESS, then PRE-BUILD / CONCEPT
  // ════════════════════════════════════════════════════════════════
  const aiProjects = [
    {
      category: "AI RESUME TOOL",
      status: "● LIVE",
      statusType: "live",
      title: "insaneResumake",
      titleHindi: null as string | null,
      url: "https://insaneresumake.vercel.app",
      description: "AI resume engine built to turn weak resumes into interview-ready assets in minutes. Scores every resume like a recruiter, highlights missing JD keywords instantly, and rewrites bullets into sharper, higher-conviction proof points. Power users can plug in Claude, Gemini, or OpenAI and iterate until the resume feels impossible to ignore.",
      tags: ["React", "TypeScript", "Vite", "Supabase", "Claude AI"],
      isSecret: false,
    },
    {
      category: "PERSONAL OS",
      status: "● LIVE",
      statusType: "live",
      title: "Lakshya",
      titleHindi: "लक्ष्य" as string | null,
      url: "https://lakshyahq.vercel.app/" as string | null,
      description: "AI job search OS for ambitious engineers who want leverage, not another spreadsheet. Lakshya discovers high-signal roles across major portals, scores each opportunity against your actual profile, surfaces skill gaps before you waste an application, and runs your hunt through a focused execution pipeline. It is built to feel like having a job-search strategist, research analyst, and tracker in one product.",
      tags: ["Next.js", "Claude AI", "Supabase", "Apify", "TypeScript"],
      isSecret: false,
    },
    {
      category: "CONTENT AUTOMATION",
      status: "● LIVE",
      statusType: "live",
      title: "insanemesh.ai",
      titleHindi: null as string | null,
      url: "https://instagram.com/insanemesh.ai",
      description: "Fully automated AI engineering content pipeline for Instagram. Gemini Flash generates post concepts, Groq Llama 3.3 writes captions, Puppeteer renders visual tiles, Telegram bot sends for human approval, Meta API publishes at 7PM IST daily. Day 1–10 manual, Day 11+ fully automated. Part of a 90-day public AI engineering build log.",
      tags: ["Gemini AI", "Groq", "Puppeteer", "Meta API", "Node.js"],
      isSecret: false,
    },
    {
      category: "PREDICTION MARKETS",
      status: "PRE-BUILD",
      statusType: "inProgress",
      title: "DRISHTI",
      titleHindi: "दृष्टि" as string | null,
      url: null as string | null,
      description: "Prediction market intelligence platform built for India. Real-time signals and community forecasting across cricket, elections, and regional events. Architecture complete — microservices, India-specific data sources, dark navy brand identity anchored by Drishti Blue and Drishti Purple.",
      tags: ["Next.js", "TypeScript", "Three.js", "Supabase", "Microservices"],
      isSecret: false,
    },
    {
      category: "SIDE PROJECT",
      status: "CONCEPT",
      statusType: "inProgress",
      title: "cravingTrust",
      titleHindi: null as string | null,
      url: null as string | null,
      description: "Hyperlocal street food discovery platform — 'IMDb for street food stalls.' AI recommendation engine for craving-to-vendor matching using sentiment analysis, image classification, and an AI-generated trust scoring layer over community review data.",
      tags: ["Node.js", "LLM APIs", "Maps"],
      isSecret: false,
    },
    {
      category: "SIDE PROJECT",
      status: "DESIGN",
      statusType: "inProgress",
      title: "insaneFit",
      titleHindi: null as string | null,
      url: null as string | null,
      description: "AI-powered Indian fitness and nutrition tracker. AI workout recommendations, Indian food calorie database, smart nutrition planning, and progress analytics — targeting iOS, Android, and MWeb via a unified React Native codebase.",
      tags: ["React Native", "REST APIs", "AI"],
      isSecret: false,
    },
    {
      category: "SECRET PROJECT",
      status: "◈ SOON",
      statusType: "secret",
      title: "Zuno",
      titleHindi: null as string | null,
      url: null as string | null,
      description: "Something is being built. Details intentionally hidden — launching soon.",
      tags: ["?", "?", "?"],
      isSecret: true,
    },
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
            const isLive = project.statusType === 'live';
            const isSecret = project.isSecret;

            // Status pill styling based on statusType
            const pillStyle: React.CSSProperties = isLive
              ? {
                  color: '#10b981',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.2)',
                }
              : project.statusType === 'secret'
              ? {
                  color: 'var(--pf-indigo, #6366f1)',
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.3)',
                }
              : {
                  color: '#fbbf24',
                  background: 'rgba(251,191,36,0.1)',
                  border: '1px solid rgba(251,191,36,0.2)',
                };

            const cardContent = (
              <div
                className={`${styles.projectCard}${isSecret ? ` ${styles.secretCard}` : ''}`}
              >
                <div className={styles.projectContent}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#22d3ee',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {project.category}
                    </span>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '100px',
                      ...pillStyle
                    }}>
                      {project.status}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                    <h3 className={styles.projectTitle} style={{ marginBottom: 0 }}>
                      {project.title}
                      {project.titleHindi && (
                        <span className={styles.titleHindi}>{project.titleHindi}</span>
                      )}
                    </h3>
                    {project.url && (
                      <a
                        href={project.url}
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
