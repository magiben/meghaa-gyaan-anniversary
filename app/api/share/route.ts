import { NextRequest, NextResponse } from 'next/server'

// Configure route to accept large payloads (50MB)
export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

// Body size configuration for App Router
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

// Simple in-memory store as fallback
const dataStore = new Map<string, any>()

// Generate a short random ID
function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// POST: Save data and return short ID
export async function POST(request: NextRequest) {
  try {
    // Check content length
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Data too large. Maximum 50MB allowed.' },
        { status: 413 }
      )
    }
    
    const data = await request.json()
    
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data provided' },
        { status: 400 }
      )
    }
    
    // Check actual data size
    const dataSize = JSON.stringify(data).length
    console.log(`Received data size: ${(dataSize / 1024 / 1024).toFixed(2)}MB`)
    
    if (dataSize > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: `Data too large (${(dataSize / 1024 / 1024).toFixed(2)}MB). Maximum 50MB allowed.` },
        { status: 413 }
      )
    }
    
    // Generate unique short ID
    let shortId = generateShortId()
    let attempts = 0
    while (dataStore.has(shortId) && attempts < 10) {
      shortId = generateShortId()
      attempts++
    }
    
    if (attempts >= 10) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique ID' },
        { status: 500 }
      )
    }
    
    // Store data in memory (works immediately, no Blob setup needed)
    dataStore.set(shortId, data)
    
    console.log(`✓ Saved data with ID: ${shortId}, Size: ${(dataSize / 1024 / 1024).toFixed(2)}MB`)
    
    return NextResponse.json({ success: true, id: shortId })
  } catch (error: any) {
    console.error('Save error:', error)
    
    // Check if it's a payload too large error
    if (error.message?.includes('body') || error.message?.includes('size')) {
      return NextResponse.json(
        { success: false, error: 'Data too large. Try compressing images more or using fewer media files.' },
        { status: 413 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save' },
      { status: 500 }
    )
  }
}

// GET: Retrieve data by short ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    
    const data = dataStore.get(id)
    
    if (!data) {
      console.log(`Data not found for ID: ${id}`)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    console.log(`Retrieved data for ID: ${id}`)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Load error:', error)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
