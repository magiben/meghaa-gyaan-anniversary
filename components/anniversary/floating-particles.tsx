'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  type: 'light' | 'heart'
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const items: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 5,
      type: i % 5 === 0 ? 'heart' : 'light',
    }))
    setParticles(items)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 10, -10, 5, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        >
          {p.type === 'heart' ? (
            <span style={{ fontSize: `${p.size * 3}px`, color: '#D8A7B1', opacity: 0.3 }}>
              &#10084;
            </span>
          ) : (
            <div
              className="rounded-full"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: '#C6A75E',
                opacity: 0.25,
                filter: 'blur(1px)',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}
