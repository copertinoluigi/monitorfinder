/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com', // Immagini prodotti Amazon
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com', // Altro dominio Amazon
      },
      // Aggiungi qui il tuo bucket Supabase se carichi immagini manualmente
      {
        protocol: 'https',
        hostname: '*.supabase.co', 
      }
    ],
  },
};

export default nextConfig;