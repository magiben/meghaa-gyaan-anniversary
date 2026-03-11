import { NextRequest, NextResponse } from 'next/server'

// Configure route
export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

// IMPORTANT: This tells Next.js to NOT parse the body automatically
export const config = {
  api: {
    bodyParser: false,
  },
}

// Simple in-memory store
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
    // Read the raw body text (no size limit)
    const bodyText = await request.text()
    
    if (!bodyText || bodyText.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data provided' },
        { status: 400 }
      )
    }
    
    // Parse JSON manually
    let data
    try {
      data = JSON.parse(bodyText)
    } catch (e) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON data' },
        { status: 400 }
      )
    }
    
    // Check data size
    const dataSize = bodyText.length
    console.log(`✓ Received data size: ${(dataSize / 1024 / 1024).toFixed(2)}MB`)
    
    if (dataSize > 15 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: `Data too large (${(dataSize / 1024 / 1024).toFixed(2)}MB). Maximum 15MB allowed.` },
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
    
    // Store data in memory
    dataStore.set(shortId, data)
    
    console.log(`✓ Saved data with ID: ${shortId}, Size: ${(dataSize / 1024 / 1024).toFixed(2)}MB`)
    
    return NextResponse.json({ success: true, id: shortId })
  } catch (error: any) {
    console.error('❌ Save error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save data' },
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
      console.log(`❌ Data not found for ID: ${id}`)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    console.log(`✓ Retrieved data for ID: ${id}`)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Load error:', error)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
