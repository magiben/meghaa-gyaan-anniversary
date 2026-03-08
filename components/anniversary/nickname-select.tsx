'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NicknameSelectProps {
  nicknames: string[]
  onComplete: () => void
}

export function NicknameSelect({ nicknames, onComplete }: NicknameSelectProps) {
  const [selected, setSelected] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  const handleClick = () => {
    setSelected(true)
    setTimeout(() => setShowMessage(true), 600)
    setTimeout(() => onComplete(), 2500)
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#F8F4EC' }}
    >
      <AnimatePresence mode="wait">
        {!showMessage ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-10 text-center"
          >
            <h2
              className="text-2xl leading-relaxed md:text-4xl"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: '#4A3728',
              }}
            >
              {"Enter the nickname I've kept for you."}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {nicknames.map((name, i) => (
                <motion.button
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClick}
                  disabled={selected}
                  className="rounded-full border px-8 py-3 text-lg transition-all md:px-10 md:py-4 md:text-xl"
                  style={{
                    fontFamily: 'var(--font-dancing)',
                    borderColor: '#D8A7B1',
                    color: '#8B6F5C',
                    backgroundColor: selected ? 'rgba(216, 167, 177, 0.2)' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {name}
                </motion.button>
              ))}
            </div>
            {selected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-1"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0.8],
                      y: [0, -30, -50],
                    }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="text-2xl"
                    style={{ color: '#D8A7B1' }}
                  >
                    &#10084;
                  </motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="message"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center"
          >
            <p
              className="text-3xl leading-relaxed md:text-5xl"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: '#D8A7B1',
              }}
            >
              {"Obviously it's you."}
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-lg"
              style={{
                fontFamily: 'var(--font-dancing)',
                color: '#8B6F5C',
              }}
            >
              {"You're all of these."}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
