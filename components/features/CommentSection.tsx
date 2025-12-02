'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { User, Send } from 'lucide-react'

export default function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState({ name: '', text: '' })
  const [msg, setMsg] = useState('')

  // Carica commenti APPROVATI
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_slug', slug)
        .eq('is_approved', true) // Solo approvati
        .order('created_at', { ascending: false })
      if (data) setComments(data)
    }
    fetch()
  }, [slug])

  // Invia nuovo commento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.name || !newComment.text) return
    
    const { error } = await supabase.from('comments').insert({
      post_slug: slug,
      author_name: newComment.name,
      content: newComment.text,
      is_approved: false // Default: non approvato
    })

    if (!error) {
      setMsg('Grazie! Il tuo commento è in attesa di approvazione.')
      setNewComment({ name: '', text: '' })
    } else {
      setMsg('Errore durante l\'invio.')
    }
  }

  return (
    <div className="mt-16 pt-8 border-t border-slate-200">
      <h3 className="text-2xl font-bold mb-8">Discussione ({comments.length})</h3>

      {/* Lista Commenti */}
      <div className="space-y-6 mb-12">
        {comments.map(c => (
          <div key={c.id} className="flex gap-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-slate-500"/>
            </div>
            <div>
              <p className="font-bold text-slate-900">{c.author_name}</p>
              <p className="text-slate-600 mt-1">{c.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p className="text-slate-500 italic">Nessun commento ancora. Sii il primo!</p>}
      </div>

      {/* Form */}
      <div className="bg-slate-50 p-6 rounded-xl">
        <h4 className="font-bold mb-4">Lascia un commento</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            placeholder="Il tuo nome" 
            className="w-full border p-3 rounded bg-white"
            value={newComment.name}
            onChange={e => setNewComment({...newComment, name: e.target.value})}
            required
          />
          <textarea 
            placeholder="Scrivi la tua opinione..." 
            className="w-full border p-3 rounded bg-white h-24"
            value={newComment.text}
            onChange={e => setNewComment({...newComment, text: e.target.value})}
            required
          />
          <Button type="submit" className="bg-primary text-white">
            <Send size={16} className="mr-2"/> Invia Commento
          </Button>
          {msg && <p className="text-green-600 font-bold mt-2">{msg}</p>}
        </form>
      </div>
    </div>
  )
}
