import { NextRequest, NextResponse } from 'next/server'
import { put, head } from '@vercel/blob'

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
    let shortId = generateShortId()
    let attempts = 0
    
    // Check if ID already exists
    while (attempts < 10) {
      try {
        await head(`anniversary-${shortId}.json`)
        // ID exists, generate new one
        shortId = generateShortId()
        attempts++
      } catch {
        // ID doesn't exist, we can use it
        break
      }
    }
    
    if (attempts >= 10) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique ID' },
        { status: 500 }
      )
    }
    
    // Store data in Vercel Blob
    const blob = await put(`anniversary-${shortId}.json`, JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
    })
    
    console.log(`Saved data with ID: ${shortId}, URL: ${blob.url}`)
    
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
    
    // Fetch from Vercel Blob
    const response = await fetch(`${process.env.BLOB_READ_WRITE_TOKEN ? 'https://blob.vercel-storage.com' : ''}/anniversary-${id}.json`)
    
    if (!response.ok) {
      console.log(`Data not found for ID: ${id}`)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    const data = await response.json()
    console.log(`Retrieved data for ID: ${id}`)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Load error:', error)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
