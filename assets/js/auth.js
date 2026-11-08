// assets/js/auth.js

async function loginUser(username, password) {
  const email = username.includes('@') ? username : `${username}@jumbara.local`;
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  // Catat Log Login
  await catatLog('auth', 'login', `User ${username} berhasil login`, 'login');

  return data;
}

async function logoutUser() {
  // Catat Log Logout (sebelum signOut)
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (session) {
    await catatLog('auth', 'logout', `User ${session.user.email} logout`, 'logout');
  }
  
  await window.supabaseClient.auth.signOut();
  window.location.href = 'login.html';
}

async function protectPage(allowedRoles = []) {
  const { data: { session }, error } = await window.supabaseClient.auth.getSession();
  
  if (error || !session) {
    window.location.href = 'login.html';
    return null;
  }

  const role = session.user.app_metadata?.role || 'publik';

  if (role === 'super_admin') return { user: session.user, role };

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    alert('Akses Ditolak: Anda tidak memiliki izin ke halaman ini.');
    window.location.href = 'index.html';
    return null;
  }
  return { user: session.user, role };
}

// FUNGSI BARU: Mencatat Log ke Database
async function catatLog(kategori, aksi, deskripsi, jenis) {
  try {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) return;

    await window.supabaseClient.from('audit_log').insert([{
      user_id: session.user.id,
      user_role: session.user.app_metadata?.role || 'publik',
      username: session.user.email,
      kategori: kategori,
      aksi: aksi,
      entitas: jenis,
      data_baru: { deskripsi: deskripsi }
    }]);
  } catch (err) {
    console.warn('Gagal mencatat log:', err.message);
  }
}
