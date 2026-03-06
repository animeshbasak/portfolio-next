"use client";

import FadeIn from "./FadeIn";
import styles from "./Contact.module.css";
import { Mail, Linkedin, Github, Twitter, MapPin, Send, Instagram } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <div className={styles.header}>
            <h2 className={styles.sectionTitle}>
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Open for new opportunities, architectural discussions, or just saying hi.
            </p>
          </div>
        </FadeIn>

        <div className={styles.grid}>
          <FadeIn delay={0.1}>
            <div className={styles.contactInfo}>
              <div className={styles.infoCard}>
                <div className={styles.iconBox}><Mail size={24} /></div>
                <div>
                  <h3>Email</h3>
                  <a href="mailto:animeshsbasak@gmail.com">animeshsbasak@gmail.com</a>
                </div>
              </div>
              
              <div className={styles.infoCard}>
                <div className={styles.iconBox}><MapPin size={24} /></div>
                <div>
                  <h3>Location</h3>
                  <p>New Delhi, India</p>
                </div>
              </div>

              <div className={styles.socialLinks}>
                <a href="https://www.linkedin.com/in/animeshbasak/" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="LinkedIn"><Linkedin size={22} /></a>
                <a href="https://github.com/animeshbasak" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="GitHub"><Github size={22} /></a>
                <a href="https://x.com/animeshsbasak" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="X / Twitter"><Twitter size={22} /></a>
                <a href="https://www.instagram.com/insanemeshh" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Instagram"><Instagram size={22} /></a>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" required placeholder="John Doe" />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" required placeholder="john@example.com" />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" rows={5} required placeholder="Hey Animesh, building something cool..." />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting || submitted}>
                {submitted ? "Message Sent!" : isSubmitting ? "Sending..." : (
                  <>Send Message <Send size={18} /></>
                )}
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
      
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Animesh Basak. All rights reserved.</p>
        <p>Built with Next.js, Framer Motion & CSS Modules.</p>
      </footer>
    </section>
  );
}
