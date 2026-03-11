import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'edge'

// Client upload endpoint - uploads directly to Blob
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 })
    }
    
    // Get the blob from request body
    const blob = await request.blob()
    
    console.log(`Uploading ${filename} (${(blob.size / 1024 / 1024).toFixed(2)}MB) to Vercel Blob...`)
    
    // Upload to Vercel Blob
    const result = await put(filename, blob, {
      access: 'public',
      contentType: 'application/json',
    })
    
    console.log(`✓ Uploaded to Blob: ${result.url}`)
    
    return NextResponse.json({ 
      success: true, 
      url: result.url,
      size: blob.size 
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
