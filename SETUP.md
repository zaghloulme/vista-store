# Setup Guide

Quick checklist to configure this template before development.

## 1. Replace GitHub Repository Paths

```bash
# Find and replace in these files:
.github/dependabot.yml    → Replace "TEMPLATE_OWNER_USERNAME" with your GitHub username
README.md                 → Replace "OWNER/REPO" with your repository path (e.g., "myname/myproject")
```

## 2. Configure Template Placeholders

All placeholders in `README.md` use `{{PLACEHOLDER}}` format. Replace these:

### Required (Critical for AI)

```
{{PROJECT_NAME}}          → Your project name (e.g., "Acme Corp Website")
{{PROJECT_DESCRIPTION}}   → Brief description (1-2 sentences)
{{INDUSTRY}}              → Industry type (e.g., "E-commerce", "SaaS")
{{TARGET_AUDIENCE}}       → Who uses this (e.g., "B2B SaaS companies")
{{CMS_PROVIDER}}          → "Sanity" or "Payload"
{{SITE_URL}}              → Production URL (e.g., "https://example.com")
```

### Business Context (For AI Development)

```
{{BUSINESS_GOALS}}        → What should this site achieve?
{{FEATURES_LIST}}         → What features are planned/implemented?
{{TRACKING_GOALS}}        → What analytics events to track?
{{AI_BUSINESS_CONTEXT}}   → Business requirements for AI to understand
{{AI_TECHNICAL_CONSTRAINTS}} → Technical limits (budget, deadlines, legacy systems)
{{AI_DEV_PRIORITIES}}     → What to prioritize (speed vs quality, etc.)
```

### Optional (Nice to Have)

```
{{LOCALES}}               → Keep or remove language list
{{INTEGRATIONS}}          → External services (Stripe, etc.)
{{GTM_ID}}                → Google Tag Manager ID
{{BRAND_COLORS}}          → Primary colors (e.g., "#3B82F6")
{{FONTS}}                 → Typography (e.g., "Inter, sans-serif")
{{DESIGN_STYLE}}          → Design approach (e.g., "Minimalist", "Bold")
```

## 3. Environment Variables

Create `.env.local`:

```env
# Site
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_SITE_NAME=Your Project Name

# CMS - Choose Sanity OR Payload
CMS_PROVIDER=Sanity  # or "Payload"

# Sanity (if using)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-token

# Payload (if using)
PAYLOAD_SECRET=your-secret-key
DATABASE_URI=mongodb://localhost/yourdb

# Analytics (optional)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
```

## 4. CMS Setup

**For Sanity:**
```bash
npm run setup:sanity
```

**For Payload:**
```bash
npm run setup:payload
```

## 5. GitHub Secrets (for CI/CD)

Add these in GitHub repo settings → Secrets and variables → Actions:

```
NEXT_PUBLIC_SANITY_PROJECT_ID  (if using Sanity)
NEXT_PUBLIC_SANITY_DATASET     (if using Sanity)
SANITY_API_TOKEN               (if using Sanity)
```

## 6. Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Verify everything works
npm run validate
```

## 7. First Commit

```bash
git add .
git commit -m "chore: configure template for [PROJECT_NAME]"
git push origin main
```

## 8. Before Handing to AI

Create a `.claude/PROJECT_CONTEXT.md` file with:

```markdown
# Project Context for AI

## Business Goals
[What this project should achieve - be specific]

## Target Users
[Who will use this and how]

## Key Features
- [Feature 1]: [Why it matters]
- [Feature 2]: [Why it matters]

## Technical Constraints
- Budget: [X hours or $Y]
- Deadline: [Date]
- Must integrate with: [Existing systems]
- Cannot use: [Restricted technologies]

## Development Priorities
1. [Speed/Quality/Cost - pick order]
2. [Must-have vs nice-to-have features]
3. [Areas where we can compromise]

## Brand Guidelines
- Colors: [Hex codes]
- Fonts: [Font families]
- Tone: [Formal/Casual/Playful]

## Content Strategy
- Blog posts: [Frequency, topics]
- Pages needed: [List]
- SEO targets: [Keywords, markets]
```

---

**That's it!** You're ready to develop or hand off to AI. 🚀
