/**
 * On-Demand Revalidation API Route
 * Allows CMS webhooks to trigger revalidation
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  // Verify the secret token
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { path, tag, type } = body

    if (type === 'path' && path) {
      // Revalidate specific path
      revalidatePath(path)
      return NextResponse.json({
        revalidated: true,
        type: 'path',
        path,
        now: Date.now(),
      })
    }

    if (type === 'tag' && tag) {
      // Revalidate by cache tag
      revalidateTag(tag, 'cache')
      return NextResponse.json({
        revalidated: true,
        type: 'tag',
        tag,
        now: Date.now(),
      })
    }

    // If no specific type, revalidate common paths
    revalidatePath('/')
    revalidatePath('/[locale]', 'page')

    return NextResponse.json({
      revalidated: true,
      type: 'default',
      now: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    )
  }
}
