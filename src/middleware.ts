import { NextResponse, type NextRequest } from 'next/server'
import { AUTH_SECRET, tokenName } from '@/config/server/auth-config'
import { verifyAuth } from '@/lib/server-utils/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const cookie = request.cookies.get(tokenName)
  const requestHeaders = new Headers(request.headers)
  const verify = await verifyAuth(request)
  requestHeaders.set('x-is-login', verify?.did ? 'true' : 'false')

  if (pathname.startsWith('/gateway') && pathname.endsWith('/deck') && pathname.includes('gateway/deck')) {
    return NextResponse.redirect(new URL('/deck', request.url))
  }
  if (
    !verify?.did &&
    ['/studio', '/accounts', '/pay', '/messages', '/notifications', '/wallet'].find(row => pathname.startsWith(row))
  ) {
    return NextResponse.redirect(new URL('/gateway', request.url))
  }
  if (cookie && cookie.value !== 'null') {
    if (pathname.startsWith('/gateway') && verify?.did && verify?.id) {
      return NextResponse.redirect(new URL('/studio', request.url), { headers: requestHeaders })
    }
  }

  const { headers } = request
  const authorization = headers.get('Authorization')
  if (authorization) {
    if (authorization !== AUTH_SECRET) {
      return Response.json({ ok: false, message: 'Authentication failed', code: 403 })
    }
  }
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/gateway',
    '/gateway/signup',
    '/studio/:path*',
    '/accounts/:path*',
    '/wallet/:path*',
    '/pay/:path*',
    '/messages/:path*',
    '/notifications/:path*',
  ],
}
