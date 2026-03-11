import { SiteData } from './store'
import { upload } from '@vercel/blob/client'

// Upload data directly to Vercel Blob from client using @vercel/blob/client
export async function saveAndGetShortLink(data: SiteData): Promise<string | null> {
  try {
    const dataSize = JSON.stringify(data).length
    const dataSizeMB = (dataSize / 1024 / 1024).toFixed(2)
    console.log(`Uploading ${dataSizeMB}MB directly to Vercel Blob...`)
    
    // Get upload URL
    const urlResponse = await fetch('/api/upload-url')
    const { id, filename } = await urlResponse.json()
    
    // Create blob from data
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    
    // Upload directly to Vercel Blob using client SDK
    const result = await upload(filename, blob, {
      access: 'public',
      handleUploadUrl: '/api/upload',
    })
    
    console.log('✓ Uploaded to Blob:', result.url)
    
    // Return the share link
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareLink = `${baseUrl}?id=${id}`
    console.log(`✓ Share link: ${shareLink}`)
    
    return shareLink
  } catch (error: any) {
    console.error('Upload failed:', error)
    alert(`Failed to upload: ${error.message}`)
    return null
  }
}

// Load data from server using short ID
export async function loadDataFromShortId(id: string): Promise<SiteData | null> {
  try {
    const response = await fetch(`/api/share?id=${id}`)
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to load data from short ID:', error)
    return null
  }
}

// Load data from URL parameter (check for short ID)
export function loadDataFromURL(): { data: SiteData | null; id: string | null } {
  if (typeof window === 'undefined') return { data: null, id: null }
  
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  
  return { data: null, id }
}
