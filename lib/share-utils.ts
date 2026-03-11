import { SiteData } from './store'

// Save data to server and get short ID with retry logic
export async function saveAndGetShortLink(data: SiteData): Promise<string | null> {
  const maxRetries = 3
  let lastError: any = null
  
  // NO SIZE CHECK - just upload it
  const dataSize = JSON.stringify(data).length
  const dataSizeMB = (dataSize / 1024 / 1024).toFixed(2)
  console.log(`Uploading ${dataSizeMB}MB of data to Vercel Blob...`)
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}: Uploading to /api/share...`)
      
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      console.log(`Response status: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Server error: ${response.status} - ${errorText}`)
        throw new Error(`Server error: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Server response:', result)
      
      if (result.success && result.id) {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        const shareLink = `${baseUrl}?id=${result.id}`
        console.log(`✓ Success! Generated share link: ${shareLink}`)
        return shareLink
      }
      
      throw new Error(result.error || 'Invalid response from server')
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error)
      lastError = error
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = 1000 * attempt
        console.log(`Waiting ${waitTime}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }
  
  console.error('All retry attempts failed:', lastError)
  alert(`Failed to save after ${maxRetries} attempts.\n\nError: ${lastError?.message || 'Unknown error'}\n\nPlease check:\n1. Your internet connection\n2. Browser console (F12) for details`)
  return null
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
