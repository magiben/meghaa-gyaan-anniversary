import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Generate a presigned upload URL
export async function GET() {
  try {
    const id = Math.random().toString(36).substring(2, 10)
    const filename = `anniversary-${id}.json`
    
    // Return the ID and let client upload directly to Blob
    return NextResponse.json({ 
      success: true, 
      id,
      filename 
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
