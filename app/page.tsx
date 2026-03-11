'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getSiteData, saveSiteData, type SiteData } from '@/lib/store'
import { loadDataFromURL, loadDataFromShortId } from '@/lib/share-utils'
import { getSessionData, setSessionData } from '@/lib/session-store'
import { Countdown } from '@/components/anniversary/countdown'
import { NicknameSelect } from '@/components/anniversary/nickname-select'
import { GuessSlide } from '@/components/anniversary/guess-slide'
import { DigitalDiary } from '@/components/anniversary/digital-diary'
import { MemoryBook } from '@/components/anniversary/memory-book'
import { PoemsSection } from '@/components/anniversary/poems-section'
import { OpenWhen } from '@/components/anniversary/open-when'
import { LoveTraits } from '@/components/anniversary/love-traits'
import { EndingSlide } from '@/components/anniversary/ending-slide'
import { SectionDivider } from '@/components/anniversary/section-divider'
import { EditPanel } from '@/components/anniversary/edit-panel'
import { MusicPlayer } from '@/components/anniversary/music-player'
import { FloatingParticles } from '@/components/anniversary/floating-particles'
import { ClickSparkles } from '@/components/anniversary/click-sparkles'

type Phase = 'countdown' | 'nickname' | 'main'

export default function AnniversaryPage() {
  const [phase, setPhase] = useState<Phase>('countdown')
  const [data, setData] = useState<SiteData | null>(null)
  const [startMusic, setStartMusic] = useState(false)

  const loadData = useCallback(async () => {
    // Priority 1: Check URL parameter for short ID
    const { id } = loadDataFromURL()
    if (id) {
      const urlData = await loadDataFromShortId(id)
      if (urlData) {
        setData(urlData)
        setSessionData(urlData)
        return
      }
    }
    
    // Priority 2: Check session data (from current editing)
    const sessionData = getSessionData()
    if (sessionData) {
      setData(sessionData)
      return
    }
    
    // Priority 3: Load default data
    const defaultData = getSiteData()
    setData(defaultData)
    setSessionData(defaultData)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    // Only listen to storage updates if there's no URL parameter
    const { id } = loadDataFromURL()
    if (id) return // Don't reload from storage if viewing a shared link
    
    const handler = () => loadData()
    window.addEventListener('site-data-updated', handler)
    return () => window.removeEventListener('site-data-updated', handler)
  }, [loadData])

  if (!data) return null

  return (
    <div className="custom-cursor grain-overlay" style={{ backgroundColor: '#F8F4EC' }}>
      <ClickSparkles />

      <AnimatePresence mode="wait">
        {phase === 'countdown' && (
          <Countdown
            key="countdown"
            texts={data.countdownTexts}
            onComplete={() => {
              setPhase('nickname')
              setStartMusic(true)
            }}
          />
        )}

        {phase === 'nickname' && (
          <NicknameSelect
            key="nickname"
            nicknames={data.nicknames}
            onComplete={() => setPhase('main')}
          />
        )}

        {phase === 'main' && (
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <FloatingParticles />

            {/* Section 1: Guess / Anniversary Reveal */}
            <GuessSlide
              anniversaryNumber={data.anniversaryNumber}
              heading={data.anniversaryHeading}
              photos={data.photos}
            />

            <SectionDivider />

            {/* Section 2: Digital Diary */}
            <DigitalDiary video={data.diaryVideo} />

            <SectionDivider />

            {/* Section 3: Memory Book */}
            <MemoryBook memories={data.memoryBook} />

            <SectionDivider />

            {/* Section 4: Poems & Messages */}
            <PoemsSection poems={data.poems} />

            <SectionDivider />

            {/* Section 5: Open When */}
            <OpenWhen envelopes={data.envelopes} />

            <SectionDivider />

            {/* Section 6: Little Things I Love */}
            <LoveTraits traits={data.traits} />

            <SectionDivider />

            {/* Section 7: Ending */}
            <EndingSlide
              mainText={data.endingText}
              subtext={data.endingSubtext}
              altText={data.altEndingText}
              altSubtext={data.altEndingSubtext}
              useAlt={data.useAltEnding}
            />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Music Player - appears after countdown */}
      {startMusic && <MusicPlayer musicUrl={data.musicUrl} autoplay={true} />}

      {/* Edit Panel - always available */}
      {phase === 'main' && <EditPanel onDataChange={loadData} />}
    </div>
  )
}
