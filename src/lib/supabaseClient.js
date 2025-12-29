// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://crcxgwhorwiytksalpbj.supabase.co"; // replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyY3hnd2hvcndpeXRrc2FscGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTM0MDYsImV4cCI6MjA3NjcyOTQwNn0.JL_ImB3R26sq1No1Z_oBQqF6oAVBm-CEkMK7nrZMU4g"; // replace with your Supabase anon/public key

export const supabase = createClient(supabaseUrl, supabaseKey);
