/**
 * Sanity Studio Configuration
 * This file configures the Sanity Studio for Vista Store
 */

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '27p8z5ah'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Singleton document types
const singletonTypes = new Set(['homepage', 'siteSettings'])

export default defineConfig({
  name: 'default',
  title: 'Vista Store',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singletons
            S.listItem()
              .title('Homepage')
              .id('homepage')
              .child(
                S.document()
                  .schemaType('homepage')
                  .documentId('homepage')
              ),
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            // Regular document types
            ...S.documentTypeListItems().filter(
              (item) => !singletonTypes.has(item.getId() || '')
            ),
          ])
    }),
    presentationTool({
      previewUrl: {
        origin: 'http://localhost:3000',
        draftMode: {
          enable: '/api/draft',
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  basePath: '/studio',

  // CORS settings for local development and production
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://*.vercel.app',
      'https://vista-store.com',
      'https://www.vista-store.com',
    ],
    credentials: true,
  },
})
