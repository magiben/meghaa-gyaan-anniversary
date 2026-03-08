'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OpenWhenProps {
  envelopes: { label: string; message: string }[]
}

export function OpenWhen({ envelopes }: OpenWhenProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="flex flex-col items-center px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-4 text-3xl md:text-5xl"
        style={{
          fontFamily: 'var(--font-playfair)',
          color: '#4A3728',
        }}
      >
        Open When You Miss Me
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-12 text-lg"
        style={{
          fontFamily: 'var(--font-dancing)',
          color: '#8B6F5C',
        }}
      >
        Tap an envelope to open it.
      </motion.p>

      <div className="grid w-full max-w-3xl grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {envelopes.map((env, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full flex-col items-center gap-3 rounded-xl p-5 shadow-md transition-shadow hover:shadow-lg md:p-6"
              style={{
                backgroundColor: openIndex === i ? 'rgba(216, 167, 177, 0.15)' : '#FFFFFF',
                border: `1px solid ${openIndex === i ? '#D8A7B1' : '#E8DCCF'}`,
              }}
            >
              {/* Envelope icon */}
              <motion.div
                animate={openIndex === i ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <svg
                  className="h-10 w-10 md:h-12 md:w-12"
                  style={{ color: openIndex === i ? '#D8A7B1' : '#C6A75E' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </motion.div>
              <span
                className="text-center text-sm md:text-base"
                style={{
                  fontFamily: 'var(--font-dancing)',
                  color: '#8B6F5C',
                  fontSize: '1rem',
                }}
              >
                {env.label}
              </span>
            </motion.button>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="overflow-hidden rounded-lg p-4"
                  style={{
                    backgroundColor: 'rgba(216, 167, 177, 0.08)',
                    border: '1px solid rgba(216, 167, 177, 0.2)',
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      color: '#8B6F5C',
                      lineHeight: '1.7',
                    }}
                  >
                    {env.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
