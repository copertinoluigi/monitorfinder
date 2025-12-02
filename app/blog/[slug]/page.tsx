import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { ShoppingCart, Zap, Monitor } from 'lucide-react'

// Metadata Dinamici
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: post } = await supabase.from('posts').select('*').eq('slug', params.slug).single()
  if (!post) return { title: 'Articolo non trovato' }
  return {
    title: `${post.title} | Monitor Finder`,
    description: post.meta_description,
    openGraph: {
      title: post.title,
      description: post.meta_description,
      type: 'article',
      images: post.image_url ? [post.image_url] : []
    }
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { data: post } = await supabase.from('posts').select('*').eq('slug', params.slug).single()

  if (!post) notFound()

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      
      {/* 1. HEADER PRODOTTO */}
      <div className="text-center mb-10">
        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold mb-4 uppercase tracking-wide">
            {post.category || 'Recensione Tech'}
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-slate-900 leading-tight">
          {post.title.replace('Recensione:', '')}
        </h1>

        {/* TECH SPECS BADGE (Opzionale se presenti nel DB) */}
        <div className="flex justify-center gap-4 mb-8">
             {post.hertz && (
                 <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                    <Zap className="text-yellow-500" size={20}/>
                    <span className="font-bold text-slate-700">{post.hertz} Hz</span>
                 </div>
             )}
             {post.brand && (
                 <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                    <Monitor className="text-blue-500" size={20}/>
                    <span className="font-bold text-slate-700">{post.brand}</span>
                 </div>
             )}
        </div>

        {post.image_url && (
          <div className="relative w-full h-72 md:h-[450px] rounded-2xl overflow-hidden shadow-lg mb-8 bg-white border border-slate-100 p-8">
            <Image 
              src={post.image_url} 
              alt={post.title} 
              fill 
              className="object-contain hover:scale-105 transition duration-700"
              priority 
            />
          </div>
        )}
      </div>

      {/* 2. CONTENUTO AI */}
      <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-li:marker:text-primary">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* 3. CTA AMAZON */}
      {post.amazon_link && (
        <div className="mt-16 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-center shadow-xl text-white">
          <h3 className="text-2xl font-bold mb-4 text-white">Il verdetto finale?</h3>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Verifica la disponibilità immediata e leggi le recensioni degli utenti reali su Amazon.
          </p>
          <a 
            href={post.amazon_link} 
            target="_blank" 
            rel="nofollow sponsored"
            className="inline-flex items-center gap-3 bg-[#FF9900] hover:bg-[#ff8c00] text-black text-xl font-bold px-10 py-5 rounded-xl transition transform hover:scale-105 shadow-lg shadow-orange-500/20"
          >
            <ShoppingCart size={24} />
            Vedi Prezzo su Amazon
          </a>
          <p className="text-xs text-slate-500 mt-6">Partecipiamo al Programma Affiliazione Amazon EU.</p>
        </div>
      )}
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": post.title.replace('Recensione:', '').trim(),
      "image": post.image_url,
      "description": post.meta_description,
      "brand": {
        "@type": "Brand",
        "name": post.brand || "Generic"
      },
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "4.5", // Potresti chiedere all'AI di generare un voto numerico
          "bestRating": "5"
        },
        "author": {
          "@type": "Organization",
          "name": "Monitor Finder Team"
        }
      }
    })
  }}
/>
    </article>
  )
}
