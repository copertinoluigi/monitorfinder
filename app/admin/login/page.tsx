'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    })
    
    const data = await res.json()
    if (data.success) {
      router.push('/admin') // Redirect all'admin
      router.refresh()
    } else {
      setError('Password non valida')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Admin 🔒</h1>
        <input 
          type="password" 
          placeholder="Password Admin" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800">
          Entra
        </button>
      </form>
    </div>
  )
}
