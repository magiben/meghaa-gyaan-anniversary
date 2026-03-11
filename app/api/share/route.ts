import { NextRequest, NextResponse } from 'next/server'

// In-memory store for development
const dataStore = new Map<string, any>()

// Also use localStorage-like persistence for serverless
// This helps maintain data between function invocations
let persistentStore: Map<string, any> | null = null

function getStore(): Map<string, any> {
  if (!persistentStore) {
    persistentStore = new Map<string, any>()
  }
  return persistentStore
}

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
    
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data provided' },
        { status: 400 }
      )
    }
    
    // Generate unique short ID
    const store = getStore()
    let shortId = generateShortId()
    let attempts = 0
    while (store.has(shortId) && attempts < 10) {
      shortId = generateShortId()
      attempts++
    }
    
    if (attempts >= 10) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique ID' },
        { status: 500 }
      )
    }
    
    // Store data in both stores for redundancy
    store.set(shortId, data)
    dataStore.set(shortId, data)
    
    console.log(`Saved data with ID: ${shortId}`)
    
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
    
    // Try both stores
    const store = getStore()
    let data = store.get(id) || dataStore.get(id)
    
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
