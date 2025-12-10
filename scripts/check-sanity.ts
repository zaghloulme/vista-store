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

async function check() {
  console.log('🔍 Checking Sanity documents...\n')

  // Check all documents
  const allDocs = await client.fetch(`*[_type in ["homepage", "siteSettings", "product", "category"]]{ _id, _type, _createdAt }`)
  console.log('📄 All Documents:', JSON.stringify(allDocs, null, 2))

  // Check homepage
  const homepage = await client.fetch(`*[_type == "homepage"][0]`)
  console.log('\n🏠 Homepage:', homepage ? 'EXISTS' : 'NOT FOUND')
  if (homepage) console.log(JSON.stringify(homepage, null, 2))

  // Check siteSettings
  const siteSettings = await client.fetch(`*[_type == "siteSettings"][0]`)
  console.log('\n⚙️  Site Settings:', siteSettings ? 'EXISTS' : 'NOT FOUND')
  if (siteSettings) console.log(JSON.stringify(siteSettings, null, 2))

  // Check products
  const products = await client.fetch(`*[_type == "product"]`)
  console.log(`\n📦 Products: ${products.length} found`)

  // Check categories
  const categories = await client.fetch(`*[_type == "category"]`)
  console.log(`\n🏷️  Categories: ${categories.length} found`)
}

check().catch(console.error)
