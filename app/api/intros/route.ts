import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim()
    const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10) || 25, 100)
    const db = await getDb()
    const col = db.collection('intros')

    const filter: any = {}
    if (q) {
      const rx = new RegExp(escapeRegExp(q), 'i')
      filter.$or = [
        { slug: rx },
        { firstName: rx },
        { lastName: rx },
        { preferredName: rx },
      ]
    }

    const cursor = col.find(filter, {
      projection: { _id: 0 },
      sort: { updatedAt: -1, createdAt: -1 },
      limit,
    })
    const items = await cursor.toArray()
    return NextResponse.json({ items })
  } catch (e) {
    console.error('List intros failed', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

