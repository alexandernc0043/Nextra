import {NextResponse} from 'next/server'
import {getAuthContext} from '../../../../lib/auth'
import {getDb} from '../../../../lib/mongodb'

type RouteContext = {
  params: Promise<{ slug: string }>
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { slug } = await context.params
    const db = await getDb()
    const doc = await db.collection('intros').findOne({ slug })
    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    // Remove internal fields
    const { _id, updatedBy, lastModeratedBy, ...rest } = doc as any
    return NextResponse.json(rest, { status: 200 })
  } catch (e: any) {
    console.error('GET intro failed', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const { slug } = await context.params
    const { userId, canModerateIntros, isAdmin } = await getAuthContext()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }
    const body = await req.json()
    const payload = sanitizeIntro(body)
    payload.slug = slug
    payload.updatedBy = userId
    if (isAdmin) {
      payload.lastModeratedBy = userId
    }
    const db = await getDb()
    const existing = await db.collection('intros').findOne(
      { slug },
      { projection: { createdBy: 1 } }
    )
    if (existing && existing.createdBy && existing.createdBy !== userId && !canModerateIntros) {
      return NextResponse.json({ error: 'Slug already claimed' }, { status: 403 })
    }
    await db.collection('intros').updateOne(
      { slug },
      {
        $set: { ...payload, slug, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date(), createdBy: userId },
      },
      { upsert: true }
    )
    return NextResponse.json({ ok: true, slug }, { status: 200 })
  } catch (e: any) {
    console.error('PUT intro failed', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const { slug } = await context.params
    const { userId, canModerateIntros } = await getAuthContext()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const db = await getDb()
    const doc = await db.collection('intros').findOne(
      { slug },
      { projection: { slug: 1, createdBy: 1 } }
    )
    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (!canModerateIntros && doc.createdBy !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const result = await db.collection('intros').deleteOne({ slug })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('DELETE intro failed', e)
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
  out.funnyThing = str(input.funnyThing)
  out.interestingThing = str(input.interestingThing)
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
