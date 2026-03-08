'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoveTraitsProps {
  traits: string[]
}

export function LoveTraits({ traits }: LoveTraitsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (traits.length === 0) return

    const currentTrait = traits[currentIndex % traits.length]

    if (isTyping) {
      if (displayedText.length < currentTrait.length) {
        const timer = setTimeout(() => {
          setDisplayedText(currentTrait.slice(0, displayedText.length + 1))
        }, 50)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => setIsTyping(false), 2000)
        return () => clearTimeout(timer)
      }
    } else {
      if (displayedText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 30)
        return () => clearTimeout(timer)
      } else {
        setCurrentIndex((prev) => (prev + 1) % traits.length)
        setIsTyping(true)
      }
    }
  }, [displayedText, isTyping, currentIndex, traits])

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center text-3xl md:text-5xl"
        style={{
          fontFamily: 'var(--font-playfair)',
          color: '#4A3728',
        }}
      >
        Little Things I Love About You
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex min-h-[80px] w-full max-w-2xl items-center justify-center"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            className="text-center text-2xl leading-relaxed md:text-4xl"
            style={{
              fontFamily: 'var(--font-dancing)',
              color: '#D8A7B1',
            }}
          >
            {`"${displayedText}"`}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              style={{ color: '#C6A75E' }}
            >
              |
            </motion.span>
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Dots indicator */}
      <div className="mt-12 flex gap-2">
        {traits.map((_, i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: i === currentIndex % traits.length ? '#D8A7B1' : '#E8DCCF',
            }}
            animate={{
              scale: i === currentIndex % traits.length ? 1.3 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </section>
  )
}
