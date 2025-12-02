declare module '@sanity/image-url' {
  import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
  import type {
    ImageUrlBuilder,
    SanityClientLike,
  } from '@sanity/image-url/lib/types/builder'

  export default function createImageUrlBuilder(
    options: SanityClientLike
  ): ImageUrlBuilder

  export type { ImageUrlBuilder, SanityImageSource }
}
