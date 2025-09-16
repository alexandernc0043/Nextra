import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const db = await getDb()
    const doc = await db.collection('intros').findOne({ slug: params.slug })
    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    // Remove internal fields
    const { _id, ...rest } = doc as any
    return NextResponse.json(rest, { status: 200 })
  } catch (e: any) {
    console.error('GET intro failed', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }
    const body = await req.json()
    const payload = sanitizeIntro(body)
    payload.slug = params.slug
    const db = await getDb()
    await db.collection('intros').updateOne(
      { slug: params.slug },
      {
        $set: { ...payload, slug: params.slug, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    )
    return NextResponse.json({ ok: true, slug: params.slug }, { status: 200 })
  } catch (e: any) {
    console.error('PUT intro failed', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function sanitizeIntro(input: any) {
  // Minimal schema enforcement — trust only expected fields
  const out: any = {}
  const str = (v: any) => (typeof v === 'string' ? v : '')
  out.firstName = str(input.firstName)
  out.preferredName = str(input.preferredName)
  out.middleInitial = str(input.middleInitial)
  out.lastName = str(input.lastName)
  out.divider = str(input.divider || '~')
  out.mascot = str(input.mascot)
  out.image = str(input.image)
  out.imageCaption = str(input.imageCaption)
  out.personalStatement = str(input.personalStatement)
  out.personalBackground = str(input.personalBackground)
  out.professionalBackground = str(input.professionalBackground)
  out.academicBackground = str(input.academicBackground)
  out.primaryComputer = str(input.primaryComputer)
  out.quote = str(input.quote)
  out.quoteAuthor = str(input.quoteAuthor)
  out.links = typeof input.links === 'object' && input.links !== null ? {
    cltWeb: str(input.links.cltWeb),
    github: str(input.links.github),
    githubIo: str(input.links.githubIo),
    courseIo: str(input.links.courseIo),
    freeCodeCamp: str(input.links.freeCodeCamp),
    codecademy: str(input.links.codecademy),
    linkedIn: str(input.links.linkedIn),
  } : {}
  out.courses = Array.isArray(input.courses) ? input.courses.map((c: any) => ({
    dept: str(c?.dept),
    number: str(c?.number),
    name: str(c?.name),
    reason: str(c?.reason),
  })) : []
  return out
}

