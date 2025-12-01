# {{PROJECT_NAME}}

<!-- TODO: Replace OWNER/REPO with your GitHub repository path -->
[![CI/CD Pipeline](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)

> AI-friendly Next.js template with swappable CMS, comprehensive SEO, and multi-language support

## Project Overview

{{PROJECT_DESCRIPTION}}

**Industry:** {{INDUSTRY}}
**Target Audience:** {{TARGET_AUDIENCE}}

## Business Goals

{{BUSINESS_GOALS}}

## Technical Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **CMS:** {{CMS_PROVIDER}}
- **Styling:** Tailwind CSS 4
- **i18n:** next-intl (UI) + CMS (content)
- **Analytics:** Google Tag Manager
- **Testing:** Vitest + Playwright
- **Deployment:** Vercel

### Supported Languages

{{LOCALES}}


## Features

{{FEATURES_LIST}}

### Core Features (Included)

- ✅ **Swappable CMS Architecture** - Switch between Sanity/Payload with environment variable
- ✅ **Full Internationalization** - Multi-language with next-intl + CMS integration
- ✅ **Comprehensive SEO** - Meta tags, JSON-LD, sitemap, robots.txt, RSS feed
- ✅ **Analytics Ready** - Google Tag Manager with event tracking
- ✅ **AI Crawler Support** - Explicitly allows GPTBot, Claude, Perplexity, etc.
- ✅ **Image Optimization** - Automatic WebP/AVIF with next/image
- ✅ **Testing Setup** - Vitest (unit) + Playwright (E2E)
- ✅ **Type-Safe** - Full TypeScript with strict mode

## Integrations

{{INTEGRATIONS}}

## Analytics Configuration

- **GTM ID:** {{GTM_ID}}
- **Tracking Goals:** {{TRACKING_GOALS}}

## Design System

- **Brand Colors:** {{BRAND_COLORS}}
- **Fonts:** {{FONTS}}
- **Style:** {{DESIGN_STYLE}}

## Getting Started

> **New to this template?** See [SETUP.md](SETUP.md) for a quick configuration checklist.

### Prerequisites

- Node.js 20+ and npm
- A Sanity or Payload CMS account (depending on your choice)
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd {{PROJECT_NAME}}

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure your environment variables (see below)
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL={{SITE_URL}}
NEXT_PUBLIC_SITE_NAME={{PROJECT_NAME}}

# CMS Configuration
CMS_PROVIDER={{CMS_PROVIDER}}

# Sanity (if using Sanity)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token

# Payload (if using Payload)
PAYLOAD_SECRET=your-secret
DATABASE_URI=mongodb://localhost/payload

# Analytics
NEXT_PUBLIC_GTM_ID={{GTM_ID}}
```

### CMS Setup

#### For Sanity

```bash
npm run setup:sanity
```

This will initialize Sanity Studio with localization support.

#### For Payload

```bash
npm run setup:payload
```

This will configure Payload CMS with the necessary collections.

### Development

```bash
# Start the development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Locale-specific routes
│   ├── robots.ts          # Dynamic robots.txt
│   └── sitemap.ts         # Dynamic sitemap
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── cms/              # CMS-specific components
│   ├── seo/              # SEO components
│   └── analytics/        # Analytics components
├── lib/                   # Utilities and configuration
│   ├── cms/              # CMS abstraction layer
│   │   ├── types/        # DTOs and interfaces
│   │   ├── sanity/       # Sanity implementation
│   │   └── payload/      # Payload implementation
│   ├── seo/              # SEO utilities
│   ├── analytics/        # Analytics utilities
│   └── i18n/             # Internationalization
├── messages/              # Translation files
│   ├── en.json
│   ├── ar.json
│   └── de.json
└── public/                # Static assets
```

## CMS Abstraction Pattern

This template uses a **DTO (Data Transfer Object) pattern** to abstract the CMS layer. This means:

- **Zero code changes** needed when switching between Sanity and Payload
- **Components are CMS-agnostic** - they only know about DTOs, not the underlying CMS
- **Easy to extend** - add new CMS providers by implementing the `CMSService` interface

To switch CMS, simply change the `CMS_PROVIDER` environment variable.

## SEO Features

### Meta Tags & Open Graph

- Dynamic metadata generation with `generateMetadata`
- Open Graph images
- Twitter Cards
- Canonical URLs
- Hreflang tags for multi-language

### Technical SEO

- **Proper Heading Hierarchy** - H1 → H2 → H3 (no skipping)
- **Sitemap.xml** - Dynamic, multi-locale
- **Robots.txt** - Environment-aware, AI crawler support
- **RSS Feed** - Auto-generated for blog content
- **JSON-LD Schemas** - Organization, WebSite, Article schemas

### AI Crawler Support

The template explicitly allows these AI crawlers:

- GPTBot (OpenAI)
- ChatGPT-User (ChatGPT browsing)
- Claude-Web (Anthropic)
- Google-Extended (Gemini)
- PerplexityBot (Perplexity)

## Quality Assurance

### Git Hooks

Automated code quality checks run before commits and pushes:

**Pre-Commit Hook:**
- Runs ESLint with auto-fix on staged files
- TypeScript type-checking across entire codebase
- Only allows commit if all checks pass

**Pre-Push Hook:**
- Runs full unit test suite
- Prevents broken code from reaching remote repository

### CI/CD Pipelines

Automated workflows run on every pull request and push to main:

**Main CI/CD Pipeline** (`.github/workflows/ci.yml`):
1. **Lint & Type Check** - ESLint and TypeScript validation
2. **Unit Tests** - Vitest test execution
3. **Build** - Production build verification
4. **E2E Tests** - Playwright browser testing (Chromium, Firefox, WebKit)

**Security & Dependencies** (`.github/workflows/dependency-check.yml`):
- Weekly npm security audits (Mondays 9am UTC)
- Automated dependency review on PRs
- License compliance checks
- Security report artifacts

**Performance Monitoring** (`.github/workflows/benchmark.yml`):
- Lighthouse CI on pull requests
- Performance, Accessibility, SEO, Best Practices scores
- Automatic PR comments with metrics
- Historical performance tracking

**Automated Updates** (`.github/dependabot.yml`):
- Weekly dependency updates
- Grouped minor/patch updates
- Auto-labeled PRs for easy review

## Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

```bash
# Or use Vercel CLI
npx vercel
```

## AI Development Context

This section provides context for AI development tools like Claude Code, GitHub Copilot, etc.

### Business Requirements

{{AI_BUSINESS_CONTEXT}}

### Technical Constraints

{{AI_TECHNICAL_CONSTRAINTS}}

### Development Priorities

{{AI_DEV_PRIORITIES}}

## Scripts

```bash
# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server

# Testing
npm run test          # Run Vitest unit tests
npm run test:e2e      # Run Playwright E2E tests
npm run test:e2e:ui   # Run Playwright in UI mode

# Code Quality
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run type-check    # TypeScript type checking
npm run lint-staged   # Run lint-staged (used by Git hooks)
npm run validate      # Run lint + type-check + test (full validation)

# CMS Setup
npm run setup:sanity  # Initialize Sanity CMS
npm run setup:payload # Initialize Payload CMS
npm run sanity:dev    # Start Sanity Studio
```

## Contributing

This is a template repository. For development workflow and contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT

---

**Built with ❤️ using Next.js, Tailwind CSS, and modern best practices**
