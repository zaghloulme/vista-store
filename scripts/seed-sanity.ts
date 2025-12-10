import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function seed() {
  console.log('🌱 Seeding Sanity...')

  // Find existing homepage document
  const existingHomepage = await client.fetch(`*[_type == "homepage"][0]{ _id }`)

  if (existingHomepage) {
    console.log(`📝 Found existing homepage: ${existingHomepage._id}`)

    // Patch the existing homepage to add new fields
    await client
      .patch(existingHomepage._id)
      .set({
        highlightedSection: {
          title: 'Featured Products',
          description: 'Discover premium laptops and accessories handpicked for you'
        },
        categoriesSection: {
          title: 'Browse by Category',
          description: 'Find exactly what you need in our organized categories'
        },
        moreProductsSection: {
          title: 'Explore More',
          description: 'Continue discovering our extensive tech collection'
        },
        whyBuyFromUs: [
          {
            title: 'Quality Products',
            description: 'Authentic tech products from trusted brands',
            icon: '✓'
          },
          {
            title: 'Expert Support',
            description: 'Professional advice and after-sales service',
            icon: '★'
          }
        ]
      })
      .commit()

    console.log('✅ Updated homepage document with new sections')
  } else {
    // Create new homepage if none exists
    await client.createOrReplace({
      _type: 'homepage',
      _id: 'homepage',
      heroTitle: 'Vista Store',
      heroSubtitle: 'Leading tech retailer in Alexandria',
      highlightedSection: {
        title: 'Featured Products',
        description: 'Discover premium laptops and accessories handpicked for you'
      },
      categoriesSection: {
        title: 'Browse by Category',
        description: 'Find exactly what you need in our organized categories'
      },
      moreProductsSection: {
        title: 'Explore More',
        description: 'Continue discovering our extensive tech collection'
      },
      whyBuyFromUs: [],
      storeLocation: 'Alexandria, Egypt',
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
    })
    console.log('✅ Created new homepage document')
  }

  // Update or create siteSettings
  const existingSettings = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`)

  if (existingSettings) {
    console.log(`📝 Found existing siteSettings: ${existingSettings._id}`)
    // Settings already exist, keep them as is
    console.log('✅ SiteSettings already exist')
  } else {
    await client.createOrReplace({
      _type: 'siteSettings',
      _id: 'siteSettings',
      footerDescription: 'Leading tech and laptop retailer in Alexandria serving the community with quality products and excellent service.',
      businessHours: 'Mon-Sat: 10AM - 8PM',
      quickLinks: [
        { title: 'Home', url: '/' },
        { title: 'Products', url: '/products' },
        { title: 'Laptops', url: '/products?category=laptops' },
        { title: 'Accessories', url: '/products?category=accessories' },
      ],
    })
    console.log('✅ Created siteSettings document')
  }

  console.log('✅ Seeding complete!')
}

seed().catch(console.error)
