import { supabase } from '@/lib/supabase'

// Disabilita la cache per vedere subito le modifiche fatte dall'admin
export const revalidate = 0;

export default async function PrivacyPage() {
  const { data } = await supabase.from('settings').select('value').eq('key', 'legal_privacy').single()
  
  const content = data?.value || "<h1>Privacy Policy</h1><p>Contenuto in aggiornamento...</p>"

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose prose-slate">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
