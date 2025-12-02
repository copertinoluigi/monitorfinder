'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'

export default function HeroCarousel({ posts }: { posts: any[] }) {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(timer)
  }, [posts.length, isHovered])

  const next = () => setCurrent(current === posts.length - 1 ? 0 : current + 1)
  const prev = () => setCurrent(current === 0 ? posts.length - 1 : current - 1)

  if (posts.length === 0) return null

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto px-4" // Ridotto max-width a 5xl
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Altezza ridotta drasticamente: 300px desktop */}
      <div className="relative h-[450px] md:h-[300px] rounded-2xl overflow-hidden bg-slate-900 text-white shadow-2xl border border-slate-800">
        
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === current ? 'opacity-100 z-20' : 'opacity-0 z-10'
            }`}
          >
            {/* Background Sfumato */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 z-0" />
            
            <div className="relative z-30 h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 gap-4 md:gap-8">
              
              {/* LATO TESTO */}
              <div className="flex-1 w-full text-center md:text-left mt-6 md:mt-0 space-y-2 md:space-y-3">
                
                {/* Badge piccolissimi */}
                <div className="flex items-center justify-center md:justify-start gap-2">
                   <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                     {post.category}
                   </span>
                   {post.hertz > 0 && (
                     <span className="text-yellow-400 text-xs font-bold flex items-center gap-1">
                       <Zap size={12} fill="currentColor"/> {post.hertz}Hz
                     </span>
                   )}
                </div>

                <Link href={`/blog/${post.slug}`} className="block group">
                    {/* Font ridotto a 3xl */}
                    <h2 className="text-xl md:text-3xl font-extrabold leading-tight group-hover:text-blue-400 transition line-clamp-2">
                      {post.title.replace(/Recensione:?/i, '').trim()}
                    </h2>
                </Link>
                
                {/* Prezzo e Bottone compatti */}
                <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="bg-white text-slate-900 hover:bg-blue-50 px-4 py-1.5 rounded-lg font-bold text-sm transition shadow-lg"
                    >
                      Leggi
                    </Link>
                    <span className="text-lg font-bold text-white">
                        € {post.price}
                    </span>
                </div>
              </div>

              {/* LATO IMMAGINE */}
              <div className="flex-1 w-full flex justify-center md:justify-end items-center h-[200px] md:h-full pb-4 md:pb-0">
                {/* Box Bianco più piccolo (240x180 su desktop) */}
                <div className="relative w-[200px] h-[150px] md:w-[280px] md:h-[200px] bg-white rounded-xl shadow-lg border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                    {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          className="object-contain p-3 hover:scale-105 transition duration-500"
                        />
                    ) : (
                        <span className="text-slate-300 text-xs">No Image</span>
                    )}
                </div>
              </div>

            </div>
          </div>
        ))}

        {/* Frecce laterali */}
        <button onClick={prev} className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 z-40 p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition">
          <ChevronLeft size={24} />
        </button>
        <button onClick={next} className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 z-40 p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition">
          <ChevronRight size={24} />
        </button>

        {/* Pallini */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 flex gap-1">
            {posts.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1 rounded-full transition-all ${
                idx === current ? 'bg-blue-500 w-4' : 'bg-slate-700 w-1'
                }`}
            />
            ))}
        </div>
      </div>
    </div>
  )
}
