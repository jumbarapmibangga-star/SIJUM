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
// FUNGSI GLOBAL UNTUK MERENDER MENU SIDEBAR (BEBAS HARDCODE)
async function renderMenu(role, activePage = '') {
  // Ambil menu dari database
  const { data: menus, error } = await window.supabaseClient
    .from('menu_admin')
    .select('*')
    .eq('is_active', true)
    .order('urutan');

  if (error || !menus) {
    console.error('Gagal memuat menu:', error);
    return '<p class="text-red-500 text-sm">Gagal memuat menu.</p>';
  }

  // Filter menu yang boleh diakses oleh role ini
  const filteredMenus = menus.filter(m => m.role_akses.includes(role));

  let html = '';
  let lastKategori = '';

  filteredMenus.forEach(m => {
    if (m.kategori !== lastKategori) {
      if (lastKategori !== '') html += '<div class="my-2 border-t border-slate-200"></div>';
      lastKategori = m.kategori;
    }

    const isActive = m.url.includes(activePage) ? 'active' : '';
    html += `<a href="${m.url}" class="sidebar-link ${isActive}">${m.icon || ''} ${m.label}</a>`;
  });

  return html;
}
