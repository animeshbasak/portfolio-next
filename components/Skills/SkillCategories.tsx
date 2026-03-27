'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@lib/motion'
import styles from './Skills.module.css'

const CATEGORIES = [
  {
    title: 'Frontend Core',
    tags: ['React', 'TypeScript', 'JavaScript ES6+', 'HTML5', 'CSS3/SCSS', 'Web Performance', 'Accessibility', 'DOM API'],
  },
  {
    title: 'Rendering & Backend',
    tags: ['Next.js 15', 'SSR/SSG', 'Node.js', 'Spring Boot', 'REST APIs', 'Redux', 'Supabase', 'Vite/Webpack'],
  },
  {
    title: 'AI / LLM',
    tags: ['Claude API', 'Gemini API', 'Groq', 'OpenAI', 'RAG Pipelines', 'LlamaIndex', 'Ollama', 'Prompt Engineering'],
  },
  {
    title: 'DevOps & Testing',
    tags: ['Vitest', 'Jest', 'React Testing Library', 'Sentry', 'Jenkins', 'GitHub Actions', 'Docker', 'GrowthBook'],
  },
]

export default function SkillCategories() {
  return (
    <div className={styles.categories}>
      <div className={styles['cat-heading']}>FULL ARSENAL</div>
      <div className={styles['cat-subtext']}>
        Every tool earned in production. No tutorial certificates. Battle-tested instruments of engineering craft.
      </div>

      {CATEGORIES.map((cat, idx) => (
        <motion.div
          key={cat.title}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: idx * 0.08 }}
        >
          <div className={styles['cat-title']}>{cat.title}</div>
          <div className={styles['cat-tags']}>
            {cat.tags.map((tag) => (
              <span key={tag} className={styles['cat-tag']} data-hover>
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
