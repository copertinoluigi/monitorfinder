import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import HeroCarousel from '@/components/features/HeroCarousel'
import { Monitor, Zap, ShieldCheck, Search, Cpu } from 'lucide-react'

export const revalidate = 0 

export default async function Homepage() {
  const { data: latestPosts } = await supabase
    .from('posts')
    .select('id, title, slug, image_url, price, hertz, category')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="overflow-hidden bg-slate-50">
      
      {/* 1. HERO SECTION STATICA */}
      {/* Aumentato pb-32 per dare spazio al carosello che sale */}
      <section className="relative bg-slate-950 pt-20 pb-40 px-4 overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
           
           <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
              <Cpu size={14} /> Database aggiornato oggi
           </div>
           
           <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Scegli il Monitor <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Senza Compromessi.
              </span>
           </h1>
           
           {/* QUESTO ERA IL TESTO MANCANTE */}
           <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Analisi tecniche reali basate su IA. Confronta Hz, pannelli e prezzi per trovare il display perfetto per Gaming e Ufficio.
           </p>

           {/* QUESTI ERANO I BOTTONI MANCANTI */}
           <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/finder" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold px-8 py-4 rounded-xl transition transform hover:scale-105 shadow-lg shadow-blue-600/25">
                 <Search size={20} /> Trova Monitor
              </Link>
              <Link href="/blog" className="flex items-center justify-center gap-2 bg-white/10 border border-white/10 hover:bg-white/20 text-white text-lg font-bold px-8 py-4 rounded-xl transition backdrop-blur-sm">
                 Ultime Recensioni
              </Link>
           </div>
        </div>
      </section>

      {/* 2. CAROSELLO SLIM */}
      {/* Sale di 100px sopra la Hero (-mt-24) */}
      <section className="relative z-20 mt-[-100px] mb-20">
         <div className="text-center mb-2">
            <span className="inline-block bg-slate-900 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-t-lg border-t border-x border-slate-800 uppercase tracking-widest shadow-xl">
               In Evidenza
            </span>
         </div>
         <HeroCarousel posts={latestPosts || []} />
      </section>

      {/* 3. FEATURES */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Monitor className="w-8 h-8 text-blue-600" />}
            title="Database Tecnico"
            desc="Filtra per Refresh Rate (Hz), Brand e Prezzo. Trova subito se è un pannello IPS, VA o TN."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-yellow-500" />}
            title="Analisi AI Hardware"
            desc="Il nostro algoritmo legge le specifiche complesse e ti dice chiaramente se va bene per PS5, Xbox o PC."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
            title="Sicurezza Amazon"
            desc="Monitoriamo solo prodotti disponibili su Amazon con Prime, per garantirti reso facile e spedizione rapida."
          />
        </div>
      </section>

    </div>
  )
}

function FeatureCard({icon, title, desc}: {icon: any, title: string, desc: string}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition duration-300">
      <div className="mb-4 bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-blue-100 text-blue-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  )
}
