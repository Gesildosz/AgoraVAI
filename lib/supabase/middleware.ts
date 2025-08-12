// Simplificando middleware sem dependências do Supabase
import { NextResponse, type NextRequest } from "next/server"

export const isSupabaseConfigured = false

export async function updateSession(request: NextRequest) {
  // Mock middleware - just pass through for preview
  return NextResponse.next({
    request,
  })
}
