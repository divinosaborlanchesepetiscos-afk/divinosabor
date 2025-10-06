import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://itfabqajajixkyogrlm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZmFicWFqYWppeGt5b2dncmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MDE4MjgsImV4cCI6MjA3NTI3NzgyOH0.VYri0_qUDz5SfkMvYzowF60hhCJHldO67vlRdylDi_4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

