// assets/js/auth.js

// ============================================================
// HELPER: Deteksi base path (untuk GitHub Pages subpath)
// ============================================================
function getBasePath() {
  // Kalau ada <base href="...">, pakai itu
  const baseTag = document.querySelector('base');
  if (baseTag) {
    const href = baseTag.getAttribute('href') || './';
    // Resolve relatif terhadap URL halaman saat ini
    return new URL(href, window.location.href).href;
  }
  // Fallback: root domain
  return new URL('/', window.location.origin).href;
}

function goTo(path) {
  // Gabungkan base + path relatif
  const base = getBasePath();
  window.location.href = new URL(path, base).href;
}

// ============================================================
// TERJEMAHAN ERROR SUPABASE → BAHASA INDONESIA
// ============================================================
function translateAuthError(err) {
  if (!err) return 'Terjadi kesalahan. Silakan coba lagi.';
  const msg = String(err.message || '');
  const code = err.code || err.error_code || '';
  const map = {
    'Invalid login credentials': 'Username atau password salah.',
    'Email not confirmed': 'Email belum dikonfirmasi. Cek kotak masuk Anda.',
    'User already registered': 'Username sudah dipakai. Silakan pilih yang lain.',
    'Password should be at least 6 characters': 'Password minimal 6 karakter.',
    'Email rate limit exceeded': 'Terlalu banyak percobaan. Coba lagi beberapa menit.',
    'Invalid email': 'Format username tidak valid.',
    'signup_disabled': 'Pendaftaran sedang ditutup.',
  };
  if (map[msg]) return map[msg];
  if (code === 'invalid_credentials') return 'Username atau password salah.';
  if (code === 'email_not_confirmed') return 'Email belum dikonfirmasi.';
  if (code === 'user_already_exists') return 'Username sudah dipakai.';
  if (code === 'over_email_send_rate_limit') return 'Terlalu banyak percobaan. Coba lagi nanti.';
  return msg || 'Terjadi kesalahan. Silakan coba lagi.';
}

// ============================================================
// LOGIN
// ============================================================
async function loginUser(username, password) {
  const email = username.includes('@') ? username : `${username}@jumbara.id`;

  const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw new Error(translateAuthError(error));

  // Catat log (best-effort, tidak boleh menggagalkan login)
  try {
    await catatLog('auth', 'login', `User ${username} berhasil login`, 'login');
  } catch (logError) {
    console.warn('Gagal mencatat log login (diabaikan):', logError?.message);
  }

  return data;
}

// ============================================================
// LOGOUT
// ============================================================
async function logoutUser() {
  const { data: { session } } = await window.supabaseClient.auth.getSession();

  if (session) {
    try {
      await catatLog('auth', 'logout', `User ${session.user.email} logout`, 'logout');
    } catch (logError) {
      console.warn('Gagal mencatat log logout (diabaikan):', logError?.message);
    }
  }

  // Try-catch signOut — kalau gagal, tetap redirect
  try {
    await window.supabaseClient.auth.signOut();
  } catch (signOutErr) {
    console.warn('Gagal signOut:', signOutErr?.message);
  }

  goTo('login.html');
}

// ============================================================
// PROTECT PAGE
// ============================================================
async function protectPage(allowedRoles = []) {
  const { data: { session }, error } = await window.supabaseClient.auth.getSession();

  if (error || !session) {
    goTo('login.html');
    return null;
  }

  const role = session.user.app_metadata?.role || 'publik';

  // Bypass super_admin
  if (role === 'super_admin') return { user: session.user, role };

  // Cek allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect dengan pesan via query string (lebih baik dari alert)
    goTo(`index.html?denied=1`);
    return null;
  }

  return { user: session.user, role };
}

// ============================================================
// CATAT LOG
// ============================================================
async function catatLog(kategori, aksi, deskripsi, jenis, alasan = null) {
  try {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) return;

    const { error } = await window.supabaseClient.from('audit_log').insert([{
      user_id: session.user.id,
      user_role: session.user.app_metadata?.role || 'publik',
      username: session.user.email,
      kategori: kategori,
      aksi: aksi,
      entitas: jenis,
      alasan: alasan,
      data_baru: { deskripsi: deskripsi }
    }]);

    if (error) {
      console.warn('Gagal mencatat log:', error.message);
    }
  } catch (err) {
    // JANGAN throw — log tidak boleh menggagalkan aksi utama
    console.warn('Gagal mencatat log (exception):', err?.message);
  }
}

// ============================================================
// RENDER MENU SIDEBAR (dinamis dari tabel menu_admin)
// ============================================================
async function renderMenu(role, activePage = '') {
  const { data: menus, error } = await window.supabaseClient
    .from('menu_admin')
    .select('*')
    .eq('is_active', true)
    .order('urutan');

  if (error || !menus) {
    console.error('Gagal memuat menu:', error);
    return '<p class="text-red-500 text-sm px-4">Gagal memuat menu.</p>';
  }

  // Normalisasi role_akses: bisa array (text[]) atau string comma-separated
  const normalizeRoles = (raw) => {
    if (Array.isArray(raw)) return raw;
    return String(raw || '').split(',').map(s => s.trim()).filter(Boolean);
  };

  const filteredMenus = menus.filter(m => normalizeRoles(m.role_akses).includes(role));

  if (!filteredMenus.length) {
    return '<p class="text-slate-400 text-xs px-4 py-2">Tidak ada menu untuk role ini.</p>';
  }

  let html = '';
  let lastKategori = '';

  filteredMenus.forEach(m => {
    // Divider antar kategori
    if (m.kategori && m.kategori !== lastKategori) {
      if (lastKategori !== '') html += '<div class="my-2 border-t border-slate-200 dark:border-slate-700"></div>';
      lastKategori = m.kategori;
    }

    // Deteksi active
    const fileName = String(m.url || '').split('/').pop().replace('.html', '');
    const isActive = fileName === activePage ? 'active' : '';

    // Icon + label
    html += `<a href="${m.url}" class="sidebar-link ${isActive}">${m.icon || ''} ${m.label}</a>`;
  });

  return html;
}
