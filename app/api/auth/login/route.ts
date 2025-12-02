import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { password } = body

    // Controlla se la password corrisponde a quella nelle Env Vars
    if (password === process.env.ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true })
      
      // Imposta un cookie sicuro
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 settimana
      })
      
      return response
    }

    return NextResponse.json({ success: false, error: 'Password errata' }, { status: 401 })
  } catch (e) {
    return NextResponse.json({ error: 'Errore server' }, { status: 500 })
  }
}
