"use client";

import { createClient } from '@supabase/supabase-js'

// These variables are expected to be set in your environment.
// The Supabase integration will handle this for you.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)