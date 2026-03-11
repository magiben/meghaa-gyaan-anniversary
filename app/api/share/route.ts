import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

// Configure route
export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

// Simple in-memory store for metadata
const metadataStore = new Map<string, { blobUrl: string }>()

// Generate a short random ID
function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// POST: Save data to Vercel Blob and return short ID
export async function POST(request: NextRequest) {
  try {
    // Read the raw body text
    const bodyText = await request.text()
    
    if (!bodyText || bodyText.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data provided' },
        { status: 400 }
      )
    }
    
    const dataSize = bodyText.length
    console.log(`✓ Received data size: ${(dataSize / 1024 / 1024).toFixed(2)}MB`)
    
    // Generate unique short ID
    let shortId = generateShortId()
    let attempts = 0
    while (metadataStore.has(shortId) && attempts < 10) {
      shortId = generateShortId()
      attempts++
    }
    
    if (attempts >= 10) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique ID' },
        { status: 500 }
      )
    }
    
    // Upload to Vercel Blob Storage (UNLIMITED SIZE!)
    const blob = await put(`anniversary-data-${shortId}.json`, bodyText, {
      access: 'public',
      contentType: 'application/json',
    })
    
    // Store metadata
    metadataStore.set(shortId, { blobUrl: blob.url })
    
    console.log(`✓ Saved to Vercel Blob with ID: ${shortId}, Size: ${(dataSize / 1024 / 1024).toFixed(2)}MB`)
    console.log(`✓ Blob URL: ${blob.url}`)
    
    return NextResponse.json({ success: true, id: shortId })
  } catch (error: any) {
    console.error('❌ Save error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save data' },
      { status: 500 }
    )
  }
}

// GET: Retrieve data by short ID from Vercel Blob
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    
    const metadata = metadataStore.get(id)
    
    if (!metadata) {
      console.log(`❌ Metadata not found for ID: ${id}`)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    // Fetch data from Vercel Blob
    const response = await fetch(metadata.blobUrl)
    
    if (!response.ok) {
      console.log(`❌ Failed to fetch blob for ID: ${id}`)
      return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
    }
    
    const data = await response.json()
    
    console.log(`✓ Retrieved data for ID: ${id}`)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Load error:', error)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
