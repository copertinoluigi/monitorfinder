import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Client Admin con poteri di scrittura (Service Role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    // 1. Verifica Password Admin (Sicurezza)
    const password = req.headers.get('x-admin-password')
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Password Admin Errata o Mancante' }, { status: 401 })
    }

    // 2. Prendi i dati
    const body = await req.json()
    const { settings } = body // Ci aspettiamo un array di oggetti { key, value }

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json({ error: 'Formato dati non valido' }, { status: 400 })
    }

    // 3. Salva nel DB (Upsert = Inserisci o Aggiorna)
    const { error } = await supabaseAdmin
      .from('settings')
      .upsert(settings)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("Errore salvataggio settings:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
