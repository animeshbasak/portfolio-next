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
      platform: "Airtel Thanks App (PWA & Web)",
      responsibilities: [
        "Leading a 7 member engineering squad delivering scalable frontend and backend solutions across prepaid and postpaid journeys.",
        "Architecting React and TypeScript based frontend interfaces and strengthening BEFE services using Groovy and Spring Boot.",
        "Driving major product flows including Acquisition journeys and SKYC onboarding flows.",
        "Managing delivery lifecycle including PageSpace integrations and V2L monitoring.",
        "Using Jenkins and Kibana for system monitoring, issue detection, and root cause analysis.",
        "Driving platform stability and performance improvements across revenue impacting customer journeys."
      ]
    },
    {
      company: "MakeMyTrip India Pvt Ltd",
      role: "Senior Software Engineer II – Full Stack",
      duration: "July 2024 – May 2025",
      location: "Gurugram",
      platform: "Hotels Booking Platform",
      responsibilities: [
        "Reduced page load time by 40%.",
        "Implemented server-side rendering and SEO optimizations.",
        "Improved Lighthouse performance scores and crawl efficiency.",
        "Built modular reusable component architecture, reducing developer onboarding time by 30%.",
        "Implemented A/B experimentation frameworks using analytics instrumentation and feature flags."
      ],
      modules: "Rush Deals, Review Page Revamp, Hotel Booking Funnel"
    },
    {
      company: "One97 Communications Ltd (Paytm)",
      role: "Software Engineer",
      duration: "October 2021 – June 2024",
      location: "Noida",
      platform: "Merchant Platform",
      responsibilities: [
        "Migrated legacy merchant workflows to React based architecture.",
        "Improved Soundbox purchase journey resulting in 40% increase in EDC device sales.",
        "Built analytics dashboards improving merchant engagement by 10–15%.",
        "Enhanced merchant onboarding and profile management journeys.",
        "Integrated Spring Boot backend services for onboarding and transaction APIs."
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

                  {exp.modules && (
                    <div className={styles.modulesTag}>
                      <strong>Major Modules:</strong> {exp.modules}
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
