'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { Filter, ChevronDown, ExternalLink, Monitor, Zap, Maximize, Search } from 'lucide-react'

// Aggiorniamo il tipo Post per i Monitor
type Post = {
  id: string; 
  title: string; 
  slug: string;
  price: number; 
  brand: string;   // ex rooms
  hertz: number;   // ex sqm
  category: string;
  image_url: string; 
  amazon_link: string;
}

export default function FinderPage() {
  const [items, setItems] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  
  // NUOVI FILTRI
  const [maxPrice, setMaxPrice] = useState(2000) // Default budget monitor
  const [minHertz, setMinHertz] = useState(0)
  const [selectedBrand, setSelectedBrand] = useState('')
  const [category, setCategory] = useState('')
  
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      
      let query = supabase.from('posts')
        .select('id, title, slug, price, brand, hertz, category, image_url, amazon_link')
        .eq('is_published', true)
        
      if (maxPrice) query = query.lte('price', maxPrice)
      if (minHertz) query = query.gte('hertz', minHertz)
      if (selectedBrand) query = query.eq('brand', selectedBrand) // Match esatto brand
      if (category) query = query.eq('category', category)

      // Ordina per ultimi inseriti
      query = query.order('created_at', { ascending: false })

      const { data } = await query
      if (data) setItems(data as Post[])
      setLoading(false)
    }
    fetchPosts()
  }, [maxPrice, minHertz, selectedBrand, category])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
               <Search className="text-blue-600" /> Monitor Finder
            </h1>
            <p className="text-slate-500">
                Confronta refresh rate, risoluzioni e prezzi dei migliori monitor sul mercato.
            </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTRI */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 sticky top-24">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center justify-between w-full lg:hidden font-bold text-slate-700">
                <span className="flex items-center gap-2"><Filter size={20} /> Filtri Avanzati</span>
                <ChevronDown className={`transform transition ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <div className={`mt-4 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                
                {/* Filtro Prezzo */}
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block flex justify-between">
                    <span>Budget Max</span>
                    <span className="text-blue-600">€ {maxPrice.toLocaleString()}</span>
                  </label>
                  <input 
                    type="range" min="100" max="3000" step="50" 
                    value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} 
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>€100</span>
                    <span>€3000+</span>
                  </div>
                </div>

                {/* Filtro Hertz (Refresh Rate) */}
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Refresh Rate Minimo</label>
                  <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setMinHertz(Number(e.target.value))}>
                    <option value="0">Tutti</option>
                    <option value="60">60 Hz (Standard)</option>
                    <option value="144">144 Hz (Gaming)</option>
                    <option value="165">165 Hz (Gaming+)</option>
                    <option value="240">240 Hz (Competitive)</option>
                  </select>
                </div>

                {/* Filtro Brand */}
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Brand</label>
                  <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setSelectedBrand(e.target.value)}>
                     <option value="">Tutti i Brand</option>
                     <option value="LG">LG</option>
                     <option value="Samsung">Samsung</option>
                     <option value="ASUS">ASUS</option>
                     <option value="Dell">Dell / Alienware</option>
                     <option value="MSI">MSI</option>
                     <option value="BenQ">BenQ</option>
                   </select>
                </div>

                {/* Filtro Categoria */}
                <div>
                   <label className="text-sm font-bold text-slate-700 mb-2 block">Categoria</label>
                   <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setCategory(e.target.value)}>
                     <option value="">Tutte</option>
                     <option value="Gaming">Gaming</option>
                     <option value="Ufficio">Ufficio / Productivity</option>
                     <option value="Ultrawide">Ultrawide</option>
                     <option value="4K">4K / Creatives</option>
                   </select>
                </div>
              </div>
            </div>
          </aside>

          {/* RISULTATI */}
          <main className="w-full lg:w-3/4">
            {loading ? <p className="text-center py-20 text-slate-500">Scansione database in corso...</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition border border-slate-100 flex flex-col group">
                    <Link href={`/blog/${item.slug}`} className="relative h-52 w-full bg-white p-4 overflow-hidden block border-b border-slate-50">
                      {item.image_url ? (
                        // object-contain è fondamentale per i monitor per non tagliare i bordi
                        <Image src={item.image_url} alt={item.title} fill className="object-contain p-2 group-hover:scale-105 transition duration-500" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-300"><Monitor size={48}/></div>
                      )}
                      
                      {/* Badge Prezzo */}
                      <div className="absolute top-3 right-3 bg-blue-600 text-white font-bold px-3 py-1 rounded-full shadow-lg text-sm">
                        € {item.price > 0 ? item.price.toLocaleString() : 'N.D.'}
                      </div>
                    </Link>
                    
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Categoria Badge */}
                        <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">{item.category}</span>
                        
                        <Link href={`/blog/${item.slug}`}>
                            <h3 className="font-bold text-lg text-slate-900 line-clamp-2 hover:text-blue-600 transition leading-tight">
                                {item.title.replace(/Recensione:?/i, '').trim()}
                            </h3>
                        </Link>
                        
                        {/* Specifiche Tecniche */}
                        <div className="flex gap-4 text-sm text-slate-600 mt-4 mb-4">
                          <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                            <Zap size={16} className="text-yellow-500 fill-yellow-500"/> 
                            <span className="font-medium">{item.hertz} Hz</span>
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                            <Monitor size={16} className="text-blue-500"/> 
                            <span className="font-medium">{item.brand}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-2">
                         <Link href={`/blog/${item.slug}`} className="flex items-center justify-center py-2.5 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition text-sm">
                            Recensione
                         </Link>
                         <a href={item.amazon_link} target="_blank" className="flex items-center justify-center gap-2 bg-[#FF9900] hover:bg-[#ff8c00] text-black font-bold rounded-xl transition text-sm shadow-sm hover:shadow-md">
                            Amazon <ExternalLink size={14}/>
                         </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && items.length === 0 && (
              <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-xl">
                 <Monitor className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                 <h3 className="text-lg font-bold text-slate-900">Nessun monitor trovato</h3>
                 <p className="text-slate-500">Prova a modificare i filtri di ricerca.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}