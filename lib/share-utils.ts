import { SiteData } from './store'

// Save data to server and get short ID
export async function saveAndGetShortLink(data: SiteData): Promise<string | null> {
  try {
    const response = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      return null
    }
    
    const result = await response.json()
    
    if (result.success && result.id) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      return `${baseUrl}?id=${result.id}`
    }
    
    return null
  } catch (error) {
    console.error('Failed to save and get short link:', error)
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
