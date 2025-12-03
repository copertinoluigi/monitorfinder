import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from 'next/cache'

// ... (funzione getDynamicModel invariata) ...
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

    const body = await req.json()
    // NUOVI CAMPI: screenSize, resolution
    const { productTitle, features, amazonLink, image, price, brand, hertz, category, screenSize, resolution } = body

    if (!productTitle) return NextResponse.json({ error: "Manca Titolo" }, { status: 400 })

    const prompt = `
      Sei un esperto recensore tech. Scrivi una recensione HTML per il monitor: ${productTitle}.
      
      Specifiche Tecniche:
      - Brand: ${brand}
      - Dimensioni: ${screenSize} pollici
      - Risoluzione: ${resolution}
      - Refresh Rate: ${hertz}Hz
      - Features grezze: ${features}
      
      Struttura HTML richiesta (usa h2, p, ul, li):
      <h2>Introduzione</h2>
      <p>Panoramica veloce.</p>
      <h2>Qualità del Display</h2>
      <p>Parla della risoluzione ${resolution} su uno schermo da ${screenSize}".</p>
      <h2>Performance Gaming/Ufficio</h2>
      <p>Analizza i ${hertz}Hz.</p>
      <h2>Verdetto</h2>
      <p>Conclusione.</p>
      
      NOTA: Non inserire link o bottoni.
    `

    const result = await model.generateContent(prompt);
    let content = result.response.text();

    // Pulizia markdown
    const codeBlockMatch = content.match(/```(?:html)?([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) content = codeBlockMatch[1].trim();

    // Slug
    const slug = productTitle.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    // Salvataggio con nuovi campi
    const { error } = await supabaseAdmin
      .from('posts') 
      .insert({
        title: `Recensione ${productTitle}`,
        slug: slug,
        content: content,
        meta_description: `Recensione ${productTitle}. ${screenSize}", ${resolution}, ${hertz}Hz.`,
        is_published: true,
        amazon_link: amazonLink,
        image_url: image,
        price: price || 0,
        brand: brand || 'Generico',
        hertz: hertz || 60,
        category: category || 'Monitor',
        // NUOVI
        screen_size: screenSize || '',
        resolution: resolution || '',
        show_in_finder: true // I post AI vanno nel finder
      })

    if (error) throw error;

    revalidatePath('/blog');
    revalidatePath('/finder');

    return NextResponse.json({ success: true, slug })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
