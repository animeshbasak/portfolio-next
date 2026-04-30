'use client'

import { motion } from 'framer-motion'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  y?: number
}

export default function Reveal({ children, delay = 0, y = 14 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
