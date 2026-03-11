import { SiteData } from './store'
import LZString from 'lz-string'

// Create short share link with compressed data
export async function saveAndGetShortLink(data: SiteData): Promise<string | null> {
  try {
    const dataSize = JSON.stringify(data).length
    const dataSizeMB = (dataSize / 1024 / 1024).toFixed(2)
    console.log(`Creating share link with ${dataSizeMB}MB of data...`)
    
    // Compress data using LZ-String (much better compression!)
    const jsonString = JSON.stringify(data)
    const compressed = LZString.compressToEncodedURIComponent(jsonString)
    
    console.log(`Original size: ${jsonString.length} chars`)
    console.log(`Compressed size: ${compressed.length} chars`)
    console.log(`Compression ratio: ${((1 - compressed.length / jsonString.length) * 100).toFixed(1)}%`)
    
    // Create share link with compressed data in URL hash
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareLink = `${baseUrl}#${compressed}`
    
    console.log(`✓ Share link created (${shareLink.length} total chars)`)
    
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
    // Decompress from URL hash
    const decompressed = LZString.decompressFromEncodedURIComponent(id)
    if (!decompressed) {
      throw new Error('Failed to decompress data')
    }
    const data = JSON.parse(decompressed)
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
