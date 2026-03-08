'use client'

import { motion } from 'framer-motion'

interface EndingSlideProps {
  mainText: string
  subtext: string
  altText: string
  altSubtext: string
  useAlt: boolean
}

export function EndingSlide({ mainText, subtext, altText, altSubtext, useAlt }: EndingSlideProps) {
  const text = useAlt ? altText : mainText
  const sub = useAlt ? altSubtext : subtext

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20">
      {/* Floating hearts */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute text-xl"
          style={{ color: i % 2 === 0 ? '#D8A7B1' : '#F4C2C2' }}
          initial={{
            x: `${Math.random() * 100}vw`,
            y: '100vh',
            opacity: 0,
          }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.6, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeOut',
          }}
        >
          &#10084;
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-6 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl leading-tight md:text-7xl"
          style={{
            fontFamily: 'var(--font-playfair)',
            color: '#D8A7B1',
          }}
        >
          {text}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-xl leading-relaxed md:text-2xl"
          style={{
            fontFamily: 'var(--font-dancing)',
            color: '#8B6F5C',
          }}
        >
          {sub}
        </motion.p>

        {useAlt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="my-8 h-px w-24"
              style={{ backgroundColor: '#E8DCCF' }}
            />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="text-3xl leading-tight md:text-5xl"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: '#4A3728',
              }}
            >
              {mainText}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className="text-lg"
              style={{
                fontFamily: 'var(--font-dancing)',
                color: '#C6A75E',
              }}
            >
              {subtext}
            </motion.p>
          </>
        )}
      </motion.div>
    </section>
  )
}
