'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Monitor, Search, BookOpen, Cpu } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-slate-900 group">
            <Monitor className="w-7 h-7 text-primary group-hover:text-blue-700 transition" />
            <span>Monitor<span className="text-primary">Finder</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/finder" className="text-sm font-medium hover:text-primary transition flex items-center gap-1">
                <Search size={16}/> Trova Monitor
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition">Recensioni</Link>
            <Link href="/finder" className="bg-primary text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-primary/20 flex items-center gap-2">
              <Cpu size={16} /> Configura Setup
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-700">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t absolute w-full shadow-xl animate-in slide-in-from-top-5">
          <div className="px-4 py-6 space-y-4 flex flex-col">
            <Link href="/finder" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium p-2 rounded hover:bg-slate-50">
              <Search className="w-5 h-5 text-primary" /> Cerca Monitor
            </Link>
            <Link href="/blog" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium p-2 rounded hover:bg-slate-50">
              <BookOpen className="w-5 h-5 text-primary" /> Guide & News
            </Link>
            <Link href="/finder" onClick={() => setIsOpen(false)} className="bg-primary text-white text-center py-3 rounded-xl font-bold mt-4">
              Vai al Finder
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}