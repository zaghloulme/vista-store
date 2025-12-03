import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Product SKU/Code'
    }),
    defineField({
      name: 'brand',
      title: 'Brand/Manufacturer',
      type: 'string',
      description: 'e.g., Dell, HP, Lenovo, Apple',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'price',
      title: 'Price (EGP)',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare at Price (EGP)',
      type: 'number',
      description: 'Original price for showing discounts'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }]
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief description for catalog view'
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          {
            name: 'alt',
            title: 'Alt Text',
            type: 'string'
          }
        ]
      }],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string', title: 'Label' },
          { name: 'value', type: 'string', title: 'Value' }
        ]
      }]
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
      description: 'Show on homepage'
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'SEO Title' },
        { name: 'description', type: 'text', title: 'Meta Description', rows: 3 },
        { name: 'keywords', type: 'array', of: [{ type: 'string' }], title: 'Keywords' }
      ]
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      subtitle: 'category.name',
      price: 'price',
      brand: 'brand'
    },
    prepare({ title, media, subtitle, price, brand }) {
      return {
        title,
        media,
        subtitle: `${brand} - ${subtitle} - ${price} EGP`
      }
    }
  }
})
