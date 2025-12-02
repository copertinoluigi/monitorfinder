'use client'
import { useState, useEffect } from 'react'

export default function CookieBanner({ onAccept }: { onAccept: () => void }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setShow(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true')
    setShow(false)
    onAccept()
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900 text-white z-50 border-t border-slate-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
        <p>
          Questo sito utilizza cookie per migliorare l&apos;esperienza. 
          Leggi la <a href="/privacy" className="underline text-yellow-400">Privacy Policy</a>.
        </p>
        <div className="flex gap-2">
          <button onClick={() => setShow(false)} className="px-3 py-1 border rounded hover:bg-slate-800">Chiudi</button>
          <button onClick={handleAccept} className="px-3 py-1 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500">Accetta Tutto</button>
        </div>
      </div>
    </div>
  )
}
