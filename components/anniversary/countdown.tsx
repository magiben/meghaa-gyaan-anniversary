'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CountdownProps {
  texts: string[]
  onComplete: () => void
}

export function Countdown({ texts, onComplete }: CountdownProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (currentIndex < texts.length) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setDone(true)
        onComplete()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, texts.length, onComplete])

  if (done) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#F8F4EC' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Soft blurred circles in background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(216, 167, 177, 0.2)' }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(244, 194, 194, 0.2)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(198, 167, 94, 0.15)' }}
        />
      </div>

      <AnimatePresence mode="wait">
        {currentIndex < texts.length && (
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="text-8xl font-bold tracking-tight md:text-9xl"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: '#D8A7B1',
            }}
          >
            {texts[currentIndex]}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
