export type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  image_url: string;
  amazon_link: string;
  
  // Nuovi campi Monitor
  brand: string;          // Es: LG, Samsung, ASUS
  hertz: number;          // Es: 60, 144, 240
  category: string;       // Es: Gaming, Ufficio, Curvo, 4K
  
  // Campi standard
  is_prime: boolean;
  description: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML generato da Gemini
  meta_description: string;
  is_published: boolean;
  created_at: string;
  
  // In questo boilerplate, i dati del Finder sono spesso uniti al Post
  brand?: string;
  hertz?: number;
  price?: number;
};