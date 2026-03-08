"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail, Download } from "lucide-react";
import FadeIn from "./FadeIn";
import styles from "./Hero.module.css";

export default function Hero() {
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className={styles.heroSection}>
      {/* Abstract Background Elements */}
      <motion.div className={styles.blob1} style={{ y: y1 }} />
      <motion.div className={styles.blob2} style={{ y: y2 }} />
      
      <div className={styles.container}>
        <motion.div style={{ opacity }} className={styles.content}>
          <FadeIn delay={0.1}>
            <div className={styles.badge}>
              <span className={styles.pulse}></span>
              Available for new opportunities
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h1 className={styles.headline}>
              Building high-scale <br />
              web platforms used <br />
              <span className="gradient-text">by millions.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className={styles.subheadline}>
              Lead Frontend Engineer specializing in scalable UI architecture, 
              SSR, web performance engineering, and AI-native product development.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className={styles.actions}>
              <a href="#experience" className={styles.primaryButton}>
                View Experience
                <ArrowRight size={18} />
              </a>
              <a href="https://animeshbasak.vercel.app/Animesh_Basak_Resume_2026.pdf" target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>
                <Download size={18} />
                Resume
              </a>
              <a href="#contact" className={styles.secondaryButton}>
                <Mail size={18} />
                Contact
              </a>
            </div>
          </FadeIn>
        </motion.div>
      </div>
    </section>
  );
}
