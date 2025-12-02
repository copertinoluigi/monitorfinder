import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Setup Supabase con permessi Admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    // 1. Verifica Password Admin
    const password = req.headers.get('x-admin-password')
    // Opzionale: de-commenta sotto per attivare la protezione password lato server
    // if (password !== 'LA_TUA_PASSWORD_SEGRETA') return NextResponse.json({ error: "Password errata" }, { status: 401 })

    const body = await req.json()
    const { settings } = body

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json({ error: "Formato dati non valido" }, { status: 400 })
    }

    // 2. LOGICA UPSERT (Cruciale: onConflict: 'key')
    // Questo dice a Supabase: "Se la chiave 'ga_id' esiste già, aggiorna il valore. Se no, creala."
    const { error } = await supabaseAdmin
      .from('settings')
      .upsert(settings, { onConflict: 'key' })

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("🔥 Errore salvataggio settings:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
