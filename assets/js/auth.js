// assets/js/auth.js

// Fungsi Login
async function loginUser(username, password) {
  // Karena Supabase butuh email, kita ubah username menjadi email format (jika tidak pakai email asli)
  // Contoh: jika user ketik "budi", jadikan "budi@jumbara.local"
  const email = username.includes('@') ? username : `${username}@jumbara.local`;

  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Fungsi Logout
async function logoutUser() {
  await window.supabaseClient.auth.signOut();
  window.location.href = '/login.html';
}

// Fungsi Cek Sesi & Redirect sesuai Role
async function checkAuthAndRedirect() {
  const { data: { session }, error } = await window.supabaseClient.auth.getSession();
  
  if (error || !session) {
    // Jika tidak ada sesi, dan bukan di halaman login, tendang ke login
    if (!window.location.pathname.includes('login.html')) {
      window.location.href = '/login.html';
    }
    return null;
  }

  // Ambil role dari metadata user (diatur saat bikin user di Supabase)
  const role = session.user.app_metadata?.role || 'publik';
  
  return { user: session.user, role: role };
}

// Proteksi Halaman (Panggil ini di halaman admin/juri/portal)
async function protectPage(requiredRole) {
  const auth = await checkAuthAndRedirect();
  if (!auth) return; // Akan diredirect ke login oleh checkAuthAndRedirect

  if (requiredRole && auth.role !== requiredRole && auth.role !== 'super_admin') {
    alert('Akses Ditolak: Anda tidak memiliki izin ke halaman ini.');
    window.location.href = '/index.html';
  }
}
