// assets/js/auth.js

// ==========================================
// TRIK PATH DINAMIS
// Ubah menjadi '/' jika pindah ke Vercel/Domain Utama
// Biarkan './' jika di GitHub Pages (Sub-folder)
// ==========================================
const BASE_URL = './'; 

async function loginUser(username, password) {
  const email = username.includes('@') ? username : `${username}@jumbara.local`;
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

async function logoutUser() {
  await window.supabaseClient.auth.signOut();
  window.location.href = BASE_URL + 'login.html'; 
}

async function protectPage(allowedRoles = []) {
  const { data: { session }, error } = await window.supabaseClient.auth.getSession();
  
  if (error || !session) {
    window.location.href = BASE_URL + 'login.html';
    return null;
  }

  const role = session.user.app_metadata?.role || 'publik';

  if (role === 'super_admin') return { user: session.user, role };

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    alert('Akses Ditolak: Anda tidak memiliki izin ke halaman ini.');
    window.location.href = BASE_URL + 'index.html';
    return null;
  }
  return { user: session.user, role };
}
