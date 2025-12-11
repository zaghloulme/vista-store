'use client'

/**
 * Visual Editing Component
 * Enables Sanity's visual editing features in the browser
 */

import { enableVisualEditing } from '@sanity/visual-editing'
import { useEffect } from 'react'

export function VisualEditing() {
    useEffect(() => {
        // Only enable when in Sanity Presentation mode
        const isPresentation =
            window.location.search.includes('sanity-preview') ||
            window.location.search.includes('perspective=previewDrafts')

        if (isPresentation) {
            const disable = enableVisualEditing()
            return () => disable()
        }
    }, [])

    return null
}
