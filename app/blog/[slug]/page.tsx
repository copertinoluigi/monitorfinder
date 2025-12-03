import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { ShoppingCart, Zap, Monitor, Maximize, Grid, CheckCircle2 } from 'lucide-react'
import ShareButtons from '@/components/features/ShareButtons'

// 1. METADATA GENERATION (SEO CHIRURGICA)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: post } = await supabase.from('posts').select('*').eq('slug', params.slug).single()
  
  if (!post) return { title: 'Articolo non trovato' }

  // Pulizia titolo (rimuove "Recensione:" se presente nel DB per evitare ripetizioni)
  const cleanTitle = post.title.replace('Recensione:', '').trim(); 
  
  // Costruzione Title Tag Ottimizzato
  // Se è un prodotto: "LG 27GN800: Recensione, Specifiche e Prezzo | Monitor Finder"
  // Se è un articolo manuale: "I migliori monitor 2024 | Monitor Finder"
  const seoTitle = post.show_in_finder 
    ? `${cleanTitle}: Recensione, Specifiche e Prezzo | Monitor Finder`
    : `${cleanTitle} | Monitor Finder`; 

  return {
    title: seoTitle,
    description: post.meta_description,
    openGraph: {
      title: seoTitle,
      description: post.meta_description,
      type: 'article',
      url: `https://monitorfinder.it/blog/${post.slug}`,
      images: post.image_url ? [post.image_url] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: post.meta_description,
      images: post.image_url ? [post.image_url] : [],
    }
  }
}

// 2. COMPONENTE PAGINA (DESIGN PRO)
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { data: post } = await supabase.from('posts').select('*').eq('slug', params.slug).single()

  if (!post) notFound()

  // Flag per capire se è un prodotto o un articolo manuale
  const isProduct = post.show_in_finder 

  return (
    <article className="min-h-screen bg-white">
      
      {/* HERO SECTION CON DATI TECNICI */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
          
          {/* COLONNA SX: Testo, Dati e CTA */}
          <div className="flex-1 space-y-6">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
               {post.category || 'Recensione'}
            </span>
            
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              {post.title.replace('Recensione:', '').trim()}
            </h1>

            {/* TECH GRID (Visibile solo se è un Prodotto) */}
            {isProduct && (
              <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-md">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg"><Zap size={20} className="text-yellow-600"/></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Refresh</p><p className="font-bold text-slate-900">{post.hertz} Hz</p></div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><Maximize size={20} className="text-blue-600"/></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Dimensione</p><p className="font-bold text-slate-900">{post.screen_size || '-'}"</p></div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg"><Grid size={20} className="text-purple-600"/></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Risoluzione</p><p className="font-bold text-slate-900">{post.resolution || '-'}</p></div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg"><CheckCircle2 size={20} className="text-green-600"/></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Prezzo</p><p className="font-bold text-slate-900">€ {post.price}</p></div>
                 </div>
              </div>
            )}

            {/* CTA TOP (Per conversione immediata) */}
            {post.amazon_link && (
                <div className="pt-4">
                    <a href={post.amazon_link} target="_blank" rel="nofollow sponsored" className="inline-flex items-center gap-2 bg-[#FF9900] hover:bg-[#ff8c00] text-slate-900 font-bold px-6 py-3 rounded-xl shadow-md transition transform hover:scale-105">
                        <ShoppingCart size={20}/> Guarda offerta su Amazon
                    </a>
                    <p className="text-xs text-slate-400 mt-2 ml-1">Verifica disponibilità e prezzo aggiornato.</p>
                </div>
            )}
          </div>

          {/* COLONNA DX: Immagine Grande */}
          <div className="flex-1 w-full flex justify-center">
             <div className="relative w-full aspect-[4/3] max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 flex items-center justify-center">
                {post.image_url ? (
                  <Image 
                    src={post.image_url} 
                    alt={post.title} 
                    fill 
                    className="object-contain p-4"
                    priority 
                  />
                ) : ( <Monitor size={64} className="text-slate-200"/> )}
             </div>
          </div>

        </div>
      </div>

      {/* CONTENUTO ARTICOLO */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ShareButtons slug={post.slug} title={post.title} />

        <div className="prose prose-lg prose-slate max-w-none 
          prose-headings:font-bold prose-headings:text-slate-900 
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-li:marker:text-blue-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-lg">
          
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* CTA BOTTOM (Recap finale) */}
        {post.amazon_link && (
          <div className="mt-16 p-8 bg-slate-900 rounded-2xl text-center shadow-xl text-white">
            <h3 className="text-2xl font-bold mb-4">Verdetto Finale</h3>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Non perdere l'occasione. Controlla subito se è ancora disponibile o se è in sconto.
            </p>
            <a 
              href={post.amazon_link} 
              target="_blank" 
              rel="nofollow sponsored"
              className="inline-flex items-center gap-3 bg-[#FF9900] hover:bg-[#ff8c00] text-black text-xl font-bold px-10 py-5 rounded-xl transition transform hover:scale-105"
            >
              <ShoppingCart size={24} />
              Vedi Prezzo su Amazon
            </a>
          </div>
        )}
      </div>

      {/* DATI STRUTTURATI (SCHEMA MARKUP PER GOOGLE) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
            __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": isProduct ? "Product" : "Article",
            "name": cleanTitle,
            "image": post.image_url,
            "description": post.meta_description,
            ...(isProduct && {
                "brand": { "@type": "Brand", "name": post.brand || "Generic" },
                "offers": { "@type": "Offer", "price": post.price, "priceCurrency": "EUR", "url": post.amazon_link },
                "review": {
                    "@type": "Review",
                    "reviewRating": { "@type": "Rating", "ratingValue": "4.5", "bestRating": "5" },
                    "author": { "@type": "Organization", "name": "Monitor Finder Team" }
                }
            })
            })
        }}
      />
    </article>
  )
}
