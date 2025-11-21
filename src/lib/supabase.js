import { createClient } from '@supabase/supabase-js'

// Obtener las credenciales desde las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar que las credenciales estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Faltan credenciales de Supabase en .env.local')
  console.error('URL:', supabaseUrl)
  console.error('Key:', supabaseAnonKey ? 'Configurada' : 'Falta')
}

// Crear y exportar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})