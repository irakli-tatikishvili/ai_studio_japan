import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vkfhtglfpieyuzyywsrh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmh0Z2xmcGlleXV6eXl3c3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzQzNjEsImV4cCI6MjA4NjY1MDM2MX0.uBnU6pG5D7zMIj_lfS5ZFlP838AfEcTLcgq-dqkSI6k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
