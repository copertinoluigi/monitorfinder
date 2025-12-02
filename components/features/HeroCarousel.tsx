'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Zap, Star } from 'lucide-react'

export default function HeroCarousel({ posts }: { posts: any[] }) {
  const [current, setCurrent] = useState(0)

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1))
    }, 6000) // Rallentato leggermente a 6s per leggibilità
    return () => clearInterval(timer)
  }, [posts.length])

  const next = () => setCurrent(current === posts.length - 1 ? 0 : current + 1)
  const prev = () => setCurrent(current === 0 ? posts.length - 1 : current - 1)

  if (posts.length === 0) return null

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-8 px-4">
      {/* Container del Carosello con bordi arrotondati */}
      <div className="relative h-[450px] md:h-[500px] rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl border border-slate-800">
        
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Pattern Tecnico Sottile */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-950 z-0" />
            
            <div className="container mx-auto px-6 md:px-12 relative z-20 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16 w-full">
              
              {/* LATO SINISTRO: TESTO */}
              <div className="flex-1 text-center md:text-left space-y-4 md:space-y-6">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                   <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                     {post.category || 'Featured'}
                   </span>
                   {post.hertz > 120 && (
                     <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                       <Zap size={12} fill="black"/> {post.hertz}Hz
                     </span>
                   )}
                </div>

                <Link href={`/blog/${post.slug}`} className="block group">
                    <h2 className="text-2xl md:text-5xl font-extrabold leading-tight group-hover:text-blue-400 transition">
                    {post.title.replace(/Recensione:?/i, '').trim()}
                    </h2>
                </Link>
                
                <p className="hidden md:block text-slate-400 text-lg max-w-lg">
                    Scopri le specifiche complete, i pro e i contro nella nostra recensione tecnica dettagliata.
                </p>

                <div className="pt-2 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                    <Link 
                    href={`/blog/${post.slug}`}
                    className="bg-white text-slate-900 hover:bg-blue-50 px-8 py-3 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2"
                    >
                    Leggi Recensione
                    </Link>
                    <span className="flex items-center justify-center gap-1 text-xl font-bold text-white border border-slate-700 px-6 py-3 rounded-xl bg-slate-800/50">
                        € {post.price}
                    </span>
                </div>
              </div>

              {/* LATO DESTRO: IMMAGINE NEL RIQUADRO */}
              <div className="flex-1 w-full flex justify-center md:justify-end">
                {/* IL RIQUADRO BIANCO CHE CHIEDEVI */}
                <div className="relative w-[280px] h-[200px] md:w-[450px] md:h-[320px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 border-4 border-slate-800/50 flex items-center justify-center">
                    {post.image_url ? (
                        <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-contain p-4 hover:scale-105 transition duration-500"
                        />
                    ) : (
                        <div className="text-slate-300">No Image</div>
                    )}
                </div>
              </div>

            </div>
          </div>
        ))}

        {/* Pulsanti Navigazione */}
        <button onClick={prev} className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition border border-white/10">
          <ChevronLeft size={24} />
        </button>
        <button onClick={next} className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition border border-white/10">
          <ChevronRight size={24} />
        </button>

        {/* Pallini */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {posts.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === current ? 'bg-blue-500 w-8' : 'bg-slate-600 w-2 hover:bg-slate-400'
                }`}
            />
            ))}
        </div>
      </div>
    </div>
  )
}
