// assets/js/auth.js

// Fungsi Login
async function loginUser(username, password) {
  // Ubah username jadi email palsu jika tidak ada '@'
  const email = username.includes('@') ? username : `${username}@jumbara.local`;

  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) throw new Error(error.message);
  return data;
}

// Fungsi Logout
async function logoutUser() {
  await window.supabaseClient.auth.signOut();
  window.location.href = '/login.html';
}

// Fungsi Proteksi Halaman
async function protectPage(allowedRoles = []) {
  const { data: { session }, error } = await window.supabaseClient.auth.getSession();
  
  if (error || !session) {
    window.location.href = '/login.html';
    return null;
  }

  const role = session.user.app_metadata?.role || 'publik';

  // Super admin selalu boleh masuk
  if (role === 'super_admin') return { user: session.user, role };

  // Cek apakah role ada di daftar yang diizinkan
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    alert('Akses Ditolak: Anda tidak memiliki izin ke halaman ini.');
    window.location.href = '/';
    return null;
  }

  return { user: session.user, role };
}
