import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Prendi tutti i monitor pubblicati
  const { data: posts } = await supabase.from('posts').select('slug, created_at').eq('is_published', true)

  const monitorEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `https://monitorfinder.it/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: 'https://monitorfinder.it',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://monitorfinder.it/finder',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...monitorEntries,
  ]
}
