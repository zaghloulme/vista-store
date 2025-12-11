/**
 * Sanity Presentation Resolver
 * Maps Sanity documents to Next.js preview URLs
 */

export const resolve = {
    locations: {
        // Map homepage document to root URL
        homepage: {
            select: {
                title: 'title',
            },
            resolve: () => ({
                locations: [
                    {
                        title: 'Homepage',
                        href: '/',
                    },
                ],
            }),
        },

        // Map product documents to product detail pages
        product: {
            select: {
                slug: 'slug.current',
                title: 'name',
            },
            resolve: (doc: any) => ({
                locations: [
                    {
                        title: doc?.title || 'Product',
                        href: `/products/${doc?.slug}`,
                    },
                ],
            }),
        },

        // Map category documents to category pages
        category: {
            select: {
                slug: 'slug.current',
                title: 'name',
            },
            resolve: (doc: any) => ({
                locations: [
                    {
                        title: doc?.title || 'Category',
                        href: `/products?category=${doc?.slug}`,
                    },
                ],
            }),
        },

        // Site settings - preview on homepage
        siteSettings: {
            select: {
                title: 'siteName',
            },
            resolve: () => ({
                locations: [
                    {
                        title: 'Site Settings (Homepage)',
                        href: '/',
                    },
                ],
            }),
        },
    },
}
