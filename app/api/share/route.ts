import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory store for development
// In production, this will persist during the serverless function lifetime
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
    const data = await request.json()
    
    // Generate unique short ID
    let shortId = generateShortId()
    while (dataStore.has(shortId)) {
      shortId = generateShortId()
    }
    
    // Store data
    dataStore.set(shortId, data)
    
    return NextResponse.json({ success: true, id: shortId })
  } catch (error: any) {
    console.error('Save error:', error)
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
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
