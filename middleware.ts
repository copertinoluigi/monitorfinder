import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Intercetta solo i percorsi che iniziano con /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Eccezione: lascia passare la pagina di login stessa
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Controlla se esiste il cookie 'admin_session'
    const authCookie = request.cookies.get('admin_session')

    // Se non c'è, redirect al login
    if (!authCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

// Configurazione matcher per ottimizzare le performance
export const config = {
  matcher: '/admin/:path*',
}
