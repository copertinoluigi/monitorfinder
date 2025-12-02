import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Post } from '@/types'

// Revalidate ogni ora (ISR)
export const revalidate = 0

export default async function BlogIndex() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Guide & Recensioni</h1>
      <div className="grid gap-8">
        {posts?.map((post: Post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
            <article className="bg-white p-6 rounded-xl shadow-sm border hover:border-yellow-400 transition">
              <h2 className="text-xl font-bold group-hover:text-yellow-600 transition">{post.title}</h2>
              <p className="text-slate-600 mt-2 line-clamp-2">{post.meta_description}</p>
              <span className="text-xs text-slate-400 mt-4 block">
                {new Date(post.created_at).toLocaleDateString('it-IT')}
              </span>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}
