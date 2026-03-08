"use client";

import { motion } from "framer-motion";
import FadeIn from "./FadeIn";
import styles from "./Experience.module.css";
import { Building2, Calendar, LayoutTemplate } from "lucide-react";

export default function Experience() {
  const experiences = [
    {
      company: "Airtel Digital Ltd.",
      role: "Lead Engineer – Full Stack",
      duration: "June 2025 – Present",
      location: "Gurugram",
      platform: "Airtel Thanks App (MWeb) · Airtel DWeb · ~150M MAU",
      responsibilities: [
        <>Serve as <strong>tech lead on a 5–7 engineer full-stack team</strong>, owning technical direction, architecture decisions, and code quality across prepaid and postpaid journeys on <strong>MWeb (Airtel Thanks App) and DWeb</strong></>,
        <>Own the <strong>second-level code review gate</strong> — peer reviews completed first, my review serves as the final quality and architecture sign-off before merge</>,
        <><strong>Designed and implemented React/TypeScript architecture</strong> for Airtel MWeb and DWeb acquisition journeys (~150M MAU) — integrating Groovy/Spring Boot BEFE services across Airtel One, Airtel Black, Prepaid Acquisition, Postpaid Acquisition, and SKYC flows</>,
        <>Own delivery across critical acquisition journeys — coordinating <strong>PageSpace integration, V2L monitoring, Jenkins CI/CD, and Kibana observability</strong> to maintain release reliability and drive structured RCA</>,
        <>Drive end-to-end technical design — authoring <strong>HLD and LLD documents with Architect sign-off</strong>, contributing to shared design system and widget library, managing <strong>variant-based rollouts via GrowthBook</strong>, and monitoring post-deploy health via <strong>V2L metrics and Superset dashboards</strong></>
      ]
    },
    {
      company: "MakeMyTrip India Pvt Ltd",
      role: "Senior Software Engineer II – Full Stack",
      duration: "July 2024 – May 2025",
      location: "Gurugram",
      platform: "Hotels Platform · ~5M Monthly Sessions",
      responsibilities: [
        <><strong>Optimised SSR-based Hotels booking funnel</strong> across PWA and desktop — improving average Lighthouse performance score from <strong>~6 to 8–9</strong> through SSR flow tuning, LCP optimisation, and critical rendering path improvements</>,
        <>Identified and resolved a <strong>systemic bug responsible for 1,000+ Sentry errors</strong> across hotel booking flows within <strong>48 hours</strong> — significantly improving platform stability and reducing production error rates</>,
        <>Delivered multiple <strong>high-impact experimentation and feature journeys</strong> across domestic Hotels — including <strong>Rush Deals, Devotees, Collections</strong>, and several A/B tested product surfaces driving conversion uplift</>,
        <><strong>Revamped the PWA Review Page</strong> and multiple listing and detail pages to achieve full <strong>parity with iOS and Android apps</strong> — improving visual consistency and interaction quality</>,
        <>Designed <strong>modular, reusable React component architecture</strong> — reducing developer onboarding time by <strong>~30%</strong> (per team lead feedback), standardising UI patterns, and accelerating feature delivery</>,
        <>Strengthened release reliability by achieving <strong>~90%+ test coverage</strong> using Vitest, Jest, and React Testing Library</>
      ]
    },
    {
      company: "One97 Communications Ltd (Paytm)",
      role: "Software Engineer",
      duration: "October 2021 – June 2024",
      location: "Noida",
      platform: "Merchant Platform · ~3M Active Merchants",
      responsibilities: [
        <><strong>Led migration of legacy merchant platform</strong> to modern React architecture — improving code maintainability, scalability, and <strong>Lighthouse performance scores from ~6 to 8–9</strong> across Paytm for Business merchant workflows serving <strong>~3M active merchants</strong></>,
        <>Revamped the <strong>Soundbox purchase journey</strong> through UX simplification and checkout flow optimisation — contributing to a <strong>40% increase in EDC device sales</strong> (confirmed by business team)</>,
        <>Served as <strong>sole Analytics SPOC</strong> for the merchant squad — built and owned dashboards end-to-end improving merchant engagement by <strong>10–15%</strong> (cited by manager)</>,
        <>Enhanced merchant onboarding and business profile management journeys, reducing operational support dependencies through self-service adoption</>,
        <>Collaborated with backend teams to integrate Spring Boot services; delivered responsive, accessible merchant interfaces via Figma</>
      ]
    },
    {
      company: "Sparklin Innovations",
      role: "Frontend Developer",
      duration: "January 2021 – October 2021",
      location: "Remote (Delhi NCR)",
      platform: "ICICI Internet Banking – Nirvana Project",
      responsibilities: [
        "Developed modular Angular UI components.",
        "Improved banking workflows usability and accessibility compliance.",
        "Reduced initial load latency."
      ]
    },
    {
      company: "Infosys Ltd",
      role: "Systems Engineer",
      duration: "December 2018 – January 2021",
      location: "Hyderabad",
      platform: "FINACLE ecosystem @ ANZ Bank",
      responsibilities: [
        "Built React based UI components for banking platform.",
        "Performed API validation and automation testing using Postman and WebDriverIO.",
        "Improved regression testing reliability."
      ]
    }
  ];

  return (
    <section id="experience" className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <h2 className={styles.sectionTitle}>
            Career <span className="gradient-text">Trajectory</span>
          </h2>
        </FadeIn>

        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.timelineDot} />
              <FadeIn delay={index * 0.1}>
                <div className={styles.experienceCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.roleInfo}>
                      <h3 className={styles.role}>{exp.role}</h3>
                      <div className={styles.companyMeta}>
                        <span className={styles.metaItem}>
                          <Building2 size={16} className={styles.metaIcon} />
                          {exp.company}
                        </span>
                        <span className={styles.metaDivider}>•</span>
                        <span className={styles.metaItem}>
                          <Calendar size={16} className={styles.metaIcon} />
                          {exp.duration}
                        </span>
                      </div>
                      <div className={styles.platformMeta}>
                        <LayoutTemplate size={16} className={styles.metaIcon} />
                        {exp.platform}
                      </div>
                    </div>
                  </div>
                  
                  <ul className={styles.responsibilities}>
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
