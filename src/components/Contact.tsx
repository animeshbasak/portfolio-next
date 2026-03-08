"use client";

import FadeIn from "./FadeIn";
import styles from "./Contact.module.css";
import { Mail, Linkedin, Github, Twitter, MapPin, Send, Instagram } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const getMessageBody = () => {
    return `Hi Animesh,\n\n${formData.message}\n\nFrom:\n${formData.name}\n${formData.email}`;
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields");
      return;
    }
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(getMessageBody());
    window.location.href = `mailto:animeshsbasak@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields");
      return;
    }
    const text = encodeURIComponent(getMessageBody());
    // Note: Replace 919999999999 with your actual WhatsApp number with country code (e.g., 91 for India)
    window.open(`https://wa.me/919971340719?text=${text}`, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
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
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" required placeholder="John Doe" value={formData.name} onChange={handleChange} />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" required placeholder="john@example.com" value={formData.email} onChange={handleChange} />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" rows={5} required placeholder="Hey Animesh, building something cool..." value={formData.message} onChange={handleChange} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button onClick={handleEmail} className={styles.submitBtn} disabled={submitted} style={{ flex: '1 1 120px', padding: '0.8rem', minWidth: '120px' }}>
                  {submitted ? "Opened Email!" : (
                    <>Email <Mail size={18} /></>
                  )}
                </button>
                <button onClick={handleWhatsApp} className={styles.submitBtn} disabled={submitted} style={{ flex: '1 1 120px', padding: '0.8rem', background: '#25D366', color: '#fff', borderColor: '#25D366', minWidth: '120px' }}>
                  {submitted ? "Opened WhatsApp!" : (
                    <>WhatsApp <Send size={18} /></>
                  )}
                </button>
              </div>
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
