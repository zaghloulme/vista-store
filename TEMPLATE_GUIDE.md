# Slate Template Guide

Complete guide for developers using this template to build new projects.

## Table of Contents

1. [Template Overview](#template-overview)
2. [Getting Started](#getting-started)
3. [CMS Architecture](#cms-architecture)
4. [Internationalization](#internationalization)
5. [SEO Implementation](#seo-implementation)
6. [Analytics & Tracking](#analytics--tracking)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)

---

## Template Overview

This template is designed to be **AI-friendly** and **production-ready** with minimal configuration. Key design principles:

- **Swappable CMS**: Switch between Sanity and Payload with one environment variable
- **DTO Pattern**: Components never depend on the CMS directly
- **Type-Safe**: Full TypeScript coverage
- **SEO-First**: Comprehensive SEO out of the box
- **Test-Ready**: Vitest and Playwright configured

### What's Included

- ✅ Next.js 16 with App Router
- ✅ Tailwind CSS 4
- ✅ Swappable CMS (Sanity/Payload)
- ✅ Full i18n with next-intl
- ✅ Google Tag Manager
- ✅ Comprehensive SEO
- ✅ Testing setup (Vitest + Playwright)
- ✅ Example pages and components

---

## Getting Started

### Step 1: Clone and Setup

```bash
git clone <your-repo-url> my-project
cd my-project
npm install --legacy-peer-deps
```

> **Note**: We use `--legacy-peer-deps` due to next-intl's peer dependency requirements with Next.js 16.

### Step 2: Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

**Minimum required variables:**

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=My Project
CMS_PROVIDER=sanity  # or 'payload'
```

### Step 3: Choose Your CMS

#### Option A: Sanity CMS (Recommended)

1. Run the Sanity setup script:
```bash
npm run setup:sanity
```

2. Follow the prompts to create/link a Sanity project

3. Add Sanity credentials to `.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk...
```

#### Option B: Payload CMS

1. Run the Payload setup script:
```bash
npm run setup:payload
```

2. Add Payload credentials to `.env.local`:
```env
PAYLOAD_SECRET=your-secret-key
DATABASE_URI=mongodb://localhost:27017/payload
```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000/en`

---

## CMS Architecture

### DTO Pattern Explained

The template uses **Data Transfer Objects (DTOs)** to completely abstract the CMS layer:

```
CMS (Sanity/Payload)
    ↓
Transformer (converts to DTO)
    ↓
Components (only know about DTOs)
```

**Key files:**

- `lib/cms/types/dtos.ts` - DTO interfaces (PageDTO, BlogPostDTO, etc.)
- `lib/cms/types/index.ts` - CMSService interface
- `lib/cms/sanity/` - Sanity implementation
- `lib/cms/payload/` - Payload implementation
- `lib/cms/factory.ts` - CMS factory (returns correct implementation)

### Adding a New Content Type

1. **Define the DTO** in `lib/cms/types/dtos.ts`:

```typescript
export interface ProductDTO {
  id: string
  name: string
  price: number
  images: ImageDTO[]
  description: string
}
```

2. **Add method to CMSService interface** in `lib/cms/types/index.ts`:

```typescript
export interface CMSService {
  // ... existing methods
  getProduct(slug: string): Promise<ProductDTO | null>
  getAllProducts(): Promise<ProductDTO[]>
}
```

3. **Implement in Sanity** (`lib/cms/sanity/index.ts`):

```typescript
async getProduct(slug: string): Promise<ProductDTO | null> {
  const product = await sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0]`,
    { slug }
  )
  if (!product) return null
  return SanityTransformer.transformProduct(product)
}
```

4. **Add transformer** in `lib/cms/sanity/transformer.ts`:

```typescript
static transformProduct(sanityProduct: any): ProductDTO {
  return {
    id: sanityProduct._id,
    name: sanityProduct.name,
    price: sanityProduct.price,
    images: sanityProduct.images?.map(this.transformImage) || [],
    description: sanityProduct.description,
  }
}
```

5. **Repeat for Payload** in `lib/cms/payload/`

### Switching CMS Providers

Simply change the environment variable:

```env
CMS_PROVIDER=payload  # was 'sanity'
```

**No code changes required!**

### How to Design Good DTOs

In this architecture, a **DTO (Data Transfer Object)** is the contract between your CMS and your Frontend.

#### The Golden Rule

> **Your UI components should never know which CMS you are using. They should only know about DTOs.**

#### Characteristics of a "Good" DTO

**1. UI-Centric, Not CMS-Centric**

A good DTO is designed around **what the UI needs to render**, not how the data is stored in the database.

❌ **Bad (CMS-Centric):**

```typescript
interface ProductDTO {
  _id: string;               // Sanity specific
  _type: 'product';          // Sanity specific
  sys: { id: string };       // Contentful specific
  field_price_value: number; // Drupal style
}
```

✅ **Good (UI-Centric):**

```typescript
interface ProductDTO {
  id: string;
  price: number;
  currency: string;
}
```

**2. Flattened & Simplified**

CMS responses are often deeply nested. A good DTO flattens this structure to make it easy to use in React components.

❌ **Bad (Nested):**

```typescript
interface AuthorDTO {
  data: {
    attributes: {
      name: string;
      avatar: {
        data: {
          attributes: {
            url: string;
          }
        }
      }
    }
  }
}
```

✅ **Good (Flat):**

```typescript
interface AuthorDTO {
  name: string;
  avatarUrl: string;
}
```

**3. Serializable (No Functions)**

DTOs should contain **only data** (strings, numbers, booleans, arrays, objects). They should not contain functions or class instances, because they need to be passed from the Server Component (Server) to the Client Component (Browser).

❌ **Bad:**

```typescript
interface UserDTO {
  name: string;
  getFullName(): string; // ❌ Functions don't serialize
  createdAt: Date;       // ❌ Date objects don't serialize properly
}
```

✅ **Good:**

```typescript
interface UserDTO {
  name: string;
  fullName: string;      // ✅ Computed value as a string
  createdAt: string;     // ✅ ISO string format
}
```

**4. Complete (Self-Contained)**

A DTO should contain **all the data needed** for that specific context. Avoid "partial" DTOs where you have to guess if a field exists.

❌ **Bad:**

```typescript
// Sometimes has avatar, sometimes doesn't
interface AuthorDTO {
  name: string;
  avatar?: string; // When is this present? Who knows!
}
```

✅ **Good:**

```typescript
interface AuthorDTO {
  name: string;
  avatar: ImageDTO | undefined; // Clear: avatar is optional but well-typed
}
```

#### Example: The ImageDTO

Your project has a perfect example of a good DTO in `lib/cms/types/dtos.ts`:

```typescript
export interface ImageDTO {
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
}
```

**Why it's good:**

1. **Universal**: Every CMS handles images differently (some have `asset->url`, some have `url`, some have `sizes`). This DTO standardizes it.
2. **Ready for next/image**: It has exactly the props needed by the Next.js `<Image />` component (`src`, `alt`, `width`, `height`, `blurDataURL`).
3. **Flat**: No nested objects to navigate.
4. **Complete**: All required fields are present, optional field is clearly marked.

#### How to Create a New DTO (Workflow)

When you need to add a new feature (e.g., a "Testimonial"):

**Step 1: Start with the UI**

Write the React component first.

```typescript
// components/TestimonialCard.tsx
export function TestimonialCard({ name, role, quote, photo }) {
  return (
    <div>
      <Image {...photo} />
      <p>{quote}</p>
      <cite>{name}, {role}</cite>
    </div>
  )
}
```

**Step 2: Define the DTO**

Create the interface based on the props you just wrote.

```typescript
// lib/cms/types/dtos.ts
export interface TestimonialDTO {
  id: string;
  name: string;
  role: string;
  quote: string;
  photo: ImageDTO; // ✅ Reuse existing DTOs!
}
```

**Step 3: Add to CMSService Interface**

Update the `CMSService` interface with the new method.

```typescript
// lib/cms/types/index.ts
export interface CMSService {
  // ... existing methods
  getTestimonials(locale: string): Promise<TestimonialDTO[]>
}
```

**Step 4: Implement the Transformer**

Write the code to convert the messy CMS response into your clean DTO.

```typescript
// lib/cms/sanity/transformer.ts
export class SanityTransformer {
  // ... existing methods

  static transformTestimonial(sanityTestimonial: unknown): TestimonialDTO {
    const testimonial = sanityTestimonial as Record<string, unknown>

    return {
      id: testimonial._id as string,
      name: testimonial.name as string,
      role: testimonial.role as string,
      quote: testimonial.quote as string,
      photo: this.transformImage(testimonial.photo),
    }
  }
}
```

**Step 5: Implement the Service Method**

Add the method to your CMS service implementation.

```typescript
// lib/cms/sanity/service.ts
export class SanityService implements CMSService {
  // ... existing methods

  async getTestimonials(locale: string): Promise<TestimonialDTO[]> {
    const query = `*[_type == "testimonial" && locale == $locale] {
      _id,
      name,
      role,
      quote,
      photo
    }`

    const testimonials = await sanityClient.fetch(query, { locale })
    return testimonials.map(SanityTransformer.transformTestimonial)
  }
}
```

#### Checklist for Reviewing DTOs

Before finalizing a DTO, ask yourself:

- [ ] Does it have any CMS-specific fields (like `_ref`, `sys`, `node`)? **(Should be NO)**
- [ ] Is it flat and easy to access? **(Should be YES)**
- [ ] Does it use primitive types or other DTOs? **(Should be YES)**
- [ ] Can I switch from Sanity to Payload without changing this interface? **(Should be YES)**
- [ ] Does it contain everything the UI component needs? **(Should be YES)**
- [ ] Are all fields serializable (no functions, no Date objects)? **(Should be YES)**
- [ ] Are optional fields clearly marked with `?` or `| undefined`? **(Should be YES)**

#### Common DTO Patterns in This Project

**Base Content DTO:**

Most content types inherit from a base structure:

```typescript
interface BaseContentDTO {
  id: string;
  slug: string;
  title: string;
  description: string;
  publishedAt: Date;
  updatedAt: Date;
  locale: string;
}
```

**SEO Metadata DTO:**

Standardized across all pages:

```typescript
interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: ImageDTO;
  ogType: 'website' | 'article' | 'book' | 'profile';
  twitterCard: 'summary' | 'summary_large_image';
  canonical?: string;
  noindex: boolean;
  nofollow: boolean;
}
```

**Navigation DTO:**

Recursive structure for nested menus:

```typescript
interface NavItemDTO {
  id: string;
  label: string;
  href: string;
  target?: '_blank' | '_self';
  children?: NavItemDTO[]; // ✅ Recursive for nested navigation
}

interface NavigationDTO {
  items: NavItemDTO[];
}
```

#### Anti-Patterns to Avoid

**❌ Don't Expose Internal IDs**

```typescript
// Bad: Exposing CMS internal structure
interface PostDTO {
  _id: string;
  _rev: string; // CMS revision tracking - UI doesn't need this
}

// Good: Clean abstraction
interface PostDTO {
  id: string;
}
```

**❌ Don't Mix Data and Presentation Logic**

```typescript
// Bad: Mixing concerns
interface ProductDTO {
  price: number;
  formattedPrice: string; // Formatting is UI concern, not data concern
}

// Good: Keep DTOs pure data
interface ProductDTO {
  price: number;
  currency: string; // UI can format this however it wants
}
```

**❌ Don't Create Generic "Any" DTOs**

```typescript
// Bad: Too generic
interface ContentDTO {
  type: string;
  fields: Record<string, unknown>;
}

// Good: Specific, type-safe
interface BlogPostDTO {
  type: 'blogPost';
  title: string;
  content: unknown; // Portable Text
}

interface ProductDTO {
  type: 'product';
  name: string;
  price: number;
}
```

#### Benefits of This Approach

✅ **CMS Independence**: Switch from Sanity to Payload by only changing transformers
✅ **Type Safety**: Full TypeScript autocomplete in components
✅ **Testing**: Easy to mock DTOs for unit tests
✅ **Documentation**: DTOs serve as API documentation
✅ **Refactoring**: Change CMS schema without breaking UI
✅ **Onboarding**: New developers understand data structure instantly

**Remember**: DTOs are your contract. Keep them clean, simple, and UI-focused.

---

## Internationalization

### Adding a New Locale

1. **Update config** in `i18n/config.ts`:

```typescript
export const locales = ['en', 'ar', 'de', 'fr'] as const  // Add 'fr'

export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
  de: 'ltr',
  fr: 'ltr',  // Add this
}
```

2. **Create translation file** at `messages/fr.json`:

```json
{
  "common": {
    "hello": "Bonjour",
    "welcome": "Bienvenue"
  }
}
```

3. **Add CMS content** for the new locale in your CMS

4. **Build and test**:

```bash
npm run build
npm start
```

Visit: `http://localhost:3000/fr`

### Using Translations in Components

Since we're not using next-intl's client provider, for client components you can create a simple translation hook or load translations server-side and pass as props.

**Example for server components:**

```typescript
// In your page or layout
const messages = await import(`@/messages/${locale}.json`)

// Pass to client component
<MyComponent translations={messages.default.mySection} />
```

---

## SEO Implementation

### Adding Metadata to a Page

Use the helper functions in `lib/seo/metadata.ts`:

```typescript
// app/[locale]/about/page.tsx
import { generatePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return generatePageMetadata(
    'About Us',
    'Learn more about our company',
    locale,
    {
      keywords: ['about', 'company', 'team'],
      ogImage: '/images/about-og.jpg',
      canonical: `https://example.com/${locale}/about`
    }
  )
}
```

### Adding JSON-LD Schemas

```typescript
import { generateArticleSchema, renderJsonLd } from '@/lib/seo/json-ld'

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await cms.getPost(slug, 'en')

  const schema = generateArticleSchema(post, 'en')

  return (
    <>
      {renderJsonLd(schema)}
      <article>{/* ... */}</article>
    </>
  )
}
```

### Customizing robots.txt

Edit `app/robots.ts`:

```typescript
export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV === 'production'

  if (!isProd) {
    return {
      rules: { userAgent: '*', disallow: '/' }
    }
  }

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
      // Add your custom rules
    ]
  }
}
```

---

## Analytics & Tracking

### Setting Up GTM

1. Add GTM ID to `.env.local`:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

2. GTM is auto-loaded in the root layout when the ID is present

### Tracking Custom Events

Use the utilities in `lib/analytics/tracking.ts`:

```typescript
'use client'

import { trackButtonClick } from '@/lib/analytics/tracking'

export function CTAButton() {
  return (
    <button onClick={() => trackButtonClick('hero-cta', { page: 'homepage' })}>
      Get Started
    </button>
  )
}
```

### Available Tracking Functions

- `trackEvent(event, data)` - Generic event
- `trackButtonClick(buttonName, data)` - Button clicks
- `trackFormSubmit(formName, data)` - Form submissions
- `trackExternalLink(url, linkText)` - External links
- `trackSearch(query, resultCount)` - Search queries
- `trackContentView(contentType, contentId, title)` - Content views
- `trackScrollDepth(percentage)` - Scroll tracking
- `trackVideo(action, videoId, title)` - Video interactions

### Page View Tracking

Automatic via `PageViewTracker` component in layout. No additional setup needed.

---

## Testing

### Unit Tests (Vitest)

Create tests in `__tests__/` directory:

```typescript
// __tests__/utils.test.ts
import { describe, it, expect } from 'vitest'
import { myUtilFunction } from '../lib/utils'

describe('myUtilFunction', () => {
  it('should return expected value', () => {
    expect(myUtilFunction('input')).toBe('expected')
  })
})
```

**Run tests:**

```bash
npm test
```

### E2E Tests (Playwright)

Create tests in `e2e/` directory:

```typescript
// e2e/products.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Products Page', () => {
  test('should display products list', async ({ page }) => {
    await page.goto('/en/products')
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible()
  })
})
```

**Run E2E tests:**

```bash
npm run test:e2e       # Headless
npm run test:e2e:ui    # With UI
```

---

## Deployment

### Deploying to Vercel

1. **Push to GitHub:**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import in Vercel:**
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repo

3. **Configure Environment Variables:**

   Add all variables from `.env.local` to Vercel:
   - Settings → Environment Variables
   - Add each variable

4. **Deploy:**
   - Vercel will auto-deploy on push

### Environment-Specific Configuration

The template automatically adjusts behavior based on environment:

- **Development** (`VERCEL_ENV=development`):
  - robots.txt blocks all crawlers
  - Verbose logging enabled

- **Preview** (`VERCEL_ENV=preview`):
  - robots.txt blocks all crawlers
  - Revalidation disabled

- **Production** (`VERCEL_ENV=production`):
  - robots.txt allows crawlers
  - Full caching enabled
  - Analytics active

---

## Common Tasks

### Adding a New Page

1. **Create page file:**

```typescript
// app/[locale]/services/page.tsx
export default async function ServicesPage() {
  return <div>Services</div>
}
```

2. **Add metadata:**

```typescript
import { generatePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generatePageMetadata('Services', 'Our services', locale)
}
```

3. **Update sitemap** in `app/sitemap.ts`:

```typescript
const staticPages = ['', '/about', '/contact', '/services']  // Add '/services'
```

### Adding a Blog

The template includes blog DTOs and transformers. To activate:

1. **Create blog schema in your CMS**

2. **Create blog page:**

```typescript
// app/[locale]/blog/page.tsx
import { cms } from '@/lib/cms'

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const posts = await cms.getAllPosts(locale)

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

3. **Create dynamic post page:**

```typescript
// app/[locale]/blog/[slug]/page.tsx
import { cms } from '@/lib/cms'

export async function generateStaticParams() {
  const posts = await cms.getAllPostSlugs('en')
  return posts.map(slug => ({ slug }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params
  const post = await cms.getPost(slug, locale)

  return <article>{/* Render post */}</article>
}
```

### Configuring Revalidation

**On-Demand Revalidation:**

1. Add secret to `.env.local`:

```env
REVALIDATION_SECRET=your-secret-token-123
```

2. Configure CMS webhook to call:

```
POST https://your-site.com/api/revalidate?secret=your-secret-token-123
Body: { "type": "path", "path": "/blog/my-post" }
```

**Time-Based Revalidation:**

Add to your data fetching:

```typescript
export const revalidate = 3600  // Revalidate every hour
```

---

## Troubleshooting

### Build Fails with "Couldn't find next-intl config file"

**Solution:** This is resolved in the current version. The template now loads messages directly without relying on next-intl's plugin.

### Peer Dependency Errors During Install

**Solution:** Use `--legacy-peer-deps`:

```bash
npm install --legacy-peer-deps
```

### CMS Data Not Showing

**Checklist:**
1. ✅ CMS_PROVIDER set correctly?
2. ✅ API credentials configured?
3. ✅ Content exists in CMS for that locale?
4. ✅ Transformer implemented correctly?
5. ✅ Check browser console for errors

### TypeScript Errors

Run type check:

```bash
npm run type-check
```

Common fixes:
- Ensure all DTO interfaces match your data
- Check transformer return types
- Verify async/await usage

### "Cannot find module '@/...'"

**Solution:** TypeScript path alias issue. Check `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Best Practices

### 1. Keep Components CMS-Agnostic

❌ **Bad:**
```typescript
function MyComponent() {
  const data = await sanityClient.fetch(...)  // Direct CMS dependency
}
```

✅ **Good:**
```typescript
async function MyPage() {
  const data = await cms.getPage('home', 'en')  // Use CMS factory
  return <MyComponent data={data} />
}
```

### 2. Always Use DTO Types

```typescript
interface MyComponentProps {
  page: PageDTO  // Use DTO, not Sanity/Payload types
}
```

### 3. Implement Both CMS Providers

When adding new content types, implement for **both** Sanity and Payload to maintain swappability.

### 4. Test Locale Switching

Always test your features in multiple locales, especially RTL (Arabic).

### 5. Use Semantic HTML

For proper SEO, use correct heading hierarchy:

```tsx
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
```

---

## Support

For issues or questions:
1. Check this guide
2. Review the README.md
3. Check existing issues on GitHub
4. Create a new issue with details

---

**Happy building! 🚀**
