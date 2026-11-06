window.toast = (msg, type = "info") => {
  const colors = { info:"bg-slate-800", ok:"bg-green-600", err:"bg-red-600", warn:"bg-amber-600" };
  const el = document.createElement("div");
  el.className = `fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded text-white shadow z-50 ${colors[type]}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
};

window.statusBadge = (status) => {
  const map = {
    draft:"bg-slate-200 text-slate-800", submitted:"bg-blue-100 text-blue-800",
    verified:"bg-green-100 text-green-800", rejected:"bg-red-100 text-red-800",
    revision:"bg-amber-100 text-amber-800",
  };
  return `<span class="px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? "bg-slate-200"}">${status}</span>`;
};

window.esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));
