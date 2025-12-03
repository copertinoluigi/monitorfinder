import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from 'next/cache'

// Funzione helper per selezionare il modello Gemini più adatto
async function getDynamicModel(apiKey: string) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    if (!data.models) return "gemini-1.5-flash"; 
    const bestModel = data.models.find((m: any) => 
      m.name.includes("gemini") && 
      m.supportedGenerationMethods.includes("generateContent") &&
      m.name.includes("flash")
    );
    return bestModel ? bestModel.name.replace("models/", "") : "gemini-1.5-flash";
  } catch (e) {
    return "gemini-1.5-flash"; 
  }
}

// Setup Client Supabase Admin (Service Role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Manca GEMINI_API_KEY");

    const modelName = await getDynamicModel(apiKey);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    // 1. Leggi i dati dal form (inclusi i nuovi filtri)
    const body = await req.json()
    const { productTitle, features, amazonLink, image, price, brand, hertz, category, screenSize, resolution } = body

    if (!productTitle) return NextResponse.json({ error: "Manca Titolo" }, { status: 400 })

    console.log(`🤖 Generazione SEO avviata per: ${productTitle}`);

    // 2. Prompt Ottimizzato per Recensioni Tech
    const prompt = `
      Sei un esperto recensore tech (stile Rtings/TechRadar). Scrivi una recensione HTML (usa tag h2, p, ul, li) per il monitor: ${productTitle}.
      
      Specifiche Tecniche:
      - Brand: ${brand}
      - Dimensioni: ${screenSize} pollici
      - Risoluzione: ${resolution}
      - Refresh Rate: ${hertz}Hz
      - Features grezze: ${features}
      
      Struttura richiesta:
      <h2>Panoramica</h2>
      <p>Introduzione che specifica il target (es. Gaming Competitivo o Ufficio) e i punti di forza principali.</p>
      
      <h2>Qualità del Display</h2>
      <p>Analizza la risoluzione ${resolution} in relazione alla diagonale da ${screenSize}". Parla della densità di pixel (PPI) se rilevante e della qualità del pannello.</p>
      
      <h2>Performance e Gaming</h2>
      <p>Analizza i ${hertz}Hz, i tempi di risposta e la fluidità in gioco.</p>
      
      <h2>Specifiche Chiave</h2>
      <ul><li>Elenco puntato delle feature principali (porte, ergonomia, tecnologie speciali).</li></ul>
      
      <h2>Verdetto</h2>
      <p>Conclusione sintetica. Vale il prezzo attuale?</p>
      
      NOTA: Non inserire link o bottoni nel testo.
    `

    const result = await model.generateContent(prompt);
    let content = result.response.text();

    // 3. Pulizia Output (Rimuove markdown code blocks)
    const codeBlockMatch = content.match(/```(?:html)?([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      content = codeBlockMatch[1].trim();
    } else {
      content = content
        .replace(/^Here is the HTML.*:/i, '')
        .replace(/^Ecco il codice HTML.*:/i, '')
        .replace(/^Ecco la recensione.*:/i, '')
        .trim();
    }

    // 4. Genera Slug URL-friendly
    const slug = productTitle.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    // 5. Genera Meta Description SEO-Oriented
    // Creiamo una descrizione che invogli il click (CTR) invece di una lista di dati
    let metaDesc = `Recensione completa ${productTitle}. Analisi tecnica del monitor ${brand} da ${screenSize}" con risoluzione ${resolution} e ${hertz}Hz. Scopri pro, contro e prezzo.`;
    
    // Tronca se troppo lunga (Google taglia a ~160 caratteri)
    if (metaDesc.length > 155) {
        metaDesc = metaDesc.substring(0, 152) + '...';
    }

    // 6. Salva nel Database
    const { error } = await supabaseAdmin
      .from('posts') 
      .insert({
        title: productTitle, // Salviamo il titolo pulito
        slug: slug,
        content: content,
        meta_description: metaDesc, // <--- Description SEO ottimizzata
        is_published: true,
        amazon_link: amazonLink,
        image_url: image,
        
        // Dati Tecnici
        price: price || 0,
        brand: brand || 'Generico',
        hertz: hertz || 60,
        category: category || 'Monitor',
        screen_size: screenSize || '',
        resolution: resolution || '',
        
        show_in_finder: true // I post generati dall'AI vanno nel Finder di default
      })

    if (error) throw error;

    // 7. Pulisci Cache
    revalidatePath('/blog');
    revalidatePath('/finder');
    revalidatePath('/');

    return NextResponse.json({ success: true, slug, modelUsed: modelName })

  } catch (error: any) {
    console.error("🔥 ERRORE API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
