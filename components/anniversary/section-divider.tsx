'use client'

import { motion } from 'framer-motion'

export function SectionDivider() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mx-auto flex w-full max-w-md items-center justify-center gap-4 py-8"
    >
      <div className="h-px flex-1" style={{ backgroundColor: '#E8DCCF' }} />
      <span style={{ color: '#D8A7B1', fontSize: '14px' }}>&#10084;</span>
      <div className="h-px flex-1" style={{ backgroundColor: '#E8DCCF' }} />
    </motion.div>
  )
}
