import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'brandsCarousel',
  title: 'Brands Carousel',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Brand Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'logo',
      title: 'Brand Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which brands appear in the carousel (lower numbers first)',
      initialValue: 0
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Show this brand in the carousel',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      order: 'order'
    },
    prepare({ title, media, order }) {
      return {
        title: title,
        subtitle: `Order: ${order}`,
        media: media
      }
    }
  }
})
