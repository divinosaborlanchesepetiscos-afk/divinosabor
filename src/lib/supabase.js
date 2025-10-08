import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://itfabqajajixkyokgrlm.supabase.co'
const supabaseAnonKey = 'sb_publishable_MEXa0hvd-KXGzHmCOn6Qtg_uNXQzA4H'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
