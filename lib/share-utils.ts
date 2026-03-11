import { SiteData } from './store'

// Create short share link by storing data on server
export async function saveAndGetShortLink(data: SiteData): Promise<string | null> {
  try {
    const dataSize = JSON.stringify(data).length
    const dataSizeMB = (dataSize / 1024 / 1024).toFixed(2)
    console.log(`Uploading ${dataSizeMB}MB to server...`)
    
    // Upload to our API endpoint
    const response = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (!result.success || !result.id) {
      throw new Error('Invalid response from server')
    }
    
    // Create short link
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareLink = `${baseUrl}?id=${result.id}`
    
    console.log(`✓ Share link created: ${shareLink}`)
    
    return shareLink
  } catch (error: any) {
    console.error('Failed to create link:', error)
    alert(`Failed to create link: ${error.message}`)
    return null
  }
}

// Load data from server using short ID
export async function loadDataFromShortId(id: string): Promise<SiteData | null> {
  try {
    const response = await fetch(`/api/store?id=${id}`)
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to load data:', error)
    return null
  }
}

// Load data from URL parameter
export function loadDataFromURL(): { data: SiteData | null; id: string | null } {
  if (typeof window === 'undefined') return { data: null, id: null }
  
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  
  return { data: null, id }
}
