import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string'
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2
    }),
    defineField({
      name: 'heroImages',
      title: 'Hero Images (3 required)',
      type: 'object',
      fields: [
        {
          name: 'mainImage',
          title: 'Main Image (Large)',
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'link', type: 'url', title: 'Link URL (optional)' }
          ],
          validation: Rule => Rule.required()
        },
        {
          name: 'topImage',
          title: 'Top Right Image',
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'link', type: 'url', title: 'Link URL (optional)' }
          ],
          validation: Rule => Rule.required()
        },
        {
          name: 'bottomImage',
          title: 'Bottom Right Image',
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'link', type: 'url', title: 'Link URL (optional)' }
          ],
          validation: Rule => Rule.required()
        }
      ]
    }),
    defineField({
      name: 'featuredCategories',
      title: 'Featured Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      validation: Rule => Rule.max(6)
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Format: +201XXXXXXXXX'
    }),
    defineField({
      name: 'storeLocation',
      title: 'Store Location',
      type: 'string',
      initialValue: 'Alexandria, Egypt'
    })
  ],
  preview: {
    prepare() {
      return { title: 'Homepage Settings' }
    }
  }
})
