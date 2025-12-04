/**
 * Seed Sanity with Sample Data
 * Run with: node scripts/seed-sanity.js
 */

import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function seedData() {
  console.log('🌱 Seeding Sanity with sample data...\n')

  try {
    // Create Categories
    console.log('📁 Creating categories...')
    const categories = await Promise.all([
      client.create({
        _type: 'category',
        name: 'Laptops',
        slug: { current: 'laptops' },
        description: 'High-performance laptops for work, gaming, and everyday use',
        order: 1,
        showInNavigation: true,
      }),
      client.create({
        _type: 'category',
        name: 'Accessories',
        slug: { current: 'accessories' },
        description: 'Essential tech accessories including mice, keyboards, and more',
        order: 2,
        showInNavigation: true,
      }),
      client.create({
        _type: 'category',
        name: 'Bags',
        slug: { current: 'bags' },
        description: 'Premium laptop bags and backpacks for protection and style',
        order: 3,
        showInNavigation: true,
      }),
      client.create({
        _type: 'category',
        name: 'Gaming',
        slug: { current: 'gaming' },
        description: 'Gaming laptops and accessories for the ultimate gaming experience',
        order: 4,
        showInNavigation: true,
      }),
    ])
    console.log(`✅ Created ${categories.length} categories\n`)

    // Create Sample Products
    console.log('💻 Creating sample products...')
    const laptopsCategory = categories[0]
    const accessoriesCategory = categories[1]
    const gamingCategory = categories[3]

    const products = await Promise.all([
      // Gaming Laptop 1
      client.create({
        _type: 'product',
        name: 'Dell XPS 15 - 13th Gen Intel',
        slug: { current: 'dell-xps-15-13th-gen' },
        brand: 'Dell',
        price: 45000,
        compareAtPrice: 52000,
        description: 'Premium laptop with stunning display and powerful performance. Perfect for content creators and professionals who demand the best.',
        shortDescription: '15.6" FHD+, Intel i7-13700H, 16GB RAM, 512GB SSD',
        category: { _type: 'reference', _ref: laptopsCategory._id },
        specifications: [
          { label: 'Processor', value: 'Intel Core i7-13700H (13th Gen)' },
          { label: 'RAM', value: '16GB DDR5' },
          { label: 'Storage', value: '512GB NVMe SSD' },
          { label: 'Display', value: '15.6" FHD+ (1920x1200)' },
          { label: 'Graphics', value: 'NVIDIA GeForce RTX 3050 4GB' },
          { label: 'Battery', value: 'Up to 8 hours' },
          { label: 'Weight', value: '1.86 kg' },
        ],
        inStock: true,
        featured: true,
      }),

      // Gaming Laptop 2
      client.create({
        _type: 'product',
        name: 'ASUS ROG Strix G15 Gaming Laptop',
        slug: { current: 'asus-rog-strix-g15' },
        brand: 'ASUS',
        price: 38000,
        compareAtPrice: 42000,
        description: 'Powerful gaming laptop with high refresh rate display and RGB keyboard. Dominate your games with this beast.',
        shortDescription: '15.6" 144Hz, Ryzen 7, RTX 3060, 16GB RAM',
        category: { _type: 'reference', _ref: gamingCategory._id },
        specifications: [
          { label: 'Processor', value: 'AMD Ryzen 7 6800H' },
          { label: 'RAM', value: '16GB DDR5' },
          { label: 'Storage', value: '1TB NVMe SSD' },
          { label: 'Display', value: '15.6" FHD 144Hz' },
          { label: 'Graphics', value: 'NVIDIA GeForce RTX 3060 6GB' },
          { label: 'Battery', value: 'Up to 6 hours' },
          { label: 'Weight', value: '2.3 kg' },
        ],
        inStock: true,
        featured: true,
      }),

      // Business Laptop
      client.create({
        _type: 'product',
        name: 'HP EliteBook 840 G9',
        slug: { current: 'hp-elitebook-840-g9' },
        brand: 'HP',
        price: 35000,
        description: 'Professional business laptop with enterprise security features and all-day battery life.',
        shortDescription: '14" FHD, Intel i5-1235U, 16GB RAM, 256GB SSD',
        category: { _type: 'reference', _ref: laptopsCategory._id },
        specifications: [
          { label: 'Processor', value: 'Intel Core i5-1235U (12th Gen)' },
          { label: 'RAM', value: '16GB DDR4' },
          { label: 'Storage', value: '256GB NVMe SSD' },
          { label: 'Display', value: '14" FHD (1920x1080)' },
          { label: 'Graphics', value: 'Intel Iris Xe' },
          { label: 'Battery', value: 'Up to 12 hours' },
          { label: 'Weight', value: '1.4 kg' },
        ],
        inStock: true,
        featured: true,
      }),

      // Lenovo Laptop
      client.create({
        _type: 'product',
        name: 'Lenovo ThinkPad X1 Carbon Gen 11',
        slug: { current: 'lenovo-thinkpad-x1-carbon-gen11' },
        brand: 'Lenovo',
        price: 42000,
        compareAtPrice: 48000,
        description: 'Ultra-lightweight carbon fiber laptop with legendary ThinkPad keyboard and durability.',
        shortDescription: '14" WUXGA, Intel i7-1365U, 32GB RAM, 1TB SSD',
        category: { _type: 'reference', _ref: laptopsCategory._id },
        specifications: [
          { label: 'Processor', value: 'Intel Core i7-1365U (13th Gen)' },
          { label: 'RAM', value: '32GB LPDDR5' },
          { label: 'Storage', value: '1TB NVMe SSD' },
          { label: 'Display', value: '14" WUXGA (1920x1200)' },
          { label: 'Graphics', value: 'Intel Iris Xe' },
          { label: 'Battery', value: 'Up to 14 hours' },
          { label: 'Weight', value: '1.12 kg' },
        ],
        inStock: true,
        featured: true,
      }),

      // MacBook Alternative
      client.create({
        _type: 'product',
        name: 'ASUS ZenBook 14 OLED',
        slug: { current: 'asus-zenbook-14-oled' },
        brand: 'ASUS',
        price: 32000,
        description: 'Stunning OLED display in a premium aluminum chassis. The perfect MacBook alternative.',
        shortDescription: '14" OLED, Intel i5-1335U, 16GB RAM, 512GB SSD',
        category: { _type: 'reference', _ref: laptopsCategory._id },
        specifications: [
          { label: 'Processor', value: 'Intel Core i5-1335U (13th Gen)' },
          { label: 'RAM', value: '16GB LPDDR5' },
          { label: 'Storage', value: '512GB NVMe SSD' },
          { label: 'Display', value: '14" 2.8K OLED (2880x1800)' },
          { label: 'Graphics', value: 'Intel Iris Xe' },
          { label: 'Battery', value: 'Up to 10 hours' },
          { label: 'Weight', value: '1.39 kg' },
        ],
        inStock: true,
        featured: false,
      }),

      // Accessories
      client.create({
        _type: 'product',
        name: 'Logitech MX Master 3S Wireless Mouse',
        slug: { current: 'logitech-mx-master-3s' },
        brand: 'Logitech',
        price: 2800,
        compareAtPrice: 3200,
        description: 'Premium wireless mouse with ultra-fast scrolling and ergonomic design. Perfect for productivity.',
        shortDescription: 'Wireless, 8000 DPI, Multi-device, Rechargeable',
        category: { _type: 'reference', _ref: accessoriesCategory._id },
        specifications: [
          { label: 'Connectivity', value: 'Bluetooth & USB-C Receiver' },
          { label: 'DPI', value: '200-8000 DPI' },
          { label: 'Battery', value: 'Up to 70 days' },
          { label: 'Buttons', value: '7 programmable buttons' },
          { label: 'Weight', value: '141g' },
        ],
        inStock: true,
        featured: true,
      }),

      client.create({
        _type: 'product',
        name: 'Keychron K8 Pro Mechanical Keyboard',
        slug: { current: 'keychron-k8-pro' },
        brand: 'Keychron',
        price: 3500,
        description: 'Premium wireless mechanical keyboard with hot-swappable switches and RGB backlighting.',
        shortDescription: 'TKL, Hot-swappable, RGB, Wireless/Wired',
        category: { _type: 'reference', _ref: accessoriesCategory._id },
        specifications: [
          { label: 'Layout', value: 'TKL (87 keys)' },
          { label: 'Switches', value: 'Gateron G Pro (Hot-swappable)' },
          { label: 'Connectivity', value: 'Bluetooth 5.1 & USB-C' },
          { label: 'Battery', value: 'Up to 240 hours' },
          { label: 'Backlighting', value: 'RGB' },
        ],
        inStock: true,
        featured: true,
      }),

      client.create({
        _type: 'product',
        name: 'Anker PowerCore 20000mAh Power Bank',
        slug: { current: 'anker-powercore-20000' },
        brand: 'Anker',
        price: 1200,
        description: 'High-capacity power bank with fast charging for laptops and phones.',
        shortDescription: '20000mAh, 65W PD, USB-C',
        category: { _type: 'reference', _ref: accessoriesCategory._id },
        specifications: [
          { label: 'Capacity', value: '20000mAh / 72Wh' },
          { label: 'Output', value: '65W USB-C PD' },
          { label: 'Ports', value: '1x USB-C, 1x USB-A' },
          { label: 'Charging Time', value: '2 hours (65W input)' },
          { label: 'Weight', value: '360g' },
        ],
        inStock: true,
        featured: false,
      }),
    ])
    console.log(`✅ Created ${products.length} products\n`)

    // Create Homepage Settings
    console.log('🏠 Creating homepage settings...')
    const homepage = await client.create({
      _type: 'homepage',
      heroTitle: 'Welcome to Vista Store',
      heroSubtitle: 'Alexandria\'s premier destination for laptops, tech accessories, and gaming gear. Quality products, expert service.',
      featuredCategories: categories.slice(0, 4).map(cat => ({
        _type: 'reference',
        _ref: cat._id,
      })),
      whatsappNumber: '+201234567890',
      storeLocation: 'Alexandria, Egypt',
    })
    console.log('✅ Created homepage settings\n')

    console.log('🎉 Seeding complete!')
    console.log('\n📊 Summary:')
    console.log(`   - ${categories.length} categories`)
    console.log(`   - ${products.length} products`)
    console.log('   - 1 homepage configuration')
    console.log('\n💡 Note: Hero images need to be added manually in Sanity Studio')
    console.log('   Visit: https://www.sanity.io/manage/personal/project/27p8z5ah')
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seedData()
