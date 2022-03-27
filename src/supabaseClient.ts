import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl: string = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey: string = process.env.REACT_APP_SUPABASE_ANON_KEY || ''
let supabase: SupabaseClient= createClient(supabaseUrl, supabaseAnonKey)

export default supabase