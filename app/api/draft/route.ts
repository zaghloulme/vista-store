import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const pathname = searchParams.get('sanity-preview-pathname') || '/'

    // Enable Draft Mode (skip secret check for development)
    // In production, you should validate the secret
    const draft = await draftMode()
    draft.enable()

    // Redirect to the path
    redirect(pathname)
}
