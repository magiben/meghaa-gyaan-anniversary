import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Use JSONbin.io as free storage backend
const JSONBIN_API_KEY = '$2a$10$VqE8rF5YhN9L.Kx0mZ8Ks.xN5Yx8Zx9Kx0mZ8Ks.xN5Yx8Zx9Kx0mZ'
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3/b'

// POST: Store data and return short ID
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data provided' },
        { status: 400 }
      )
    }
    
    const dataSize = JSON.stringify(data).length
    console.log(`Storing ${(dataSize / 1024 / 1024).toFixed(2)}MB...`)
    
    // Store in JSONbin.io
    const response = await fetch(JSONBIN_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY,
        'X-Bin-Private': 'false',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`JSONbin error: ${response.status}`)
    }
    
    const result = await response.json()
    const binId = result.metadata.id
    
    console.log(`✓ Stored with ID: ${binId}`)
    
    return NextResponse.json({ success: true, id: binId })
  } catch (error: any) {
    console.error('Store error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// GET: Retrieve data by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    
    // Fetch from JSONbin.io
    const response = await fetch(`${JSONBIN_BASE_URL}/${id}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
      },
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    const result = await response.json()
    
    console.log(`✓ Retrieved data for ID: ${id}`)
    
    return NextResponse.json(result.record)
  } catch (error) {
    console.error('Load error:', error)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
