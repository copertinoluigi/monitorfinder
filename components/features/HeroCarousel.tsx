'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'

export default function HeroCarousel({ posts }: { posts: any[] }) {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-play (si ferma se passi il mouse sopra)
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [posts.length, isHovered])

  const next = () => setCurrent(current === posts.length - 1 ? 0 : current + 1)
  const prev = () => setCurrent(current === 0 ? posts.length - 1 : current - 1)

  if (posts.length === 0) return null

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto px-4 mt-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container Principale: Altezza ridotta su Desktop (380px) e fissa su Mobile (480px) */}
      <div className="relative h-[480px] md:h-[380px] rounded-2xl overflow-hidden bg-slate-900 text-white shadow-xl border border-slate-800">
        
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === current ? 'opacity-100 z-20' : 'opacity-0 z-10'
            }`}
          >
            {/* Background Sfumato */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 z-0" />
            
            {/* GRIGLIA LAYOUT: Mobile colonna, Desktop riga */}
            <div className="relative z-30 h-full flex flex-col md:flex-row items-center justify-between p-6 md:p-10 gap-6">
              
              {/* 1. LATO TESTO (Ordine 2 su Mobile, 1 su Desktop) */}
              <div className="flex-1 order-2 md:order-1 text-center md:text-left w-full space-y-3 md:space-y-5 mt-[-20px] md:mt-0">
                
                {/* Badge Categoria */}
                <div className="flex items-center justify-center md:justify-start gap-2">
                   <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                     {post.category || 'Recensione'}
                   </span>
                   {post.hertz > 0 && (
                     <span className="text-yellow-400 text-xs font-bold flex items-center gap-1">
                       <Zap size={12} fill="currentColor"/> {post.hertz}Hz
                     </span>
                   )}
                </div>

                {/* Titolo */}
                <Link href={`/blog/${post.slug}`} className="block group">
                    <h2 className="text-2xl md:text-4xl font-extrabold leading-tight group-hover:text-blue-400 transition line-clamp-2 md:line-clamp-2">
                      {post.title.replace(/Recensione:?/i, '').trim()}
                    </h2>
                </Link>
                
                {/* Descrizione (Solo Desktop per risparmiare spazio mobile) */}
                <p className="hidden md:block text-slate-400 text-sm md:text-base max-w-md line-clamp-2">
                    {post.meta_description || "Leggi la nostra analisi tecnica completa, specifiche e verdetto finale."}
                </p>

                {/* Bottoni e Prezzo */}
                <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="bg-white text-slate-900 hover:bg-blue-50 px-5 py-2 md:px-6 md:py-2.5 rounded-lg font-bold text-sm md:text-base transition shadow-lg"
                    >
                      Leggi Tutto
                    </Link>
                    <span className="text-lg md:text-xl font-bold text-white border border-slate-700 px-4 py-2 rounded-lg bg-slate-800/50">
                        € {post.price}
                    </span>
                </div>
              </div>

              {/* 2. LATO IMMAGINE (Ordine 1 su Mobile, 2 su Desktop) */}
              <div className="flex-1 order-1 md:order-2 w-full flex justify-center md:justify-end items-center h-[180px] md:h-full">
                {/* BOX BIANCO RIDIMENSIONATO */}
                <div className="relative w-[220px] h-[160px] md:w-[380px] md:h-[260px] bg-white rounded-xl shadow-lg border-4 border-slate-800/50 flex items-center justify-center overflow-hidden">
                    {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          className="object-contain p-3 md:p-5 hover:scale-105 transition duration-500"
                          priority={index === 0} // Carica subito la prima immagine
                        />
                    ) : (
                        <span className="text-slate-300 text-xs">No Image</span>
                    )}
                </div>
              </div>

            </div>
          </div>
        ))}

        {/* Pulsanti Navigazione (Più discreti) */}
        <button 
            onClick={prev} 
            className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition"
            aria-label="Precedente"
        >
          <ChevronLeft size={28} />
        </button>
        <button 
            onClick={next} 
            className="absolute right-2 top-1/2 -translate-y-1/2 z-40 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition"
            aria-label="Successivo"
        >
          <ChevronRight size={28} />
        </button>

        {/* Pallini (Posizionati in basso al centro) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 flex gap-1.5">
            {posts.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${
                idx === current ? 'bg-blue-500 w-6' : 'bg-slate-700 w-1.5 hover:bg-slate-500'
                }`}
                aria-label={`Vai alla slide ${idx + 1}`}
            />
            ))}
        </div>
      </div>
    </div>
  )
}
