import { SiteData } from './store'

// Simple solution: Store in URL hash (no server needed!)
export async function saveAndGetShortLink(data: SiteData): Promise<string | null> {
  try {
    const dataSize = JSON.stringify(data).length
    const dataSizeMB = (dataSize / 1024 / 1024).toFixed(2)
    console.log(`Creating share link with ${dataSizeMB}MB of data...`)
    
    // Compress and encode data
    const jsonString = JSON.stringify(data)
    const compressed = btoa(encodeURIComponent(jsonString))
    
    // Create share link with data in URL hash
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareLink = `${baseUrl}#${compressed}`
    
    console.log(`✓ Share link created (${shareLink.length} chars)`)
    
    return shareLink
  } catch (error: any) {
    console.error('Failed to create link:', error)
    alert(`Failed to create link: ${error.message}`)
    return null
  }
}

// Load data from URL hash
export async function loadDataFromShortId(id: string): Promise<SiteData | null> {
  try {
    // Decode from URL hash
    const decoded = decodeURIComponent(atob(id))
    const data = JSON.parse(decoded)
    return data
  } catch (error) {
    console.error('Failed to load data:', error)
    return null
  }
}

// Load data from URL parameter or hash
export function loadDataFromURL(): { data: SiteData | null; id: string | null } {
  if (typeof window === 'undefined') return { data: null, id: null }
  
  // Check URL hash first
  const hash = window.location.hash.substring(1)
  if (hash) {
    return { data: null, id: hash }
  }
  
  // Check URL parameter
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  
  return { data: null, id }
}
