# Contributing Guide

Thank you for your interest in contributing to this project! This guide will help you understand our development workflow and quality standards.

## Table of Contents

- [Development Workflow](#development-workflow)
- [Code Quality Standards](#code-quality-standards)
- [Git Hooks](#git-hooks)
- [Pull Request Process](#pull-request-process)
- [CI/CD Pipeline](#cicd-pipeline)
- [Testing Guidelines](#testing-guidelines)
- [Common Issues](#common-issues)

## Development Workflow

### 1. Setup Your Environment

```bash
# Clone the repository
git clone <repository-url>
cd {{PROJECT_NAME}}

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure your CMS (Sanity or Payload)
npm run setup:sanity  # or setup:payload
```

### 2. Create a Feature Branch

```bash
# Always branch from main
git checkout main
git pull origin main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 3. Make Your Changes

- Write clean, readable code
- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run the full validation suite
npm run validate

# Or run tests individually
npm run lint          # Check code style
npm run type-check    # Verify TypeScript
npm test              # Run unit tests
npm run test:e2e      # Run E2E tests
```

### 5. Commit Your Changes

Our Git hooks will automatically run when you commit:

```bash
# Stage your changes
git add .

# Commit (pre-commit hook will run)
git commit -m "feat: add new feature"

# Push (pre-push hook will run)
git push origin feature/your-feature-name
```

## Code Quality Standards

### TypeScript

- Use TypeScript strict mode (already configured)
- Avoid `any` types - use `unknown` with proper type guards
- Define explicit return types for public functions
- Use meaningful variable and function names

### ESLint

- Fix all ESLint errors before committing
- ESLint warnings should be addressed when possible
- Use `npm run lint:fix` to auto-fix issues

### Code Style

- Use functional components with hooks (React)
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper TypeScript interfaces/types

## Git Hooks

We use Husky and lint-staged to enforce code quality:

### Pre-Commit Hook

Automatically runs on `git commit`:

1. **ESLint** - Lints staged files with auto-fix
2. **TypeScript** - Type-checks entire codebase

If any check fails, the commit is blocked.

### Pre-Push Hook

Automatically runs on `git push`:

1. **Unit Tests** - Runs all Vitest tests

If tests fail, the push is blocked.

### Bypassing Hooks (Not Recommended)

Only bypass hooks in emergencies:

```bash
# Bypass pre-commit (NOT recommended)
git commit --no-verify -m "emergency fix"

# Bypass pre-push (NOT recommended)
git push --no-verify
```

## Pull Request Process

### 1. Create a Pull Request

- Push your branch to GitHub
- Open a PR against `main` branch
- Fill out the PR template (if available)
- Add a clear title and description

### 2. PR Title Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add new feature`
- `fix: resolve bug in component`
- `docs: update README`
- `chore: update dependencies`
- `refactor: improve code structure`
- `test: add unit tests`
- `perf: optimize performance`

### 3. Automated Checks

Your PR will trigger these workflows:

✅ **Lint & Type Check** - ESLint and TypeScript validation
✅ **Unit Tests** - Vitest test execution
✅ **Build** - Production build verification
✅ **E2E Tests** - Playwright browser testing
✅ **Lighthouse CI** - Performance audit with metrics
✅ **Dependency Review** - Security and license checks

All checks must pass before merging.

### 4. Code Review

- Address all reviewer comments
- Keep the PR focused and small
- Update tests when changing functionality
- Ensure documentation is updated

### 5. Merge

Once approved and all checks pass:

- Squash and merge (preferred)
- Delete the feature branch after merging

## CI/CD Pipeline

### Main CI/CD Workflow

Runs on every push and PR to `main`:

```yaml
Lint & Type Check → Unit Tests → Build → E2E Tests
                                     ↓
                          All Checks Passed
```

### Security & Dependency Checks

- **Weekly Audits**: Mondays at 9am UTC
- **PR Reviews**: Automatic on dependency changes
- **License Compliance**: Blocks GPL-3.0, AGPL-3.0

### Performance Monitoring

- **Lighthouse CI**: Runs on every PR
- **Metrics Tracked**: Performance, Accessibility, SEO, Best Practices
- **PR Comments**: Automatic score updates

## Testing Guidelines

### Unit Tests (Vitest)

Write unit tests for:

- Utility functions
- Custom hooks
- Business logic
- Data transformations

```typescript
// Example: lib/utils/__tests__/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from '../format'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-01-15')
    expect(formatDate(date)).toBe('January 15, 2025')
  })
})
```

### E2E Tests (Playwright)

Write E2E tests for:

- Critical user flows
- Navigation paths
- Form submissions
- Page interactions

```typescript
// Example: e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
})
```

### Test Coverage

- Aim for 80%+ coverage on critical paths
- All new features should include tests
- Bug fixes should include regression tests

## Common Issues

### Git Hooks Not Running

```bash
# Reinstall Husky hooks
npm run prepare
```

### TypeScript Errors in Tests

```bash
# Clear cache and rebuild
rm -rf .next node_modules/.vite
npm install
npm run type-check
```

### E2E Tests Failing Locally

```bash
# Install Playwright browsers
npx playwright install --with-deps

# Run tests in UI mode for debugging
npm run test:e2e:ui
```

### CI Failing But Local Passes

- Ensure you pulled latest `main`
- Check environment variables
- Verify all dependencies are committed
- Check for platform-specific issues

## Getting Help

- Check existing issues on GitHub
- Review the main [README.md](README.md)
- Ask questions in pull request comments

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines

---

Thank you for contributing! 🎉
