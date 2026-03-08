'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Sparkle {
  id: number
  x: number
  y: number
}

export function ClickSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  const handleClick = useCallback((e: MouseEvent) => {
    const id = Date.now()
    const newSparkles = Array.from({ length: 5 }, (_, i) => ({
      id: id + i,
      x: e.clientX,
      y: e.clientY,
    }))
    setSparkles((prev) => [...prev, ...newSparkles])
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.find((ns) => ns.id === s.id)))
    }, 1000)
  }, [])

  useEffect(() => {
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [handleClick])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998]">
      <AnimatePresence>
        {sparkles.map((s) => {
          const angle = (s.id % 5) * (360 / 5) * (Math.PI / 180)
          const distance = 20 + Math.random() * 20
          return (
            <motion.span
              key={s.id}
              className="absolute"
              style={{
                left: s.x,
                top: s.y,
                fontSize: '12px',
                color: s.id % 2 === 0 ? '#D8A7B1' : '#C6A75E',
              }}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 0.5,
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              &#10084;
            </motion.span>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
