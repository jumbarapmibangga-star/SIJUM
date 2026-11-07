// assets/js/supabase-client.js
//const SUPABASE_URL = 'https://erkjbmqljvbljkghvwqa.supabase.co/rest/v1/';
const SUPABASE_URL = 'https://erkjbmqljvbljkghvwqa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hm-V1hNsiRmGoPSOaGhEtA_xchAazXa';
if (!window.supabase) {
  console.error('Supabase CDN belum dimuat!');
}
// Inisialisasi Supabase
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
