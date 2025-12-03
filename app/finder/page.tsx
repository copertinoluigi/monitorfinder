'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { Filter, ChevronDown, ExternalLink, Monitor, Zap, Maximize, Search, Grid } from 'lucide-react'

type Post = {
  id: string; title: string; slug: string; price: number; brand: string; hertz: number; category: string;
  image_url: string; amazon_link: string; screen_size: string; resolution: string;
}

export default function FinderPage() {
  const [items, setItems] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  
  // FILTRI
  const [maxPrice, setMaxPrice] = useState(2000)
  const [minHertz, setMinHertz] = useState(0)
  const [selectedBrand, setSelectedBrand] = useState('')
  const [category, setCategory] = useState('')
  // Nuovi Filtri
  const [selectedSize, setSelectedSize] = useState('') 
  const [selectedRes, setSelectedRes] = useState('')   
  
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      
      let query = supabase.from('posts')
        .select('id, title, slug, price, brand, hertz, category, image_url, amazon_link, screen_size, resolution')
        .eq('is_published', true)
        .eq('show_in_finder', true) // ESCLUDE I MANUALI
        
      if (maxPrice) query = query.lte('price', maxPrice)
      if (minHertz) query = query.gte('hertz', minHertz)
      if (selectedBrand) query = query.ilike('brand', `%${selectedBrand}%`)
      if (category) query = query.eq('category', category)
      // Nuovi filtri (ilike permette ricerca parziale)
      if (selectedSize) query = query.ilike('screen_size', `%${selectedSize}%`)
      if (selectedRes) query = query.ilike('resolution', `%${selectedRes}%`)

      query = query.order('created_at', { ascending: false })

      const { data } = await query
      if (data) setItems(data as Post[])
      setLoading(false)
    }
    fetchPosts()
  }, [maxPrice, minHertz, selectedBrand, category, selectedSize, selectedRes])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
               <Search className="text-blue-600" /> Monitor Finder
            </h1>
            <p className="text-slate-500">Confronta Hz, risoluzioni e dimensioni.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTRI */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 sticky top-24">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center justify-between w-full lg:hidden font-bold text-slate-700">
                <span className="flex items-center gap-2"><Filter size={20} /> Filtri</span>
                <ChevronDown className={`transform transition ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <div className={`mt-4 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                
                {/* Budget */}
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 flex justify-between">
                    <span>Budget Max</span><span className="text-blue-600">€ {maxPrice}</span>
                  </label>
                  <input type="range" min="100" max="3000" step="50" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg" />
                </div>

                {/* Taglia (NUOVO) */}
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Dimensioni</label>
                  <select className="w-full p-2.5 border rounded-lg bg-slate-50" onChange={e => setSelectedSize(e.target.value)}>
                    <option value="">Tutte</option>
                    <option value="24">24 Pollici</option>
                    <option value="27">27 Pollici</option>
                    <option value="32">32 Pollici</option>
                    <option value="34">34 Pollici (Ultrawide)</option>
                  </select>
                </div>

                {/* Risoluzione (NUOVO) */}
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Risoluzione</label>
                  <select className="w-full p-2.5 border rounded-lg bg-slate-50" onChange={e => setSelectedRes(e.target.value)}>
                    <option value="">Tutte</option>
                    <option value="1080">FHD (1080p)</option>
                    <option value="1440">QHD (2K / 1440p)</option>
                    <option value="4K">UHD (4K)</option>
                  </select>
                </div>

                {/* Refresh Rate */}
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Hz Minimi</label>
                  <select className="w-full p-2.5 border rounded-lg bg-slate-50" onChange={e => setMinHertz(Number(e.target.value))}>
                    <option value="0">Tutti</option>
                    <option value="144">144 Hz</option>
                    <option value="165">165 Hz</option>
                    <option value="240">240 Hz</option>
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Brand</label>
                  <input type="text" placeholder="Es. LG, Asus..." className="w-full p-2.5 border rounded-lg" onChange={e => setSelectedBrand(e.target.value)} />
                </div>
              </div>
            </div>
          </aside>

          {/* RISULTATI */}
          <main className="w-full lg:w-3/4">
            {loading ? <p className="text-center py-20">Caricamento...</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition border border-slate-100 flex flex-col group">
                    <Link href={`/blog/${item.slug}`} className="relative h-52 w-full bg-white p-4 overflow-hidden block border-b border-slate-50">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.title} fill className="object-contain p-2 group-hover:scale-105 transition" />
                      ) : ( <div className="flex items-center justify-center h-full text-slate-300"><Monitor size={48}/></div> )}
                      <div className="absolute top-3 right-3 bg-blue-600 text-white font-bold px-3 py-1 rounded-full text-sm">€ {item.price}</div>
                    </Link>
                    
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">{item.category}</span>
                        <Link href={`/blog/${item.slug}`}>
                            <h3 className="font-bold text-lg text-slate-900 line-clamp-2 hover:text-blue-600 transition leading-tight mt-1">{item.title.replace(/Recensione:?/i, '').trim()}</h3>
                        </Link>
                        
                        {/* SPECIFICHE COMPATTE */}
                        <div className="flex flex-wrap gap-2 text-xs text-slate-600 mt-4 mb-4">
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><Zap size={14} className="text-yellow-500"/> {item.hertz}Hz</span>
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><Maximize size={14} className="text-blue-500"/> {item.screen_size || '- '}"</span>
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><Grid size={14} className="text-purple-500"/> {item.resolution || '-'}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-2">
                         <Link href={`/blog/${item.slug}`} className="flex items-center justify-center py-2.5 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 text-sm">Recensione</Link>
                         <a href={item.amazon_link} target="_blank" className="flex items-center justify-center gap-2 bg-[#FF9900] hover:bg-[#ff8c00] text-black font-bold rounded-xl text-sm">Amazon <ExternalLink size={14}/></a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
