import Link from 'next/link'
import { Search, Bot, ShoppingCart, ArrowRight } from 'lucide-react'

export default function HowItWorks() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-6 text-slate-900">Come funziona ModuloFinder?</h1>
        <p className="text-xl text-slate-600 mb-16 max-w-2xl mx-auto">
          Semplifichiamo l'acquisto della tua casa modulare analizzando centinaia di prodotti Amazon per te.
        </p>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Linea di connessione (visibile solo desktop) */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-1 bg-slate-100 -z-10"></div>

          {/* Step 1 */}
          <div className="bg-white p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-sm">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">1. Cerca</h3>
            <p className="text-slate-600">
              Usa il nostro <span className="text-primary font-bold">Finder</span> per filtrare case in base al tuo budget, metri quadri e materiali preferiti.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-sm">
              <Bot size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">2. Analisi AI</h3>
            <p className="text-slate-600">
              La nostra Intelligenza Artificiale legge le specifiche tecniche e ti fornisce <span className="font-bold">Pro e Contro</span> reali e imparziali.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-sm">
              <ShoppingCart size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">3. Acquista Sicuro</h3>
            <p className="text-slate-600">
              Ti reindirizziamo direttamente su <span className="font-bold">Amazon</span> per completare l'acquisto con la massima garanzia e protezione.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <Link href="/finder" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
            Inizia la Ricerca <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}
