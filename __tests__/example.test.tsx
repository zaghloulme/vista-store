/**
 * Example Unit Test
 * Tests for utility functions and components
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import HomePage from '../app/[locale]/page'

describe('Home Page', () => {
  it('renders the heading', () => {
    const { getByText } = render(<HomePage />)
    expect(getByText('Slate Template')).toBeInTheDocument()
  })

  it('displays features list', () => {
    const { getByText } = render(<HomePage />)
    expect(getByText(/Swappable CMS Architecture/i)).toBeInTheDocument()
    expect(getByText(/Full Internationalization/i)).toBeInTheDocument()
  })
})

describe('SEO Metadata Utils', () => {
  it('merges metadata objects correctly', async () => {
    const { mergeMetadata } = await import('../lib/seo/metadata')

    const base = {
      title: 'Base Title',
      description: 'Base Description',
    }

    const override = {
      title: 'Override Title',
    }

    const result = mergeMetadata(base, override)

    expect(result.title).toBe('Override Title')
    expect(result.description).toBe('Base Description')
  })
})
