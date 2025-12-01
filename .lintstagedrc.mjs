/**
 * Lint-Staged Configuration
 * Runs linting and type-checking on staged files before commit
 */

const config = {
  // Run ESLint on TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'bash -c "tsc --noEmit"', // Type-check all files, not just staged ones
  ],
}

export default config
