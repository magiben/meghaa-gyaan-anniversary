export interface SiteData {
  countdownTexts: string[]
  nicknames: string[]
  anniversaryNumber: number
  anniversaryHeading: string
  photos: { src: string; caption: string }[]
  diaryVideo: { src: string; caption: string; autoplay: boolean }
  memoryBook: { src: string; caption: string }[]
  poems: { title: string; content: string; type: 'poem' | 'letter' | 'note' }[]
  envelopes: { label: string; message: string }[]
  traits: string[]
  endingText: string
  endingSubtext: string
  altEndingText: string
  altEndingSubtext: string
  useAltEnding: boolean
  musicUrl: string
  editPassword: string
  passwordProtected: boolean
}

const DEFAULT_DATA: SiteData = {
  countdownTexts: ['3', '2', '1'],
  nicknames: ['Gino', 'Gyaanyaar', 'Kween', 'BKL'],
  anniversaryNumber: 4,
  anniversaryHeading: 'Happy {n}th Anniversary',
  photos: [
    { src: '', caption: 'The day everything started.' },
    { src: '', caption: 'Still my favorite person.' },
    { src: '', caption: 'Chaos but cute.' },
    { src: '', caption: 'Forever looks good on us.' },
  ],
  diaryVideo: { src: '', caption: 'Every second with you is my favorite memory.', autoplay: false },
  memoryBook: [
    { src: '', caption: 'Remember this?' },
    { src: '', caption: 'My heart, every time.' },
    { src: '', caption: 'Us being us.' },
    { src: '', caption: 'The best kind of chaos.' },
    { src: '', caption: 'I keep coming back to this one.' },
    { src: '', caption: 'You make everything better.' },
  ],
  poems: [
    {
      title: 'For You, Always',
      content: 'In the quiet of the night,\nwhen the world has gone to sleep,\nI find myself thinking of you\nand all the promises we keep.\n\nYou are my favorite hello\nand my hardest goodbye.',
      type: 'poem',
    },
    {
      title: 'A Letter',
      content: "I don't know how to say this without sounding dramatic, but you changed my life. Not in a big-bang kind of way, but in the quiet way mornings feel better because you exist in the same world as me. I'm grateful. Always.",
      type: 'letter',
    },
    {
      title: 'Quick Note',
      content: "You're annoying. But like, the kind of annoying I want to deal with for the rest of my life. So there's that.",
      type: 'note',
    },
  ],
  envelopes: [
    { label: 'When you miss me', message: "Close your eyes. I'm right there. I always am. Think of our best memory together and smile. I'll be doing the same." },
    { label: 'When you are sad', message: "Hey. Whatever it is, it's going to pass. And I'll be here when it does. You're stronger than you know, and you're never alone." },
    { label: "When you can't sleep", message: "Count the reasons I love you instead of sheep. Actually, you'd never fall asleep then. Just know I'm probably thinking of you too." },
    { label: 'When you need a laugh', message: "Remember that time you tried to cook for me? Yeah. That's it. That's the joke. I love you anyway." },
    { label: 'When you feel alone', message: "You're not. You never are. I carry you with me everywhere I go. And I mean that in the least creepy way possible." },
  ],
  traits: [
    'The way you pretend you\'re not clingy.',
    'Your fake anger.',
    'How you act tough but melt.',
    'The way you laugh at your own jokes.',
    'Your obsession with snacks at 2am.',
    'How you steal all the blankets.',
    'The way you say "I\'m fine" when you\'re clearly not.',
    'Your dramatic goodbyes that last 20 minutes.',
    'How you get jealous of fictional characters.',
    'The way you look at me when you think I\'m not watching.',
  ],
  endingText: 'I love you so much.',
  endingSubtext: 'More than words could ever say.',
  altEndingText: 'Still choosing you. Everyday.',
  altEndingSubtext: "Even when you're annoying.",
  useAltEnding: true,
  musicUrl: '',
  editPassword: '',
  passwordProtected: false,
}

const STORAGE_KEY = 'anniversary-site-data'

export function getSiteData(): SiteData {
  if (typeof window === 'undefined') return DEFAULT_DATA
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      console.log('Loaded from localStorage:', Object.keys(parsed))
      if (parsed.diaryVideo?.src) {
        console.log('✓ Video found in localStorage:', parsed.diaryVideo.src.substring(0, 50))
      } else {
        console.log('✗ No video in localStorage')
      }
      return { ...DEFAULT_DATA, ...parsed }
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }
  console.log('Using default data')
  return DEFAULT_DATA
}

export function saveSiteData(data: Partial<SiteData>): void {
  if (typeof window === 'undefined') return
  try {
    const current = getSiteData()
    const updated = { ...current, ...data }
    const jsonString = JSON.stringify(updated)
    const sizeInMB = (jsonString.length / 1024 / 1024).toFixed(2)
    console.log('Saving to localStorage:', Object.keys(data), `Total size: ${sizeInMB}MB`)
    
    // Check if size is too large (most browsers limit to 5-10MB)
    if (jsonString.length > 5 * 1024 * 1024) {
      alert(`Storage is getting full (${sizeInMB}MB). Please:\n1. Use smaller images (compress them)\n2. Use shorter videos (under 2MB)\n3. Or use "Generate Share Link" to save online instead`)
      return
    }
    
    localStorage.setItem(STORAGE_KEY, jsonString)
    
    // Verify it was saved
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      console.log(`✓ Data saved successfully (${sizeInMB}MB)`)
    } else {
      console.error('✗ Failed to save to localStorage')
    }
    
    window.dispatchEvent(new CustomEvent('site-data-updated'))
  } catch (error: any) {
    console.error('Error saving to localStorage:', error)
    if (error.name === 'QuotaExceededError') {
      alert('Storage is full! Please:\n1. Compress your images more\n2. Use a smaller video (under 2MB)\n3. Or click "Generate Share Link" to save online')
    } else {
      alert('Failed to save. Please try compressing your files more.')
    }
  }
}

export function resetSiteData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('site-data-updated'))
}

export function getDefaultData(): SiteData {
  return { ...DEFAULT_DATA }
}
