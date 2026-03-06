"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import FadeIn from "./FadeIn";
import styles from "./About.module.css";
import { Coffee, Code2, Globe } from "lucide-react";

export default function About() {
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, 7, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          setCount(Math.floor(value));
        }
      });
      return () => controls.stop();
    }
  }, [isInView]);

  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <h2 className={styles.sectionTitle}>
            Architecting the <span className="gradient-text">Future</span>
          </h2>
        </FadeIn>

        <div className={styles.grid}>
          {/* Bio Column */}
          <div className={styles.bioColumn}>
            <FadeIn delay={0.1}>
              <p className={styles.bioText}>
                Lead Frontend Engineer with over 7 years of experience architecting high-scale, performance-centric web platforms across Fintech, Telecom, Travel, and Banking ecosystems.
              </p>
              <p className={styles.bioText}>
                Specialized in scalable UI architecture using React and TypeScript, with deep understanding of browser internals, rendering lifecycle, async execution models, and performance optimization for high-traffic PWA platforms.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard} ref={countRef}>
                  <div className={styles.statNumber}>{count}+</div>
                  <div className={styles.statLabel}>Years of Experience</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>5</div>
                  <div className={styles.statLabel}>Major Platforms Built</div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Highlights Column */}
          <div className={styles.highlightsColumn}>
            <FadeIn delay={0.3}>
              <div className={styles.highlightTabs}>
                <div className={styles.tab}>
                  <div className={styles.iconBox}><Globe size={24} /></div>
                  <div>
                    <h3>Companies</h3>
                    <p>Airtel, MakeMyTrip, Paytm, Sparklin, Infosys</p>
                  </div>
                </div>
                <div className={styles.tab}>
                  <div className={styles.iconBox}><Code2 size={24} /></div>
                  <div>
                    <h3>Major Platforms</h3>
                    <p>Airtel Thanks App, MMT Hotels, Paytm Merchant</p>
                  </div>
                </div>
                <div className={styles.tab}>
                  <div className={styles.iconBox}><Coffee size={24} /></div>
                  <div>
                    <h3>Education</h3>
                    <p>B.Tech CS (75.4%), Inderprastha Engineering College</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
