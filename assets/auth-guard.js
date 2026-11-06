(async () => {
  const need = document.body.dataset.requireRole;
  if (!need) return;

  const profile = await getMyProfile();
  if (!profile || !profile.aktif) {
    await sb.auth.signOut();
    location.href = "/login.html";
    return;
  }
  if (profile.role !== need) { redirectByRole(profile.role); return; }

  document.querySelectorAll("[data-user-nama]").forEach(el => el.textContent = profile.nama);
})();
