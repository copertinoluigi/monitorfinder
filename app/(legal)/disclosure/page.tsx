import { supabase } from '@/lib/supabase'

export const revalidate = 0;

export default async function DisclosurePage() {
  const { data } = await supabase.from('settings').select('value').eq('key', 'legal_disclosure').single()
  
  const content = data?.value || "<h1>Affiliate Disclosure</h1><p>Questo sito partecipa al Programma Affiliazione Amazon EU...</p>"

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose prose-slate">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
