// assets/js/supabase-client.js
const SUPABASE_URL = 'https://erkjbmqljvbljkghvwqa.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_hm-V1hNsiRmGoPSOaGhEtA_xchAazXa';

// Inisialisasi Supabase
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
