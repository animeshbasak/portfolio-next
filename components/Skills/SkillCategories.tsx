'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@lib/motion'
import styles from './Skills.module.css'

const CATEGORIES = [
  {
    title: 'AI / LLM',
    tags: ['Agentic Systems', 'Claude API', 'Gemini API', 'Groq', 'OpenAI', 'RAG Pipelines', 'LlamaIndex', 'Ollama', 'Prompt Engineering'],
  },
  {
    title: 'Frontend Core',
    tags: ['React', 'TypeScript', 'JavaScript ES6+', 'HTML5', 'CSS3/SCSS', 'Web Performance', 'Accessibility', 'DOM API'],
  },
  {
    title: 'Rendering & Backend',
    tags: ['Next.js 15', 'SSR/SSG', 'Node.js', 'Express', 'Spring Boot', 'REST APIs', 'PostgreSQL', 'Supabase', 'Vite/Webpack'],
  },
  {
    title: 'DevOps & Testing',
    tags: ['Vitest', 'Jest', 'React Testing Library', 'Sentry', 'Jenkins', 'GitHub Actions', 'Docker', 'GrowthBook'],
  },
]

export default function SkillCategories() {
  return (
    <div className={styles.categories}>
      <div className={styles['cat-heading']}>TOOLS I USE</div>
      <div className={styles['cat-subtext']}>
        Tools from my frontend career and independent builds, with a focus on clear interfaces and useful AI workflows.
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
