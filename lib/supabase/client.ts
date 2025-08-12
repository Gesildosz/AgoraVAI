// Removendo dependência do Supabase e criando mock client
// Mock client for preview environment - replace with real Supabase when running locally
export const isSupabaseConfigured = false

export const supabase = {
  auth: {
    signInWithPassword: async (credentials: any) => {
      // Mock login - always succeeds for demo
      return { data: { user: { id: "1", email: credentials.email } }, error: null }
    },
    signUp: async (credentials: any) => {
      return { data: { user: { id: "1", email: credentials.email } }, error: null }
    },
    signOut: async () => {
      return { error: null }
    },
    getUser: async () => {
      return { data: { user: null }, error: null }
    },
    getSession: async () => {
      return { data: { session: null }, error: null }
    },
  },
  from: (table: string) => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
  }),
}
