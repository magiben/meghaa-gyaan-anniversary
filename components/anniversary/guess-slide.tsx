'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GuessSlideProps {
  anniversaryNumber: number
  heading: string
  photos: { src: string; caption: string }[]
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

export function GuessSlide({ anniversaryNumber, heading, photos }: GuessSlideProps) {
  const [revealed, setRevealed] = useState(false)
  const displayHeading = heading.replace('{n}', `${anniversaryNumber}${getOrdinalSuffix(anniversaryNumber)}`)

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="guess"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <motion.h2
              className="text-4xl leading-relaxed md:text-6xl"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: '#4A3728',
              }}
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              {'Guess what\'s todayyyyy '}
              <span role="img" aria-label="eyes">{'👀'}</span>
            </motion.h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRevealed(true)}
              className="rounded-full px-10 py-4 text-lg font-medium text-white transition-all"
              style={{
                backgroundColor: '#D8A7B1',
                fontFamily: 'var(--font-dancing)',
                fontSize: '1.3rem',
              }}
            >
              Okay tell me.
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center gap-12 text-center"
          >
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl leading-tight md:text-7xl"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: '#D8A7B1',
                }}
              >
                {displayHeading} <span role="img" aria-label="heart">{'❤️'}</span>
              </motion.h2>
            </div>

            <div className="grid w-full max-w-3xl grid-cols-2 gap-4 md:gap-6">
              {photos.map((photo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -2 : 2 }}
                  animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2 : 2 }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
                  className="group overflow-hidden rounded-lg shadow-lg"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div
                    className="aspect-square w-full"
                    style={{
                      backgroundColor: photo.src ? 'transparent' : '#E8DCCF',
                      backgroundImage: photo.src ? `url(${photo.src})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!photo.src && (
                      <div className="flex h-full items-center justify-center">
                        <svg className="h-12 w-12 opacity-30" style={{ color: '#8B6F5C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p
                    className="px-3 py-3 text-center text-sm"
                    style={{
                      fontFamily: 'var(--font-dancing)',
                      color: '#8B6F5C',
                      fontSize: '1rem',
                    }}
                  >
                    {photo.caption}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
