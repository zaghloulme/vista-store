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
      title: 'Hero Images',
      type: 'object',
      fields: [
        {
          name: 'mainImages',
          title: 'Main Images (Carousel)',
          type: 'array',
          of: [{
            type: 'image',
            options: { hotspot: true },
            fields: [
              { name: 'alt', type: 'string', title: 'Alt Text' },
              { name: 'link', type: 'url', title: 'Link URL (optional)' }
            ]
          }],
          validation: Rule => Rule.required().min(1).max(10)
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
    }),
    defineField({
      name: 'highlightedSection',
      title: 'Highlighted Products Section',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Section Title' },
        { name: 'description', type: 'text', title: 'Section Description', rows: 2 }
      ]
    }),
    defineField({
      name: 'categoriesSection',
      title: 'Categories Section',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Section Title' },
        { name: 'description', type: 'text', title: 'Section Description', rows: 2 }
      ]
    }),
    defineField({
      name: 'moreProductsSection',
      title: 'More Products Section',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Section Title' },
        { name: 'description', type: 'text', title: 'Section Description', rows: 2 }
      ]
    }),
    defineField({
      name: 'benefitsBarTop',
      title: 'Benefits Bar (Top)',
      type: 'array',
      description: 'Scrolling benefits bar displayed after hero section',
      of: [{
        type: 'object',
        fields: [
          { name: 'icon', type: 'string', title: 'Icon/Emoji', description: 'Use an emoji (e.g. 💳, 🚚)' },
          { name: 'text', type: 'string', title: 'Benefit Text' }
        ],
        preview: {
          select: { icon: 'icon', text: 'text' },
          prepare({ icon, text }) {
            return { title: `${icon} ${text}` }
          }
        }
      }],
      validation: Rule => Rule.min(1).max(10)
    }),
    defineField({
      name: 'benefitsBarBottom',
      title: 'Benefits Bar (Bottom)',
      type: 'array',
      description: 'Scrolling benefits bar displayed after brand carousel',
      of: [{
        type: 'object',
        fields: [
          { name: 'icon', type: 'string', title: 'Icon/Emoji', description: 'Use an emoji (e.g. ✅, ⚡)' },
          { name: 'text', type: 'string', title: 'Benefit Text' }
        ],
        preview: {
          select: { icon: 'icon', text: 'text' },
          prepare({ icon, text }) {
            return { title: `${icon} ${text}` }
          }
        }
      }],
      validation: Rule => Rule.min(1).max(10)
    }),
    defineField({
      name: 'productDisplaySettings',
      title: 'Product Display Settings',
      type: 'object',
      fields: [
        { 
          name: 'featuredProductsLimit', 
          type: 'number', 
          title: 'Featured Products Limit',
          description: 'Number of featured products to show',
          initialValue: 8,
          validation: Rule => Rule.min(1).max(20)
        },
        { 
          name: 'moreProductsLimit', 
          type: 'number', 
          title: 'More Products Limit',
          description: 'Number of additional products to show',
          initialValue: 8,
          validation: Rule => Rule.min(1).max(20)
        }
      ]
    }),
    defineField({
      name: 'whyBuyFromUs',
      title: 'Why Buy From Us',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', type: 'string', title: 'Title' },
          { name: 'description', type: 'text', title: 'Description', rows: 3 },
          { name: 'icon', type: 'string', title: 'Icon/Emoji', description: 'Use an emoji or icon name' }
        ]
      }],
      validation: Rule => Rule.max(3).min(0)
    })
  ],
  preview: {
    prepare() {
      return { title: 'Homepage Settings' }
    }
  }
})
