// assets/js/auth.js

async function loginUser(username, password) {
  // PERBAIKAN: Ubah @jumbara.local menjadi @jumbara.id
  const email = username.includes('@') ? username : `${username}@jumbara.id`;
  
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  // PERBAIKAN: Bungkus catatLog dengan try-catch agar tidak menggagalkan login jika RLS ketat
  try {
    await catatLog('auth', 'login', `User ${username} berhasil login`, 'login');
  } catch (logError) {
    console.warn('Gagal mencatat log login (diabaikan):', logError.message);
  }

  return data;
}

async function logoutUser() {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (session) {
    // Tambahkan try-catch kecil di sini juga agar proses logout tidak macet jika log gagal
    try {
      await catatLog('auth', 'logout', `User ${session.user.email} logout`, 'logout');
    } catch (logError) {
      console.warn('Gagal mencatat log logout (diabaikan):', logError.message);
    }
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
async function catatLog(kategori, aksi, deskripsi, jenis, alasan = null) {
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
      alasan: alasan,
      data_baru: { deskripsi: deskripsi }
    }]);
  } catch (err) {
    console.warn('Gagal mencatat log:', err.message);
    // Melempar error agar bisa ditangkap oleh try-catch di fungsi pemanggil (jika diperlukan)
    throw err; 
  }
}
