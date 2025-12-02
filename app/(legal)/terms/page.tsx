import { supabase } from '@/lib/supabase'

export const revalidate = 0;

export default async function TermsPage() {
  const { data } = await supabase.from('settings').select('value').eq('key', 'legal_terms').single()
  
  const content = data?.value || "<h1>Termini e Condizioni</h1><p>Contenuto in aggiornamento...</p>"

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose prose-slate">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
