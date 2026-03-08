'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MusicPlayerProps {
  musicUrl: string
  autoplay?: boolean
}

export function MusicPlayer({ musicUrl, autoplay = true }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (autoplay && musicUrl && audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay blocked, user needs to interact
      })
    }
  }, [autoplay, musicUrl])

  const toggle = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.volume = 0.3
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  if (!musicUrl) return null

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        className="fixed left-4 bottom-4 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
        style={{
          backgroundColor: 'rgba(216, 167, 177, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        <svg
          className="h-5 w-5"
          style={{ color: '#FFFFFF' }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          {isPlaying ? (
            <>
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </>
          ) : (
            <path d="M8 5v14l11-7z" />
          )}
        </svg>
        {/* Pulsing heart shape around button */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid #D8A7B1' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
        )}
      </motion.button>
    </>
  )
}
