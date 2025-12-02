import Link from 'next/link'
import { ArrowRight, Monitor, Zap, ShieldCheck, Search } from 'lucide-react'

export default function Homepage() {
  return (
    <div className="overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative bg-slate-950 text-white py-20 md:py-32 px-4">
        {/* Tech Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-block bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-full px-4 py-1.5 text-sm font-medium text-blue-400 mb-4">
            🎮 Level Up Your Setup
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Il Monitor Perfetto <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              non deve costare una fortuna.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Confronta Hz, risoluzione e prezzi dei migliori monitor Gaming e Ufficio. 
            L'intelligenza artificiale analizza le specifiche tecniche per te.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 px-4">
            <Link href="/finder" className="w-full sm:w-auto bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-blue-500 transition transform hover:scale-105 shadow-lg shadow-blue-500/25 text-center flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Trova Monitor
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto bg-white/5 border border-white/10 backdrop-blur-sm text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition text-center">
              Come funziona?
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-slate-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Perché usare Monitor Finder?</h2>
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
            desc="Il nostro algoritmo legge le specifiche complesse e ti dice chiaramente se va bene per PS5, Xbox o PC High-End."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
            title="Affidabilità Amazon"
            desc="Selezioniamo solo monitor disponibili su Amazon con Prime, per garantirti reso facile e spedizione rapida."
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({icon, title, desc}: {icon: any, title: string, desc: string}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition duration-300">
      <div className="mb-4 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-100">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  )
}