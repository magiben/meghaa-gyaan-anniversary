'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type SiteData, getSiteData, saveSiteData } from '@/lib/store'
import { saveAndGetShortLink } from '@/lib/share-utils'

interface EditPanelProps {
  onDataChange: () => void
}

export function EditPanel({ onDataChange }: EditPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [data, setData] = useState<SiteData>(getSiteData())
  const [passwordInput, setPasswordInput] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [isViewingSharedLink, setIsViewingSharedLink] = useState(false)

  useEffect(() => {
    // Check if viewing a shared link
    const params = new URLSearchParams(window.location.search)
    const hasSharedId = params.has('id')
    setIsViewingSharedLink(hasSharedId)
    
    setData(getSiteData())
  }, [isOpen])

  const save = useCallback(
    (newData: Partial<SiteData>) => {
      const updated = { ...data, ...newData }
      setData(updated as SiteData)
      saveSiteData(updated)
      console.log('Data saved:', Object.keys(newData))
      // Force immediate update
      onDataChange()
      // Also trigger a custom event for immediate refresh
      window.dispatchEvent(new CustomEvent('site-data-updated'))
    },
    [data, onDataChange]
  )

  const handleGenerateShareLink = async () => {
    setIsGeneratingLink(true)
    setSaveMessage('')
    try {
      // Validate data before sending
      if (!data) {
        setSaveMessage('✗ No data to share. Please add some content first.')
        setIsGeneratingLink(false)
        return
      }
      
      setSaveMessage('⏳ Uploading your media to server...')
      
      const shareLink = await saveAndGetShortLink(data)
      if (shareLink) {
        await navigator.clipboard.writeText(shareLink)
        setSaveMessage('✓ Saved online! Link copied. All your media is now stored on the server with unlimited space.')
        setTimeout(() => setSaveMessage(''), 8000)
      } else {
        setSaveMessage('✗ Failed to save online. Please check your internet connection and try again.')
      }
    } catch (error: any) {
      console.error('Share link error:', error)
      setSaveMessage('✗ Failed to save online. Check your internet connection.')
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const handleOpen = () => {
    if (data.passwordProtected && data.editPassword && !isAuthenticated) {
      const input = prompt('Enter edit password:')
      if (input === data.editPassword) {
        setIsAuthenticated(true)
        setIsOpen(true)
      }
      return
    }
    setIsOpen(true)
  }

  const handleFileUpload = (callback: (url: string) => void, fileType?: 'image' | 'video' | 'audio') => {
    const input = document.createElement('input')
    input.type = 'file'
    
    // Set specific accept based on file type
    if (fileType === 'video') {
      input.accept = 'video/mp4,video/webm,video/ogg'
    } else if (fileType === 'image') {
      input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp'
    } else if (fileType === 'audio') {
      input.accept = 'audio/mpeg,audio/mp3,audio/wav,audio/ogg'
    } else {
      input.accept = 'image/*,video/*,audio/*'
    }
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Validate video format
        if (fileType === 'video') {
          const validFormats = ['video/mp4', 'video/webm', 'video/ogg']
          if (!validFormats.includes(file.type)) {
            alert('Please use MP4, WebM, or OGG video format. MP4 is recommended for best compatibility.')
            return
          }
        }
        
        // Validate image format
        if (fileType === 'image') {
          const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
          if (!validFormats.some(format => file.type.includes(format.split('/')[1]))) {
            alert('Please use JPEG, PNG, GIF, or WebP image format.')
            return
          }
        }
        
        // Check file size (10MB = 10 * 1024 * 1024 bytes)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
          alert(`File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Please use a file smaller than 10MB.`)
          return
        }
        
        // For images, compress them
        if (fileType === 'image' && file.type.startsWith('image/')) {
          const img = new Image()
          const reader = new FileReader()
          
          reader.onload = (ev) => {
            img.onload = () => {
              // Create canvas to compress image
              const canvas = document.createElement('canvas')
              let width = img.width
              let height = img.height
              
              // Resize if too large
              const maxDimension = 1200
              if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                  height = (height / width) * maxDimension
                  width = maxDimension
                } else {
                  width = (width / height) * maxDimension
                  height = maxDimension
                }
              }
              
              canvas.width = width
              canvas.height = height
              
              const ctx = canvas.getContext('2d')
              ctx?.drawImage(img, 0, 0, width, height)
              
              // Compress to JPEG with quality 0.7
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7)
              callback(compressedDataUrl)
            }
            img.src = ev.target?.result as string
          }
          
          reader.onerror = () => {
            alert('Failed to read file. Please try a different file.')
          }
          
          reader.readAsDataURL(file)
          return
        }
        
        // For videos and other files, use normal upload
        const reader = new FileReader()
        reader.onload = (ev) => {
          const result = ev.target?.result as string
          if (result && result.startsWith('data:')) {
            callback(result)
          } else {
            alert('Failed to read file. Please try again.')
          }
        }
        reader.onerror = () => {
          alert('Failed to read file. Please try a different file.')
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'photos', label: 'Photos' },
    { id: 'diary', label: 'Diary' },
    { id: 'memories', label: 'Memories' },
    { id: 'poems', label: 'Poems' },
    { id: 'envelopes', label: 'Envelopes' },
    { id: 'traits', label: 'Traits' },
    { id: 'ending', label: 'Ending' },
    { id: 'settings', label: 'Settings' },
  ]

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #E8DCCF',
    backgroundColor: '#FFFFFF',
    color: '#4A3728',
    fontFamily: 'var(--font-inter)',
    fontSize: '0.875rem',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '4px',
    fontSize: '0.8rem',
    color: '#8B6F5C',
    fontFamily: 'var(--font-inter)',
  }

  const btnStyle: React.CSSProperties = {
    padding: '6px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#D8A7B1',
    color: '#FFFFFF',
    fontFamily: 'var(--font-inter)',
    fontSize: '0.8rem',
    cursor: 'pointer',
  }

  const dangerBtnStyle: React.CSSProperties = {
    ...btnStyle,
    backgroundColor: '#e8886f',
  }

  return (
    <>
      {/* Edit button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="fixed right-4 bottom-4 z-40 rounded-full px-5 py-3 shadow-lg"
        style={{
          backgroundColor: 'rgba(216, 167, 177, 0.9)',
          color: '#FFFFFF',
          fontFamily: 'var(--font-dancing)',
          fontSize: '1.05rem',
          backdropFilter: 'blur(10px)',
        }}
      >
        {'Edit Our Story ✨'}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 flex h-full w-full flex-col shadow-2xl md:w-96"
            style={{ backgroundColor: '#F8F4EC' }}
          >
            {/* Header */}
            <div
              className="border-b"
              style={{ borderColor: '#E8DCCF' }}
            >
              <div className="flex items-center justify-between px-5 py-4">
                <h3
                  className="text-lg"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#4A3728' }}
                >
                  Edit Our Story
                </h3>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    onDataChange()
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#E8DCCF', color: '#8B6F5C' }}
                >
                  &times;
                </button>
              </div>
              
              {/* Viewing Shared Link Notice */}
              {isViewingSharedLink && (
                <div
                  className="px-5 pb-3"
                  style={{ backgroundColor: '#FFF9F0' }}
                >
                  <p className="text-xs" style={{ color: '#8B6F5C' }}>
                    👀 You're viewing a shared link. To create your own version, visit the website without the ?id= parameter.
                  </p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div
              className="flex gap-1 overflow-x-auto border-b px-4 py-2"
              style={{ borderColor: '#E8DCCF' }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="shrink-0 rounded-full px-3 py-1.5 text-xs transition-all"
                  style={{
                    backgroundColor: activeTab === tab.id ? '#D8A7B1' : 'transparent',
                    color: activeTab === tab.id ? '#FFFFFF' : '#8B6F5C',
                    fontFamily: 'var(--font-inter)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col gap-4">
                {/* General Tab */}
                {activeTab === 'general' && (
                  <>
                    <div>
                      <label style={labelStyle}>Anniversary Number</label>
                      <input
                        type="number"
                        value={data.anniversaryNumber}
                        onChange={(e) => save({ anniversaryNumber: parseInt(e.target.value) || 1 })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>{'Heading (use {n} for number)'}</label>
                      <input
                        type="text"
                        value={data.anniversaryHeading}
                        onChange={(e) => save({ anniversaryHeading: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Countdown Texts (comma separated)</label>
                      <input
                        type="text"
                        value={data.countdownTexts.join(', ')}
                        onChange={(e) =>
                          save({ countdownTexts: e.target.value.split(',').map((s) => s.trim()) })
                        }
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Nicknames (comma separated)</label>
                      <input
                        type="text"
                        value={data.nicknames.join(', ')}
                        onChange={(e) =>
                          save({ nicknames: e.target.value.split(',').map((s) => s.trim()) })
                        }
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Background Music</label>
                      <button
                        onClick={() => handleFileUpload((url) => save({ musicUrl: url }))}
                        style={btnStyle}
                      >
                        Upload Audio
                      </button>
                      {data.musicUrl && (
                        <p className="mt-1 text-xs" style={{ color: '#8B6F5C' }}>
                          Audio uploaded
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Photos Tab */}
                {activeTab === 'photos' && (
                  <>
                    <p className="text-xs" style={{ color: '#8B6F5C' }}>Anniversary reveal photos (JPEG/PNG recommended)</p>
                    {data.photos.map((photo, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-2 rounded-lg border p-3"
                        style={{ borderColor: '#E8DCCF' }}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleFileUpload((url) => {
                                const photos = [...data.photos]
                                photos[i] = { ...photos[i], src: url }
                                save({ photos })
                              }, 'image')
                            }
                            style={btnStyle}
                          >
                            {photo.src ? 'Change' : 'Upload'}
                          </button>
                          {photo.src && (
                            <div
                              className="h-10 w-10 rounded"
                              style={{
                                backgroundImage: `url(${photo.src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: '#E8DCCF',
                              }}
                              title="Preview"
                            />
                          )}
                        </div>
                        <input
                          type="text"
                          value={photo.caption}
                          onChange={(e) => {
                            const photos = [...data.photos]
                            photos[i] = { ...photos[i], caption: e.target.value }
                            save({ photos })
                          }}
                          placeholder="Caption"
                          style={inputStyle}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        save({ photos: [...data.photos, { src: '', caption: 'New memory' }] })
                      }}
                      style={btnStyle}
                    >
                      + Add Photo
                    </button>
                  </>
                )}

                {/* Diary Tab */}
                {activeTab === 'diary' && (
                  <>
                    <div>
                      <label style={labelStyle}>Video (MP4 recommended)</label>
                      <button
                        onClick={() =>
                          handleFileUpload((url) => {
                            console.log('Video uploaded, saving...', url.substring(0, 50))
                            save({ diaryVideo: { ...data.diaryVideo, src: url } })
                          }, 'video')
                        }
                        style={btnStyle}
                      >
                        {data.diaryVideo.src ? 'Change Video' : 'Upload Video'}
                      </button>
                      {data.diaryVideo.src && (
                        <>
                          <p className="mt-1 text-xs" style={{ color: '#4A7C59' }}>
                            ✓ Video uploaded ({(data.diaryVideo.src.length / 1024).toFixed(0)}KB)
                          </p>
                          <video
                            src={data.diaryVideo.src}
                            controls
                            className="mt-2 w-full rounded"
                            style={{ maxHeight: '150px', backgroundColor: '#E8DCCF' }}
                          />
                        </>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Caption</label>
                      <input
                        type="text"
                        value={data.diaryVideo.caption}
                        onChange={(e) =>
                          save({ diaryVideo: { ...data.diaryVideo, caption: e.target.value } })
                        }
                        style={inputStyle}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={data.diaryVideo.autoplay}
                        onChange={(e) =>
                          save({ diaryVideo: { ...data.diaryVideo, autoplay: e.target.checked } })
                        }
                      />
                      <label style={{ ...labelStyle, margin: 0 }}>Autoplay video (muted)</label>
                    </div>
                  </>
                )}

                {/* Memories Tab */}
                {activeTab === 'memories' && (
                  <>
                    {data.memoryBook.map((mem, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-2 rounded-lg border p-3"
                        style={{ borderColor: '#E8DCCF' }}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleFileUpload((url) => {
                                const memoryBook = [...data.memoryBook]
                                memoryBook[i] = { ...memoryBook[i], src: url }
                                save({ memoryBook })
                              }, 'image')
                            }
                            style={btnStyle}
                          >
                            {mem.src ? 'Change' : 'Upload'}
                          </button>
                          <button
                            onClick={() => {
                              const memoryBook = data.memoryBook.filter((_, idx) => idx !== i)
                              save({ memoryBook })
                            }}
                            style={dangerBtnStyle}
                          >
                            Remove
                          </button>
                          {mem.src && (
                            <div
                              className="h-10 w-10 rounded"
                              style={{
                                backgroundImage: `url(${mem.src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: '#E8DCCF',
                              }}
                              title="Preview"
                            />
                          )}
                        </div>
                        <input
                          type="text"
                          value={mem.caption}
                          onChange={(e) => {
                            const memoryBook = [...data.memoryBook]
                            memoryBook[i] = { ...memoryBook[i], caption: e.target.value }
                            save({ memoryBook })
                          }}
                          placeholder="Caption"
                          style={inputStyle}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        save({
                          memoryBook: [...data.memoryBook, { src: '', caption: 'New memory' }],
                        })
                      }}
                      style={btnStyle}
                    >
                      + Add Memory
                    </button>
                  </>
                )}

                {/* Poems Tab */}
                {activeTab === 'poems' && (
                  <>
                    {data.poems.map((poem, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-2 rounded-lg border p-3"
                        style={{ borderColor: '#E8DCCF' }}
                      >
                        <input
                          type="text"
                          value={poem.title}
                          onChange={(e) => {
                            const poems = [...data.poems]
                            poems[i] = { ...poems[i], title: e.target.value }
                            save({ poems })
                          }}
                          placeholder="Title"
                          style={inputStyle}
                        />
                        <select
                          value={poem.type}
                          onChange={(e) => {
                            const poems = [...data.poems]
                            poems[i] = {
                              ...poems[i],
                              type: e.target.value as 'poem' | 'letter' | 'note',
                            }
                            save({ poems })
                          }}
                          style={inputStyle}
                        >
                          <option value="poem">Poem</option>
                          <option value="letter">Letter</option>
                          <option value="note">Note</option>
                        </select>
                        <textarea
                          value={poem.content}
                          onChange={(e) => {
                            const poems = [...data.poems]
                            poems[i] = { ...poems[i], content: e.target.value }
                            save({ poems })
                          }}
                          rows={4}
                          placeholder="Write your heart out..."
                          style={{ ...inputStyle, resize: 'vertical' as const }}
                        />
                        <button
                          onClick={() => {
                            const poems = data.poems.filter((_, idx) => idx !== i)
                            save({ poems })
                          }}
                          style={dangerBtnStyle}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        save({
                          poems: [
                            ...data.poems,
                            { title: 'New', content: '', type: 'poem' as const },
                          ],
                        })
                      }}
                      style={btnStyle}
                    >
                      + Add Poem/Letter/Note
                    </button>
                  </>
                )}

                {/* Envelopes Tab */}
                {activeTab === 'envelopes' && (
                  <>
                    {data.envelopes.map((env, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-2 rounded-lg border p-3"
                        style={{ borderColor: '#E8DCCF' }}
                      >
                        <input
                          type="text"
                          value={env.label}
                          onChange={(e) => {
                            const envelopes = [...data.envelopes]
                            envelopes[i] = { ...envelopes[i], label: e.target.value }
                            save({ envelopes })
                          }}
                          placeholder="Label (e.g., When you miss me)"
                          style={inputStyle}
                        />
                        <textarea
                          value={env.message}
                          onChange={(e) => {
                            const envelopes = [...data.envelopes]
                            envelopes[i] = { ...envelopes[i], message: e.target.value }
                            save({ envelopes })
                          }}
                          rows={3}
                          placeholder="Secret message..."
                          style={{ ...inputStyle, resize: 'vertical' as const }}
                        />
                        <button
                          onClick={() => {
                            const envelopes = data.envelopes.filter((_, idx) => idx !== i)
                            save({ envelopes })
                          }}
                          style={dangerBtnStyle}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        save({
                          envelopes: [...data.envelopes, { label: 'When...', message: '' }],
                        })
                      }}
                      style={btnStyle}
                    >
                      + Add Envelope
                    </button>
                  </>
                )}

                {/* Traits Tab */}
                {activeTab === 'traits' && (
                  <>
                    {data.traits.map((trait, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={trait}
                          onChange={(e) => {
                            const traits = [...data.traits]
                            traits[i] = e.target.value
                            save({ traits })
                          }}
                          style={inputStyle}
                        />
                        <button
                          onClick={() => {
                            const traits = data.traits.filter((_, idx) => idx !== i)
                            save({ traits })
                          }}
                          className="shrink-0"
                          style={dangerBtnStyle}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        save({ traits: [...data.traits, 'New thing I love about you'] })
                      }}
                      style={btnStyle}
                    >
                      + Add Trait
                    </button>
                  </>
                )}

                {/* Ending Tab */}
                {activeTab === 'ending' && (
                  <>
                    <div>
                      <label style={labelStyle}>Main ending text</label>
                      <input
                        type="text"
                        value={data.endingText}
                        onChange={(e) => save({ endingText: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Main subtext</label>
                      <input
                        type="text"
                        value={data.endingSubtext}
                        onChange={(e) => save({ endingSubtext: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Alt ending text</label>
                      <input
                        type="text"
                        value={data.altEndingText}
                        onChange={(e) => save({ altEndingText: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Alt subtext</label>
                      <input
                        type="text"
                        value={data.altEndingSubtext}
                        onChange={(e) => save({ altEndingSubtext: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={data.useAltEnding}
                        onChange={(e) => save({ useAltEnding: e.target.checked })}
                      />
                      <label style={{ ...labelStyle, margin: 0 }}>
                        Show both endings (alt first, then main)
                      </label>
                    </div>
                  </>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <>
                    <div
                      className="rounded-lg border p-4"
                      style={{ borderColor: '#E8DCCF', backgroundColor: '#FFF9F0' }}
                    >
                      <p style={{ ...labelStyle, marginBottom: '12px', fontSize: '0.9rem', color: '#4A3728' }}>
                        📤 Share with Your Partner
                      </p>
                      <button 
                        onClick={handleGenerateShareLink}
                        disabled={isGeneratingLink}
                        className="w-full"
                        style={{ 
                          ...btnStyle, 
                          backgroundColor: isGeneratingLink ? '#E8DCCF' : '#4A7C59', 
                          padding: '12px 14px', 
                          fontSize: '0.9rem',
                          cursor: isGeneratingLink ? 'not-allowed' : 'pointer',
                          opacity: isGeneratingLink ? 0.6 : 1,
                        }}
                      >
                        {isGeneratingLink ? '⏳ Generating...' : '🔗 Generate Share Link'}
                      </button>
                      <p className="mt-3 text-xs leading-relaxed" style={{ color: '#8B6F5C' }}>
                        Click the button above to create a special link. Send this link to your partner and they'll see all your photos, videos, and messages!
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <input
                        type="checkbox"
                        checked={data.passwordProtected}
                        onChange={(e) => save({ passwordProtected: e.target.checked })}
                      />
                      <label style={{ ...labelStyle, margin: 0 }}>
                        Password protect edit mode
                      </label>
                    </div>
                    {data.passwordProtected && (
                      <div>
                        <label style={labelStyle}>Edit password</label>
                        <input
                          type="text"
                          value={data.editPassword}
                          onChange={(e) => save({ editPassword: e.target.value })}
                          placeholder="Set a password"
                          style={inputStyle}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              className="border-t px-5 py-4"
              style={{ borderColor: '#E8DCCF', backgroundColor: '#FFF9F0' }}
            >
              {saveMessage && (
                <p
                  className="text-center text-sm mb-3"
                  style={{
                    color: saveMessage.startsWith('✓') ? '#4A7C59' : '#e8886f',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: '500',
                  }}
                >
                  {saveMessage}
                </p>
              )}
              <p
                className="text-center text-xs leading-relaxed"
                style={{ color: '#8B6F5C' }}
              >
                Your changes save automatically. When you're done, go to Settings → Generate Share Link to create a link for your partner.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
