# AI Behavior Rules & Context

> **SYSTEM NOTE**: All AI agents (Claude, Antigravity, Cursor) must follow these rules.

## 1. Architecture & Patterns

### CMS Abstraction (CRITICAL)
- **NEVER** import from `sanity`, `@sanity/*`, `payload`, or `payload/*` directly in UI components (`components/`).
- **ALWAYS** use the `CMSService` abstraction and DTOs located in `lib/cms/types`.
- **DTO First**: If a UI component needs data that isn't in the DTO, update the DTO interface first, then the transformer, then the component.
- **Server Components**: Fetch data in Server Components (pages/layouts) and pass DTOs to Client Components.

### Directory Structure
- `app/[locale]/`: Routes and pages.
- `components/ui/`: Generic, reusable UI components (buttons, inputs).
- `components/cms/`: Components that render CMS content (receive DTOs as props).
- `lib/cms/`: CMS adapters and transformers.

## 2. Styling (Tailwind CSS 4)

- **No Arbitrary Values**: Avoid `w-[123px]`, `bg-[#123456]`. Use theme tokens (e.g., `w-32`, `bg-primary`).
- **Mobile First**: Write mobile styles first, then `sm:`, `md:`, `lg:`.
- **Class Sorting**: Sort classes logically (layout -> box model -> typography -> visual).

## 3. Internationalization (i18n)

- **No Hardcoded Strings**: All user-facing text MUST be in `messages/{locale}.json`.
- **RTL Support**: Ensure layouts work in RTL (use logical properties like `ms-` instead of `ml-` where possible, though Tailwind handles much of this).

## 4. Testing

- **Logic Changes**: If you modify `lib/` functions, run `npm test` (Vitest).
- **UI Changes**: If you modify `components/` or `app/`, run `npm run test:e2e` (Playwright).
- **New Features**: Create a test file *before* or *alongside* the implementation.

## 5. Code Quality

- **Strict Types**: No `any`. Use proper interfaces.
- **Comments**: Explain *why*, not *what*.
