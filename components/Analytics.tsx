'use client'
import Script from 'next/script'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import CookieBanner from './CookieBanner'

export default function Analytics() {
  const [consentGiven, setConsentGiven] = useState(false)
  const [codes, setCodes] = useState({ ga_id: '', clarity_id: '', fb_pixel: '' })

  useEffect(() => {
    // 1. Controlla Consenso Cookie
    if (localStorage.getItem('cookie_consent') === 'true') {
      setConsentGiven(true)
    }

    // 2. Scarica i codici dal DB (solo lato client per evitare rallentamenti server)
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*')
      if (data) {
        const newCodes: any = {}
        data.forEach((item: any) => newCodes[item.key] = item.value)
        setCodes(prev => ({ ...prev, ...newCodes }))
      }
    }
    fetchSettings()
  }, [])

  return (
    <>
      <CookieBanner onAccept={() => setConsentGiven(true)} />
      
      {consentGiven && (
        <>
          {/* Google Analytics 4 */}
          {codes.ga_id && (
            <>
              <Script src={`https://www.googletagmanager.com/gtag/js?id=${codes.ga_id}`} strategy="afterInteractive" />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${codes.ga_id}', { page_path: window.location.pathname, anonymize_ip: true });
                `}
              </Script>
            </>
          )}

          {/* Microsoft Clarity */}
          {codes.clarity_id && (
            <Script id="clarity-js" strategy="afterInteractive">
              {`
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${codes.clarity_id}");
              `}
            </Script>
          )}

          {/* Facebook Pixel */}
          {codes.fb_pixel && (
             <Script id="fb-pixel" strategy="afterInteractive">
               {`
                 !function(f,b,e,v,n,t,s)
                 {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                 n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                 if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                 n.queue=[];t=b.createElement(e);t.async=!0;
                 t.src=v;s=b.getElementsByTagName(e)[0];
                 s.parentNode.insertBefore(t,s)}(window, document,'script',
                 'https://connect.facebook.net/en_US/fbevents.js');
                 fbq('init', '${codes.fb_pixel}');
                 fbq('track', 'PageView');
               `}
             </Script>
          )}
        </>
      )}
    </>
  )
}
