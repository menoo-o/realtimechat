import { type NextRequest } from 'next/server'
import { updateSession } from './utils/updateSession'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
   matcher: '/private/:path*',
  }
