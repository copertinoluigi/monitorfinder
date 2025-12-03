'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Settings, MessageSquare, PenTool, Check, Save, Trash2, Scale, Monitor, Zap, FileText } from 'lucide-react'

// --- COMPONENTE PRINCIPALE ---
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'generator' | 'manual' | 'settings' | 'comments' | 'legal'>('generator')

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8 text-blue-400 flex items-center gap-2">
          <Monitor size={24}/> Admin
        </h2>
        <nav className="flex md:flex-col gap-3">
          <SidebarBtn active={activeTab === 'generator'} onClick={() => setActiveTab('generator')} icon={<Zap size={20}/>} label="Generatore AI" />
          <SidebarBtn active={activeTab === 'manual'} onClick={() => setActiveTab('manual')} icon={<FileText size={20}/>} label="Post Manuale" />
          <SidebarBtn active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} icon={<MessageSquare size={20}/>} label="Commenti" />
          <SidebarBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20}/>} label="Impostazioni" />
          <SidebarBtn active={activeTab === 'legal'} onClick={() => setActiveTab('legal')} icon={<Scale size={20}/>} label="Legal" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'generator' && <GeneratorTab />}
        {activeTab === 'manual' && <ManualPostTab />}
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

/* --- TAB 1: GENERATORE AI (Aggiornato con Filtri Pollici/Risoluzione) --- */
function GeneratorTab() {
  const [form, setForm] = useState({ 
    title: '', features: '', link: '', imgUrl: '', password: '',
    price: '', brand: '', hertz: '', category: 'Gaming',
    screenSize: '', resolution: '' // NUOVI CAMPI
  })
  const [status, setStatus] = useState('')

  const handleGenerate = async () => {
    setStatus('🤖 AI al lavoro...')
    try {
      const res = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'x-admin-password': form.password },
        body: JSON.stringify({ 
          productTitle: form.title, 
          features: form.features, 
          amazonLink: form.link, 
          image: form.imgUrl,
          price: Number(form.price), 
          brand: form.brand, 
          hertz: Number(form.hertz), 
          category: form.category,
          screenSize: form.screenSize, // INVIATI ALL'API
          resolution: form.resolution 
        })
      })
      const data = await res.json()
      if (data.success) {
        setStatus('✅ Recensione generata e monitor indicizzato!')
        // Reset dei campi (mantengo password e categoria per comodità)
        setForm(prev => ({ 
          ...prev, title: '', features: '', link: '', imgUrl: '', 
          price: '', hertz: '', brand: '', screenSize: '', resolution: '' 
        }))
      } else { 
        setStatus(`❌ Errore: ${data.error}`) 
      }
    } catch (e) { setStatus('❌ Errore di rete') }
  }

  return (
    <div className="max-w-3xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <Zap className="text-primary"/> Generatore AI (Prodotto)
      </h2>
      <div className="space-y-4">
        
        <div><label className="font-bold text-sm">Password Admin</label><input type="password" className="w-full border p-3 rounded bg-slate-50" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
        
        <div><label className="font-bold text-sm">Modello Monitor (Titolo)</label><input className="w-full border p-3 rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Es. LG UltraGear 27GR95QE" /></div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="font-bold text-sm">Link Amazon</label><input className="w-full border p-3 rounded" value={form.link} onChange={e => setForm({...form, link: e.target.value})} /></div>
          <div><label className="font-bold text-sm">URL Immagine</label><input className="w-full border p-3 rounded" value={form.imgUrl} onChange={e => setForm({...form, imgUrl: e.target.value})} /></div>
        </div>

        {/* --- DATI TECNICI ESTESI --- */}
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
            <input type="text" className="w-full border p-2 rounded" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} placeholder="Es. Samsung" />
          </div>
          
          {/* NUOVI INPUT */}
          <div>
            <label className="font-bold text-sm block mb-1">Pollici (es. 27)</label>
            <input className="w-full border p-2 rounded" value={form.screenSize} onChange={e => setForm({...form, screenSize: e.target.value})} placeholder='27' />
          </div>
          <div className="col-span-2">
            <label className="font-bold text-sm block mb-1">Risoluzione (es. 1440p)</label>
            <input className="w-full border p-2 rounded" value={form.resolution} onChange={e => setForm({...form, resolution: e.target.value})} placeholder='2560x1440 (2K)' />
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

/* --- TAB 2: POST MANUALE (NUOVA - Per Articoli Pillar) --- */
function ManualPostTab() {
  const [form, setForm] = useState({ title: '', slug: '', content: '', image: '', desc: '', password: '' })
  const [status, setStatus] = useState('')

  const handleSave = async () => {
    if (!form.password) { setStatus('Inserisci Password'); return }
    setStatus('Salvataggio...')

    const finalSlug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    // Inserimento con show_in_finder: false
    const { error } = await supabase.from('posts').insert({
      title: form.title,
      slug: finalSlug,
      content: form.content, 
      meta_description: form.desc,
      image_url: form.image,
      is_published: true,
      show_in_finder: false, // QUESTO POST NON APPARE NEL FINDER
      category: 'Articolo',
      // Valori dummy per evitare errori DB su campi not null
      price: 0, hertz: 0, brand: 'Redazione' 
    })

    if (error) setStatus(`Errore: ${error.message}`)
    else {
      setStatus('✅ Articolo Manuale Pubblicato!')
      // Reset form tranne password
      setForm({ title: '', slug: '', content: '', image: '', desc: '', password: form.password })
    }
  }

  return (
    <div className="max-w-4xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <FileText className="text-green-600"/> Post Manuale (No AI)
      </h2>
      <p className="text-sm text-slate-500 mb-6 border-b pb-4">
        Usa questo form per guide d'acquisto, confronti o articoli informativi. 
        Questi articoli saranno visibili nel Blog ma <strong>NON</strong> nei filtri del Finder.
      </p>
      
      <div className="space-y-4">
        <div><label className="font-bold text-sm">Password Admin</label><input type="password" className="w-full border p-3 rounded bg-slate-50" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
        
        <div className="grid grid-cols-2 gap-4">
           <div><label className="font-bold text-sm">Titolo H1</label><input className="w-full border p-3 rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
           <div><label className="font-bold text-sm">Slug (Opzionale)</label><input className="w-full border p-3 rounded" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="titolo-articolo" /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div><label className="font-bold text-sm">URL Immagine Copertina</label><input className="w-full border p-3 rounded" value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
           <div><label className="font-bold text-sm">Meta Descrizione (SEO)</label><input className="w-full border p-3 rounded" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} /></div>
        </div>

        <div>
           <label className="font-bold text-sm">Contenuto HTML</label>
           <p className="text-xs text-slate-400 mb-1">Scrivi qui l'articolo in HTML. Usa {'<h2>, <p>, <ul>, <a href="...">'} liberamente.</p>
           <textarea className="w-full border p-3 rounded h-96 font-mono text-sm" value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="<h2>Introduzione</h2><p>Testo...</p>" />
        </div>

        <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 font-bold text-lg shadow-md">Pubblica Articolo Manuale</Button>
        {status && <p className="text-center font-bold mt-4 p-2 bg-slate-50 rounded">{status}</p>}
      </div>
    </div>
  )
}

/* --- TAB 3: SETTINGS (Tracciamento & SEO) --- */
function SettingsTab() {
  const [settings, setSettings] = useState({ ga_id: '', clarity_id: '', fb_pixel: '', gsc_code: '' })
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('settings').select('*')
      if (data) {
        const newSettings: any = {}
        data.forEach((item: any) => newSettings[item.key] = item.value)
        setSettings(prev => ({ ...prev, ...newSettings }))
      }
    }
    load()
  }, [])

  const save = async () => {
    if (!password) { setMsg('❌ Inserisci la Password Admin in basso'); return; }
    setMsg('Salvataggio in corso...')
    
    // Convertiamo l'oggetto settings in array chiave-valore per l'API
    const payload = Object.entries(settings).map(([key, value]) => ({ key, value }))

    try {
      const res = await fetch('/api/save-settings', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: JSON.stringify({ settings: payload })
      })

      const data = await res.json()
      if (data.success) setMsg('✅ Impostazioni salvate correttamente!')
      else setMsg(`❌ Errore: ${data.error}`)
    } catch (e) {
      setMsg('❌ Errore di connessione')
    }
  }

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="text-slate-600"/> Codici di Tracciamento
      </h2>
      <div className="space-y-5">
        {Object.keys(settings).map((key) => (
          <div key={key}>
            <label className="font-bold block mb-1 uppercase text-xs text-slate-500 tracking-wider">
              {key === 'gsc_code' ? 'Google Search Console (HTML Tag)' : key.replace('_', ' ')}
            </label>
            <input 
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
              value={(settings as any)[key]} 
              onChange={e => setSettings({...settings, [key]: e.target.value})} 
              placeholder={`Inserisci ID per ${key}`}
            />
          </div>
        ))}
        
        <div className="mt-8 pt-6 border-t border-slate-100">
          <label className="font-bold block mb-2 text-red-600 text-sm">Password Admin (Richiesta per salvare)</label>
          <input 
            type="password" 
            className="w-full border border-red-200 bg-red-50 p-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="La tua password segreta..."
          />
        </div>

        <Button onClick={save} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 py-3 font-bold shadow-md">
          <Save size={18} className="mr-2"/> Salva Impostazioni
        </Button>
        {msg && <p className={`text-center font-bold mt-4 p-2 rounded ${msg.includes('Errore') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{msg}</p>}
      </div>
    </div>
  )
}

/* --- TAB 4: COMMENTI (Moderazione) --- */
function CommentsTab() {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComments = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false })
    
    if (data) setComments(data)
    setLoading(false)
  }

  useEffect(() => { fetchComments() }, [])

  const handleAction = async (id: string, approve: boolean) => {
    if (approve) {
      await supabase.from('comments').update({ is_approved: true }).eq('id', id)
    } else {
      await supabase.from('comments').delete().eq('id', id)
    }
    fetchComments()
  }

  return (
    <div className="max-w-4xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="text-slate-600"/> Coda di Moderazione
        </h2>
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
          {comments.length} in attesa
        </span>
      </div>

      {loading ? (
        <p className="text-slate-500 italic">Caricamento commenti...</p>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Check className="mx-auto h-10 w-10 text-green-500 mb-2" />
          <p className="text-slate-500 font-medium">Tutto pulito! Nessun commento da moderare.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4 bg-slate-50 hover:bg-white transition shadow-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                   <span className="font-bold text-slate-900">{c.author_name}</span>
                   <span className="text-xs text-slate-400">• {new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{c.content}</p>
                <p className="text-xs text-slate-400 mt-2">Su post ID: {c.post_id}</p>
              </div>
              
              <div className="flex md:flex-col gap-2 shrink-0">
                <button 
                  onClick={() => handleAction(c.id, true)} 
                  className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition flex items-center justify-center"
                  title="Approva"
                >
                  <Check size={20}/>
                </button>
                <button 
                  onClick={() => handleAction(c.id, false)} 
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition flex items-center justify-center"
                  title="Elimina"
                >
                  <Trash2 size={20}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* --- TAB 5: PAGINE LEGALI (Editor HTML Semplice) --- */
function LegalTab() {
  const [pages, setPages] = useState({ legal_privacy: '', legal_terms: '', legal_disclosure: '' })
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('settings').select('*').in('key', ['legal_privacy', 'legal_terms', 'legal_disclosure'])
      if (data) {
        const newPages: any = {}
        data.forEach((item: any) => newPages[item.key] = item.value)
        setPages(prev => ({ ...prev, ...newPages }))
      }
    }
    load()
  }, [])

  const save = async () => {
    if (!password) { setMsg('❌ Inserisci la Password Admin in basso'); return; }
    setMsg('Salvataggio in corso...')
    
    const payload = Object.entries(pages).map(([key, value]) => ({ key, value }))

    try {
      const res = await fetch('/api/save-settings', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: JSON.stringify({ settings: payload })
      })

      const data = await res.json()
      if (data.success) setMsg('✅ Pagine legali aggiornate!')
      else setMsg(`❌ Errore: ${data.error}`)
    } catch (e) {
      setMsg('❌ Errore di rete')
    }
  }

  return (
    <div className="max-w-4xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Scale className="text-slate-600"/> Editor Pagine Legali (HTML)
      </h2>
      <div className="space-y-8">
        
        <div>
          <label className="font-bold block mb-2 text-lg text-slate-800">Privacy Policy</label>
          <p className="text-xs text-slate-500 mb-2">Accetta tag HTML (p, ul, li, strong...)</p>
          <textarea 
            className="w-full border border-slate-300 p-4 rounded-lg h-64 font-mono text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={pages.legal_privacy} 
            onChange={e => setPages({...pages, legal_privacy: e.target.value})} 
          />
        </div>

        <div>
          <label className="font-bold block mb-2 text-lg text-slate-800">Termini e Condizioni</label>
          <textarea 
            className="w-full border border-slate-300 p-4 rounded-lg h-64 font-mono text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={pages.legal_terms} 
            onChange={e => setPages({...pages, legal_terms: e.target.value})} 
          />
        </div>

        <div>
          <label className="font-bold block mb-2 text-lg text-slate-800">Affiliate Disclosure</label>
          <p className="text-xs text-slate-500 mb-2">Testo che appare nella pagina dedicata alla trasparenza.</p>
          <textarea 
            className="w-full border border-slate-300 p-4 rounded-lg h-40 font-mono text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={pages.legal_disclosure} 
            onChange={e => setPages({...pages, legal_disclosure: e.target.value})} 
          />
        </div>

        <div className="pt-6 border-t border-slate-100">
          <label className="font-bold block mb-2 text-red-600 text-sm">Password Admin</label>
          <input 
            type="password" 
            className="w-full border border-red-200 bg-red-50 p-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>

        <Button onClick={save} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 font-bold text-lg shadow-lg">
          <Save size={20} className="mr-2"/> Salva Tutto
        </Button>
        {msg && <p className={`text-center font-bold mt-4 p-2 rounded ${msg.includes('Errore') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{msg}</p>}
      </div>
    </div>
  )
}
