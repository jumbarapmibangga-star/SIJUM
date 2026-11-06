// assets/auth-guard.js
(async () => {
  const need = document.body.dataset.requireRole;
  if (!need) return;

  // Beri waktu 0.5 detik agar Supabase selesai memuat session dari browser
  await new Promise(resolve => setTimeout(resolve, 500));

  const profile = await getMyProfile();
  
  if (!profile || !profile.aktif) {
    console.log("Guard: Profil tidak ditemukan atau tidak aktif. Lempar ke login.");
    await sb.auth.signOut();
    location.href = "/login.html";
    return;
  }

  if (profile.role !== need) {
    console.log("Guard: Role tidak cocok. Lempar ke halaman yang sesuai.");
    redirectByRole(profile.role); 
    return;
  }

  // Jika lolos, ganti nama user di HTML
  document.querySelectorAll("[data-user-nama]").forEach(el => el.textContent = profile.nama);
})();
