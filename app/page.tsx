import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import HeroCarousel from '@/components/features/HeroCarousel'
import { Monitor, Zap, ShieldCheck, Search, ArrowRight, Cpu } from 'lucide-react'

export const revalidate = 0 

export default async function Homepage() {
  // 1. Fetch Ultimi 5 Post per il Carosello
  const { data: latestPosts } = await supabase
    .from('posts')
    .select('id, title, slug, image_url, price, hertz, category')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="overflow-hidden bg-slate-50">
      
      {/* 1. HERO SECTION STATICA */}
      <section className="relative bg-slate-950 pt-16 pb-24 px-4 overflow-hidden">
        {/* ... (Contenuto Hero invariato, Background etc) ... */}
           
           {/* Titoli e testi Hero... */}
           <div className="relative max-w-4xl mx-auto text-center space-y-6 z-10">
               {/* ... (lascia tutto uguale qui) ... */}
               <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-tight"> {/* Ho ridotto leggermente il font mobile */}
                  Scegli il Monitor <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Senza Compromessi.
                  </span>
               </h1>
               {/* ... */}
           </div>
      </section>

      {/* 2. CAROSELLO COMPACT */}
      {/* Su mobile margine normale, su desktop sale un po' (-mt-16) per effetto sovrapposizione */}
      <section className="relative z-20 mt-[-40px] md:mt-[-80px] mb-16">
         <div className="text-center mb-2">
            <span className="inline-block bg-slate-900 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-t-lg border-t border-x border-slate-800 uppercase tracking-widest shadow-lg">
               Appena Recensiti
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
