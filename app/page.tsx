import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import HeroCarousel from '@/components/features/HeroCarousel'
import { Monitor, Zap, ShieldCheck, Search, ArrowRight } from 'lucide-react'

export const revalidate = 0 // Aggiorna i dati ad ogni visita (o imposta 3600 per 1 ora)

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
      
      {/* 2. CAROSELLO DINAMICO */}
      <section>
        <HeroCarousel posts={latestPosts || []} />
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Trova il tuo setup ideale</h2>
          <p className="text-slate-500 mt-2">Tecnologia, prestazioni e prezzi a confronto.</p>
        </div>
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
            desc="Acquista tramite la piattaforma più sicura al mondo. Spedizioni tracciate e garanzia clienti."
          />
        </div>

        {/* CTA CENTRALE */}
        <div className="mt-16 text-center">
            <Link href="/finder" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
                <Search size={20}/> Vai al Finder Completo
            </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({icon, title, desc}: {icon: any, title: string, desc: string}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition duration-300">
      <div className="mb-4 bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-blue-100">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  )
}
