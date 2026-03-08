'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type SiteData, getSiteData, saveSiteData } from '@/lib/store'

interface EditPanelProps {
  onDataChange: () => void
}

export function EditPanel({ onDataChange }: EditPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [data, setData] = useState<SiteData>(getSiteData())
  const [passwordInput, setPasswordInput] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setData(getSiteData())
  }, [isOpen])

  const save = useCallback(
    (newData: Partial<SiteData>) => {
      const updated = { ...data, ...newData }
      setData(updated as SiteData)
      saveSiteData(updated)
      onDataChange()
    },
    [data, onDataChange]
  )

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

  const handleFileUpload = (callback: (url: string) => void) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,video/*,audio/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          callback(ev.target?.result as string)
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
              className="flex items-center justify-between border-b px-5 py-4"
              style={{ borderColor: '#E8DCCF' }}
            >
              <h3
                className="text-lg"
                style={{ fontFamily: 'var(--font-playfair)', color: '#4A3728' }}
              >
                Edit Our Story
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: '#E8DCCF', color: '#8B6F5C' }}
              >
                &times;
              </button>
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
                    <p className="text-xs" style={{ color: '#8B6F5C' }}>Anniversary reveal photos</p>
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
                              })
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
                              }}
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
                      <label style={labelStyle}>Video</label>
                      <button
                        onClick={() =>
                          handleFileUpload((url) =>
                            save({ diaryVideo: { ...data.diaryVideo, src: url } })
                          )
                        }
                        style={btnStyle}
                      >
                        {data.diaryVideo.src ? 'Change Video' : 'Upload Video'}
                      </button>
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
                      <label style={{ ...labelStyle, margin: 0 }}>Autoplay video</label>
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
                              })
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
                    <div className="flex items-center gap-2">
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
              className="border-t px-5 py-3 text-center text-xs"
              style={{ borderColor: '#E8DCCF', color: '#8B6F5C' }}
            >
              Changes save automatically
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
