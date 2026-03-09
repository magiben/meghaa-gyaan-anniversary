import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const DATA_DIR = join(process.cwd(), 'public', 'data')
const DATA_FILE = join(DATA_DIR, 'site-data.json')

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Ensure directory exists
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true })
    }
    
    // Write data to file
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Save error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    if (!existsSync(DATA_FILE)) {
      return NextResponse.json(null)
    }
    
    const data = await readFile(DATA_FILE, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json(null)
  }
}
