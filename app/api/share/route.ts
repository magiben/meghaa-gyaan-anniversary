import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// GET: Retrieve data by short ID from Vercel Blob
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    
    // Construct the Blob URL
    const blobUrl = `https://${process.env.BLOB_READ_WRITE_TOKEN?.split('_')[2]}.public.blob.vercel-storage.com/anniversary-${id}.json`
    
    console.log(`Fetching from Blob: ${blobUrl}`)
    
    // Fetch data from Vercel Blob
    const response = await fetch(blobUrl)
    
    if (!response.ok) {
      console.log(`❌ Failed to fetch blob for ID: ${id}`)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    const data = await response.json()
    
    console.log(`✓ Retrieved data for ID: ${id}`)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Load error:', error)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
