"use client";

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ldenmsmxcqlbhoiabcrk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZW5tc214Y3FsYmhvaWFiY3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDA2MjUsImV4cCI6MjA2OTgxNjYyNX0.8zc9LWObz6tx6ZI1QM6qw8TfXK8Qx_pHxuN8Cn22xfA"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)