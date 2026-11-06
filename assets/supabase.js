// assets/supabase.js
const SUPABASE_URL      = "https://ltlltnemwhavhhmevdun.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_86Su9Ae3p-9Pl3cCiunnUg_ZVt0SaGO";

window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

window.getMyProfile = async () => {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await sb.from("profiles")
    .select("user_id, username, nama, role, kontingen_id, aktif")
    .eq("user_id", user.id).single();
    
  if (error) {
    console.error("Gagal ambil profil:", error);
    // Jika profil tidak ketemu, kembalikan data minimal agar tidak stuck
    return { user_id: user.id, nama: user.email, role: 'kontingen', aktif: true };
  }
  return data;
};

window.redirectByRole = (role) => {
  // Tambahkan sedikit jeda agar session benar-benar tersimpan
  setTimeout(() => {
    if (role === "panitia")        location.href = "/panitia/index.html";
    else if (role === "juri")      location.href = "/juri/index.html";
    else if (role === "kontingen") location.href = "/portal/index.html";
    else                            location.href = "/login.html";
  }, 100);
};

window.loginWithIdentifier = async (identifier, password) => {
  const email = identifier.includes("@")
    ? identifier.trim()
    : `${identifier.trim()}@juri.jumbara.local`;
  return sb.auth.signInWithPassword({ email, password });
};

window.logout = async () => {
  await sb.auth.signOut();
  location.href = "/login.html";
};
