'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Settings, MessageSquare, PenTool, Check, Save, Trash2, Scale, Monitor, Zap } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'generator' | 'settings' | 'comments' | 'legal'>('generator')

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8 text-blue-400 flex items-center gap-2">
          <Monitor size={24}/> Admin
        </h2>
        <nav className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
          <SidebarBtn active={activeTab === 'generator'} onClick={() => setActiveTab('generator')} icon={<PenTool size={20}/>} label="Generatore AI" />
          <SidebarBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20}/>} label="Impostazioni" />
          <SidebarBtn active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} icon={<MessageSquare size={20}/>} label="Commenti" />
          <SidebarBtn active={activeTab === 'legal'} onClick={() => setActiveTab('legal')} icon={<Scale size={20}/>} label="Legal" />
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'generator' && <GeneratorTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'comments' && <CommentsTab />}
        {activeTab === 'legal' && <LegalTab />}
      </main>
    </div>
  )
}

function SidebarBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 w-full p-3 rounded transition whitespace-nowrap ${active ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-slate-300'}`}>
      {icon} {label}
    </button>
  )
}

/* --- TAB 1: GENERATORE MONITOR --- */
function GeneratorTab() {
  const [form, setForm] = useState({ 
    title: '', features: '', link: '', imgUrl: '', password: '',
    price: '', brand: 'LG', hertz: '', category: 'Gaming' 
  })
  const [status, setStatus] = useState('')

  const handleGenerate = async () => {
    setStatus('🤖 Analisi specifiche hardware in corso...')
    try {
      const res = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'x-admin-password': form.password },
        body: JSON.stringify({ 
          productTitle: form.title, 
          features: form.features, 
          amazonLink: form.link,
          image: form.imgUrl,
          // Mapping Dati Monitor
          price: Number(form.price),
          brand: form.brand,        // String
          hertz: Number(form.hertz), // Number
          category: form.category
        })
      })
      const data = await res.json()
      if (data.success) {
        setStatus('✅ Recensione generata e monitor indicizzato!')
        // Reset parziale
        setForm(prev => ({ ...prev, title: '', features: '', link: '', imgUrl: '', price: '', hertz: '' }))
      } else { 
        setStatus(`❌ Errore: ${data.error}`) 
      }
    } catch (e) { setStatus('❌ Errore di rete') }
  }

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <Zap className="text-primary"/> Nuovo Monitor
      </h2>
      <div className="space-y-4">
        
        <div><label className="font-bold text-sm">Password Admin</label><input type="password" className="w-full border p-3 rounded bg-slate-50" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
        
        <div><label className="font-bold text-sm">Modello Monitor (Titolo)</label><input className="w-full border p-3 rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Es. LG UltraGear 27GR95QE" /></div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="font-bold text-sm">Link Amazon</label><input className="w-full border p-3 rounded" value={form.link} onChange={e => setForm({...form, link: e.target.value})} /></div>
          <div><label className="font-bold text-sm">URL Immagine</label><input className="w-full border p-3 rounded" value={form.imgUrl} onChange={e => setForm({...form, imgUrl: e.target.value})} /></div>
        </div>

        {/* --- DATI TECNICI --- */}
        <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div>
            <label className="font-bold text-sm block mb-1">Prezzo (€)</label>
            <input type="number" className="w-full border p-2 rounded" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="300" />
          </div>
          <div>
            <label className="font-bold text-sm block mb-1">Refresh Rate (Hz)</label>
            <input type="number" className="w-full border p-2 rounded" value={form.hertz} onChange={e => setForm({...form, hertz: e.target.value})} placeholder="144" />
          </div>
          <div>
            <label className="font-bold text-sm block mb-1">Brand</label>
            <input type="text" className="w-full border p-2 rounded" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} placeholder="Samsung" list="brands"/>
            <datalist id="brands">
                <option value="LG"/><option value="Samsung"/><option value="ASUS"/><option value="MSI"/><option value="Dell"/><option value="BenQ"/>
            </datalist>
          </div>
          <div className="col-span-3">
             <label className="font-bold text-sm block mb-1">Categoria</label>
             <select className="w-full border p-2 rounded" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
               <option value="Gaming">Gaming</option>
               <option value="Ufficio">Ufficio / Productivity</option>
               <option value="Ultrawide">Ultrawide</option>
               <option value="4K">4K / Creatives</option>
             </select>
          </div>
        </div>

        <div>
            <label className="font-bold text-sm">Specifiche Raw (copia da Amazon)</label>
            <textarea className="w-full border p-3 rounded h-32 text-sm font-mono" value={form.features} onChange={e => setForm({...form, features: e.target.value})} placeholder="Incolla qui le specifiche tecniche grezze..." />
        </div>
        
        <Button onClick={handleGenerate} className="w-full bg-slate-900 text-white hover:bg-slate-800 py-4 font-bold text-lg shadow-lg">Lancia AI Generativa ✨</Button>
        {status && <p className="text-center font-bold mt-4 p-2 bg-slate-100 rounded animate-pulse">{status}</p>}
      </div>
    </div>
  )
}

// I componenti SettingsTab, CommentsTab e LegalTab rimangono identici al tuo input originale.
// Li ometto per brevità, assicurati solo di copiare il loro codice se non lo hai salvato a parte.
// Se ti servono, dimmelo e li riscrivo. 
function SettingsTab() { /* ... codice originale ... */ return <div className="p-4 bg-white rounded">Settings Tab (Invariato)</div> }
function CommentsTab() { /* ... codice originale ... */ return <div className="p-4 bg-white rounded">Comments Tab (Invariato)</div> }
function LegalTab() { /* ... codice originale ... */ return <div className="p-4 bg-white rounded">Legal Tab (Invariato)</div> }