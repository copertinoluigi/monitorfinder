import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://monitorfinder.it' // CAMBIA QUESTO col dominio finale

  // 1. Prendi tutti gli slug dei post
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, created_at')
    .eq('is_published', true)

  const postEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // 2. Prendi tutti i prodotti del finder (opzionale, se avessero pagine dedicate)
  // Per ora il finder è una pagina sola, quindi mettiamo le pagine statiche

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/finder`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  return [...staticPages, ...postEntries]
}
