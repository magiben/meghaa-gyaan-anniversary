'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MemoryBookProps {
  memories: { src: string; caption: string }[]
}

export function MemoryBook({ memories }: MemoryBookProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

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
        Our Memory Book
      </motion.h2>

      <div className="grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-3 md:gap-8">
        {memories.map((memory, i) => {
          const rotation = ((i % 5) - 2) * 2.5
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, rotate: rotation }}
              whileInView={{ opacity: 1, y: 0, rotate: rotation }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
              onClick={() => setSelectedIndex(i)}
              className="cursor-pointer p-2 shadow-lg transition-shadow hover:shadow-xl"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <div
                className="aspect-square w-full"
                style={{
                  backgroundColor: memory.src ? 'transparent' : '#E8DCCF',
                  backgroundImage: memory.src ? `url(${memory.src})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!memory.src && (
                  <div className="flex h-full items-center justify-center">
                    <svg className="h-10 w-10 opacity-30" style={{ color: '#8B6F5C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <p
                className="mt-2 text-center text-sm"
                style={{
                  fontFamily: 'var(--font-dancing)',
                  color: '#8B6F5C',
                  fontSize: '0.95rem',
                }}
              >
                {memory.caption}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: 'rgba(74, 55, 40, 0.7)' }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[80vh] max-w-lg overflow-hidden rounded-lg p-3 shadow-2xl"
              style={{ backgroundColor: '#FFFFFF' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="aspect-square w-full rounded"
                style={{
                  backgroundColor: memories[selectedIndex].src ? 'transparent' : '#E8DCCF',
                  backgroundImage: memories[selectedIndex].src ? `url(${memories[selectedIndex].src})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minWidth: '300px',
                }}
              >
                {!memories[selectedIndex].src && (
                  <div className="flex h-full items-center justify-center" style={{ minHeight: '300px' }}>
                    <svg className="h-16 w-16 opacity-30" style={{ color: '#8B6F5C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <p
                className="mt-3 text-center text-lg"
                style={{
                  fontFamily: 'var(--font-dancing)',
                  color: '#8B6F5C',
                }}
              >
                {memories[selectedIndex].caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
