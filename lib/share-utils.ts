import { SiteData } from './store'

// Upload data directly to Vercel Blob from client
export async function saveAndGetShortLink(data: SiteData): Promise<string | null> {
  try {
    const dataSize = JSON.stringify(data).length
    const dataSizeMB = (dataSize / 1024 / 1024).toFixed(2)
    console.log(`Uploading ${dataSizeMB}MB directly to Vercel Blob...`)
    
    // Generate a random ID
    const id = Math.random().toString(36).substring(2, 10)
    
    // Upload directly to Vercel Blob via client upload endpoint
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    
    const response = await fetch(`/api/upload?filename=anniversary-${id}.json`, {
      method: 'POST',
      body: blob,
    })
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('✓ Uploaded to Blob:', result)
    
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
