'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'

export default function HeroCarousel({ posts }: { posts: any[] }) {
  const [current, setCurrent] = useState(0)

  // Auto-play ogni 5 secondi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [posts.length])

  const next = () => setCurrent(current === posts.length - 1 ? 0 : current + 1)
  const prev = () => setCurrent(current === 0 ? posts.length - 1 : current - 1)

  if (posts.length === 0) return null

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-slate-900 text-white">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background con gradiente scuro tech */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-blue-900/30 z-10" />
          
          {/* Immagine di Sfondo (sfocata) */}
          {post.image_url && (
             <Image
             src={post.image_url}
             alt={post.title}
             fill
             className="object-cover opacity-20 blur-sm"
           />
          )}

          {/* Contenuto Hero */}
          <div className="relative z-20 container mx-auto px-4 h-full flex flex-col-reverse md:flex-row items-center justify-center md:justify-between gap-8">
            
            {/* Testo */}
            <div className="flex-1 space-y-6 text-center md:text-left pt-8 md:pt-0">
              <span className="inline-block px-3 py-1 bg-blue-600 text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                Novità {post.category}
              </span>
              <h2 className="text-3xl md:text-6xl font-extrabold leading-tight line-clamp-2">
                {post.title.replace(/Recensione:?/i, '')}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-4 text-slate-300">
                <span className="flex items-center gap-1"><Zap className="text-yellow-400" size={20}/> {post.hertz} Hz</span>
                <span className="text-xl font-bold text-white">€ {post.price}</span>
              </div>
              <div className="pt-4">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="bg-white text-slate-900 hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-lg transition shadow-lg inline-block"
                >
                  Leggi Recensione
                </Link>
              </div>
            </div>

            {/* Immagine Prodotto (Nitida) */}
            <div className="flex-1 relative w-full h-[250px] md:h-[400px]">
              {post.image_url && (
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  className="object-contain drop-shadow-2xl hover:scale-105 transition duration-700"
                />
              )}
            </div>

          </div>
        </div>
      ))}

      {/* Frecce Navigazione */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition">
        <ChevronLeft size={32} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition">
        <ChevronRight size={32} />
      </button>

      {/* Pallini indicatori */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {posts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current ? 'bg-blue-500 w-8' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
