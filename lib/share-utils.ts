import { SiteData } from './store'

// Save data to server and get short ID with retry logic
export async function saveAndGetShortLink(data: SiteData): Promise<string | null> {
  const maxRetries = 3
  let lastError: any = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.id) {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        return `${baseUrl}?id=${result.id}`
      }
      
      throw new Error('Invalid response from server')
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error)
      lastError = error
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }
  }
  
  console.error('All retry attempts failed:', lastError)
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
