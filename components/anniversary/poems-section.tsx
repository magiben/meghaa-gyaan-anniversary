'use client'

import { motion } from 'framer-motion'

interface PoemsSectionProps {
  poems: { title: string; content: string; type: 'poem' | 'letter' | 'note' }[]
}

export function PoemsSection({ poems }: PoemsSectionProps) {
  const typeStyles = {
    poem: {
      bg: 'rgba(216, 167, 177, 0.1)',
      border: '#D8A7B1',
      icon: 'var(--font-playfair)',
    },
    letter: {
      bg: 'rgba(198, 167, 94, 0.1)',
      border: '#C6A75E',
      icon: 'var(--font-playfair)',
    },
    note: {
      bg: 'rgba(244, 194, 194, 0.1)',
      border: '#F4C2C2',
      icon: 'var(--font-dancing)',
    },
  }

  return (
    <section className="flex flex-col items-center px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-3xl md:text-5xl"
        style={{
          fontFamily: 'var(--font-playfair)',
          color: '#4A3728',
        }}
      >
        For You
      </motion.h2>

      <div className="flex w-full max-w-3xl flex-col gap-8">
        {poems.map((poem, i) => {
          const style = typeStyles[poem.type]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="rounded-xl border-l-4 p-6 md:p-8"
              style={{
                backgroundColor: style.bg,
                borderLeftColor: style.border,
              }}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-xs uppercase tracking-wider"
                  style={{
                    backgroundColor: `${style.border}30`,
                    color: '#8B6F5C',
                    fontFamily: 'var(--font-inter)',
                  }}
                >
                  {poem.type}
                </span>
              </div>
              <h3
                className="mb-4 text-xl md:text-2xl"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: '#4A3728',
                }}
              >
                {poem.title}
              </h3>
              <p
                className="whitespace-pre-line leading-relaxed"
                style={{
                  fontFamily: poem.type === 'note' ? 'var(--font-dancing)' : 'var(--font-inter)',
                  color: '#8B6F5C',
                  fontSize: poem.type === 'note' ? '1.15rem' : '0.95rem',
                  lineHeight: '1.8',
                }}
              >
                {poem.content}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
