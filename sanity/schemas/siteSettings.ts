import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      description: 'Logo displayed in header and footer',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        },
      ],
    }),
    defineField({
      name: 'footerDescription',
      title: 'Footer Description',
      type: 'text',
      rows: 3,
      description: 'Company description shown in footer'
    }),
    defineField({
      name: 'businessHours',
      title: 'Business Hours',
      type: 'string',
      description: 'e.g., Mon-Sat, 10AM - 8PM'
    }),
    defineField({
      name: 'quickLinks',
      title: 'Footer Quick Links',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', type: 'string', title: 'Link Title' },
          { name: 'url', type: 'string', title: 'URL' }
        ]
      }],
      validation: Rule => Rule.max(6)
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        { name: 'facebook', type: 'url', title: 'Facebook URL' },
        { name: 'instagram', type: 'url', title: 'Instagram URL' },
        { name: 'twitter', type: 'url', title: 'Twitter URL' }
      ]
    }),
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar',
      type: 'object',
      description: 'Top banner message (closable by users)',
      fields: [
        { 
          name: 'enabled', 
          type: 'boolean', 
          title: 'Show Announcement Bar',
          initialValue: true 
        },
        { 
          name: 'message', 
          type: 'string', 
          title: 'Announcement Message',
          description: 'e.g., "Free shipping on orders over $200"'
        },
        {
          name: 'backgroundColor',
          type: 'string',
          title: 'Background Color',
          description: 'CSS gradient or color (e.g., "linear-gradient(to right, #3b82f6, #1e40af)")',
          initialValue: 'linear-gradient(to right, #3b82f6, #1e40af)'
        },
        {
          name: 'textColor',
          type: 'string',
          title: 'Text Color',
          description: 'CSS color value',
          initialValue: '#ffffff'
        }
      ]
    })
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    }
  }
})
