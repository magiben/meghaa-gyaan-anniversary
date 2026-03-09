import { SiteData } from './store'

// Compress data for URL sharing
export function compressData(data: SiteData): string {
  try {
    const json = JSON.stringify(data)
    // Use base64 encoding for URL safety
    const base64 = btoa(encodeURIComponent(json))
    return base64
  } catch (error) {
    console.error('Failed to compress data:', error)
    return ''
  }
}

// Decompress data from URL
export function decompressData(compressed: string): SiteData | null {
  try {
    const json = decodeURIComponent(atob(compressed))
    return JSON.parse(json)
  } catch (error) {
    console.error('Failed to decompress data:', error)
    return null
  }
}

// Generate shareable link
export function generateShareLink(data: SiteData): string {
  const compressed = compressData(data)
  if (!compressed) return ''
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  return `${baseUrl}?data=${compressed}`
}

// Load data from URL parameter
export function loadDataFromURL(): SiteData | null {
  if (typeof window === 'undefined') return null
  
  const params = new URLSearchParams(window.location.search)
  const dataParam = params.get('data')
  
  if (!dataParam) return null
  
  return decompressData(dataParam)
}
