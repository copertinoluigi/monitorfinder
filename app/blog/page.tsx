import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Monitor, ArrowRight } from 'lucide-react'

export const revalidate = 0 // Sempre fresco

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Recensioni & Guide</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Scopri le ultime analisi sui migliori monitor gaming e ufficio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 flex flex-col h-full group">
              
              {/* IMMAGINE STANDARDIZZATA */}
              {/* Aspect Ratio 16/9 o 4/3 con sfondo bianco e object-contain */}
              <Link href={`/blog/${post.slug}`} className="relative w-full aspect-[4/3] bg-white border-b border-slate-50 overflow-hidden">
                {post.image_url ? (
                  <Image 
                    src={post.image_url} 
                    alt={post.title} 
                    fill 
                    className="object-contain p-6 group-hover:scale-105 transition duration-500" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-slate-100 text-slate-300">
                    <Monitor size={48} />
                  </div>
                )}
                
                {/* Badge Categoria */}
                {post.category && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {post.category}
                    </div>
                )}
              </Link>

              {/* CONTENUTO CARD */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <Calendar size={14} />
                  {new Date(post.created_at).toLocaleDateString('it-IT')}
                </div>
                
                <Link href={`/blog/${post.slug}`} className="block mb-3">
                  <h2 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition">
                    {post.title.replace(/Recensione:?/i, '').trim()}
                  </h2>
                </Link>

                <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
                   {/* Usiamo la meta description o tronchiamo il contenuto se manca */}
                   {post.meta_description || "Leggi la recensione completa per scoprire specifiche, pro e contro."}
                </p>

                <Link href={`/blog/${post.slug}`} className="inline-flex items-center font-bold text-blue-600 hover:text-blue-800 transition mt-auto">
                  Leggi Recensione <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {posts?.length === 0 && (
            <div className="text-center py-20">
                <p className="text-slate-500">Nessuna recensione ancora disponibile.</p>
            </div>
        )}

      </div>
    </div>
  )
}
