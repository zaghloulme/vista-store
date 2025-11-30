/**
 * Home Page
 * Demonstrates i18n and provides a starting point for customization
 */

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full items-center justify-between font-sans text-sm">
        <h1 className="text-4xl font-bold mb-8">
          Slate Template
        </h1>
        <p className="mb-4">
          AI-friendly Next.js template with swappable CMS and comprehensive SEO.
        </p>
        <div className="mt-8 space-y-2">
          <h2 className="text-2xl font-semibold">✅ Features Included:</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Swappable CMS Architecture (Sanity/Payload)</li>
            <li>Full Internationalization (next-intl)</li>
            <li>Comprehensive SEO (meta tags, sitemap, robots.txt)</li>
            <li>Google Tag Manager Ready</li>
            <li>AI Crawler Support</li>
            <li>Image Optimization</li>
            <li>Testing Setup (Vitest + Playwright)</li>
          </ul>
        </div>
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="font-mono text-sm">
            Get started by editing <code className="font-bold">app/[locale]/page.tsx</code>
          </p>
        </div>
      </div>
    </main>
  )
}
