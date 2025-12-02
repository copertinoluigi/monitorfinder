'use client'

import { useState } from 'react'
import { Facebook, Twitter, Send, Link as LinkIcon, Share2 } from 'lucide-react'

interface ShareButtonsProps {
  slug: string
  title: string
}

export default function ShareButtons({ slug, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  
  // URL assoluto (modifica il dominio se necessario, ma monitorfinder.it è quello attuale)
  const url = `https://monitorfinder.it/blog/${slug}`
  const text = `Leggi questa recensione su Monitor Finder: ${title}`

  const handleShare = (platform: string) => {
    let shareUrl = ''

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-6 border-y border-slate-100 my-8">
      <span className="text-slate-500 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
        <Share2 size={16} /> Condividi:
      </span>
      
      <div className="flex gap-2">
        {/* WhatsApp */}
        <button 
            onClick={() => handleShare('whatsapp')}
            className="p-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full transition shadow-sm"
            aria-label="Condividi su WhatsApp"
        >
            <Send size={18} className="translate-x-[-1px] translate-y-[1px]" /> {/* Icona Send usata spesso per WA se manca phone */}
        </button>

        {/* Telegram */}
        <button 
            onClick={() => handleShare('telegram')}
            className="p-3 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-full transition shadow-sm"
            aria-label="Condividi su Telegram"
        >
            <Send size={18} className="-rotate-45 translate-x-[2px]" />
        </button>

        {/* Facebook */}
        <button 
            onClick={() => handleShare('facebook')}
            className="p-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full transition shadow-sm"
            aria-label="Condividi su Facebook"
        >
            <Facebook size={18} />
        </button>

        {/* X / Twitter */}
        <button 
            onClick={() => handleShare('twitter')}
            className="p-3 bg-black hover:bg-slate-800 text-white rounded-full transition shadow-sm"
            aria-label="Condividi su X"
        >
            <Twitter size={18} />
        </button>

        {/* Copia Link */}
        <button 
            onClick={copyLink}
            className={`p-3 rounded-full transition shadow-sm flex items-center gap-2 ${
                copied ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            aria-label="Copia Link"
        >
            <LinkIcon size={18} />
            {copied && <span className="text-xs font-bold px-1">Copiato!</span>}
        </button>
      </div>
    </div>
  )
}
