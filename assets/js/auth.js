// assets/js/auth.js

// ==========================================
// FUNGSI SUNTIK HEADER MOBILE OTOMATIS
// ==========================================
function injectMobileHeader(roleText) {
  // Cek jika header sudah ada untuk mencegah duplikasi
  if (!document.getElementById('mobileHeader')) {
    const header = document.createElement('div');
    header.id = 'mobileHeader';
    // Class ini akan diatur oleh custom.css (tampil di HP, sembunyi di PC)
    header.className = 'header-mobile justify-between items-center p-4 text-white shadow-md sticky top-0 z-40';
    header.style.backgroundColor = '#B71C1C';
    header.innerHTML = `
      <div>
        <h1 class="text-lg font-bold">Jumbara PMI</h1>
        <p class="text-xs text-red-100">${roleText}</p>
      </div>
      <button onclick="logoutUser()" class="text-sm font-bold bg-white text-red-700 px-3 py-1.5 rounded-lg shadow">Keluar</button>
    `;
    
    // Masukkan header ke paling atas body
    document.body.insertBefore(header, document.body.firstChild);
  }
}

// ==========================================
// FUNGSI AUTENTIKASI
// ==========================================

async function loginUser(username, password) {
  const email = username.includes('@') ? username : `${username}@jumbara.local`;
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) throw new Error(error.message);
  return data;
}

async function logoutUser() {
  await window.supabaseClient.auth.signOut();
  window.location.href = '/login.html';
}

async function protectPage(allowedRoles = []) {
  const { data: { session }, error } = await window.supabaseClient.auth.getSession();
  
  if (error || !session) {
    window.location.href = '/login.html';
    return null;
  }

  const role = session.user.app_metadata?.role || 'publik';
  const roleText = role.replace('_', ' ').toUpperCase();

  // Panggil fungsi untuk menyuntikkan Header Mobile secara otomatis
  injectMobileHeader(roleText);

  // Super admin selalu diizinkan
  if (role === 'super_admin') return { user: session.user, role };

  // Cek apakah role ada di daftar yang diizinkan
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    alert('Akses Ditolak: Anda tidak memiliki izin ke halaman ini.');
    window.location.href = '/';
    return null;
  }

  return { user: session.user, role };
}
