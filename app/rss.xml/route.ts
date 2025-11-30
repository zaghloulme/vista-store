/**
 * RSS Feed
 * Generates RSS feed for blog posts
 */

import { cms } from '@/lib/cms'
import { defaultLocale } from '@/i18n/config'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Site'

export async function GET() {
  try {
    const postsResponse = await cms.getPosts(defaultLocale)
    const posts = postsResponse.items

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>Latest posts from ${siteName}</description>
    <language>${defaultLocale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/${defaultLocale}/blog/${post.slug}</link>
      <description><![CDATA[${post.description || post.excerpt}]]></description>
      <pubDate>${post.publishedAt.toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteUrl}/${defaultLocale}/blog/${post.slug}</guid>
      ${post.author ? `<author>${post.author.name}</author>` : ''}
      ${post.categories?.map((cat) => `<category>${cat.name}</category>`).join('\n      ') || ''}
      ${post.featuredImage ? `<enclosure url="${post.featuredImage.url}" type="image/jpeg"/>` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    // Return empty RSS feed on error
    const emptyRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>Latest posts from ${siteName}</description>
  </channel>
</rss>`

    return new Response(emptyRss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}
