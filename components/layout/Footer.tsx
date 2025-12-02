import Link from 'next/link'
import { Monitor } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 font-bold text-white text-xl mb-4">
            <Monitor className="text-blue-500" /> MonitorFinder
          </div>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            La guida definitiva per scegliere il monitor perfetto. 
            Analizziamo Hz, pannelli e prezzi grazie all'intelligenza artificiale per garantirti il miglior setup gaming o ufficio.
          </p>
        </div>

        {/* Link Rapidi */}
        <div>
          <h4 className="text-white font-bold mb-4">Esplora</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/finder" className="hover:text-blue-400 transition">Trova Monitor</Link></li>
            <li><Link href="/blog" className="hover:text-blue-400 transition">Recensioni & Guide</Link></li>
            <li><Link href="/how-it-works" className="hover:text-blue-400 transition">Come funziona l'AI</Link></li>
          </ul>
        </div>

        {/* Legale */}
        <div>
          <h4 className="text-white font-bold mb-4">Legale</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-400 transition">Termini di Servizio</Link></li>
            <li><Link href="/disclosure" className="hover:text-blue-400 transition">Affiliate Disclosure</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>&copy; {currentYear} Monitor Finder. Tutti i diritti riservati.</p>
        <p className="mt-2">MonitorFinder partecipa al Programma Affiliazione Amazon EU, un programma di affiliazione che consente ai siti di percepire una commissione pubblicitaria pubblicizzando e fornendo link al sito Amazon.it.</p>
      </div>
    </footer>
  )
}