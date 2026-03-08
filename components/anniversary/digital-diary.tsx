'use client'

import { motion } from 'framer-motion'

interface DigitalDiaryProps {
  video: { src: string; caption: string; autoplay: boolean }
}

export function DigitalDiary({ video }: DigitalDiaryProps) {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="flex w-full max-w-2xl flex-col items-center gap-8"
      >
        <h2
          className="text-3xl md:text-5xl"
          style={{
            fontFamily: 'var(--font-playfair)',
            color: '#4A3728',
          }}
        >
          Digital Diary
        </h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full overflow-hidden rounded-xl shadow-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="p-3 md:p-4">
            {video.src ? (
              <video
                src={video.src}
                controls
                autoPlay={video.autoplay}
                muted
                playsInline
                className="aspect-video w-full rounded-lg object-cover"
                style={{ backgroundColor: '#E8DCCF' }}
              />
            ) : (
              <div
                className="flex aspect-video w-full items-center justify-center rounded-lg"
                style={{ backgroundColor: '#E8DCCF' }}
              >
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <svg className="h-16 w-16" style={{ color: '#8B6F5C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span
                    className="text-sm"
                    style={{ fontFamily: 'var(--font-dancing)', color: '#8B6F5C' }}
                  >
                    Upload a video in Edit Mode
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center text-lg leading-relaxed md:text-xl"
          style={{
            fontFamily: 'var(--font-dancing)',
            color: '#8B6F5C',
          }}
        >
          {video.caption}
        </motion.p>
      </motion.div>
    </section>
  )
}
