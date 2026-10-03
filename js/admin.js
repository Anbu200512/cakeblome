/* CakeBloom — Admin Dashboard */
(function () {
  'use strict';

  const user = cbUser();
  if (!user || user.role !== 'admin') { location.href = 'login.html'; return; }

  const read = k => cbRead(k, []);
  const bookings = read(CB_KEYS.bookings), packages = read(CB_KEYS.packages), themes = read(CB_KEYS.themes);
  const slots = read(CB_KEYS.slots), proofs = read(CB_KEYS.proofs), prints = read(CB_KEYS.prints);
  const payments = read(CB_KEYS.payments), users = read(CB_KEYS.users), enquiries = read(CB_KEYS.enquiries);

  const parents = users.filter(u => u.role === 'parent');
  const pkgById = id => packages.find(p => p.id === id);
  const thById = id => themes.find(t => t.id === id);
  const userById = id => users.find(u => u.id === id);
  const statusBadge = s => ({ confirmed: 'badge-green', pending: 'badge-yellow', completed: 'badge-blue', cancelled: 'badge-red', Paid: 'badge-green', Unpaid: 'badge-yellow', Processing: 'badge-blue', Delivered: 'badge-green', 'In Progress': 'badge-gray', New: 'badge-pink', Resolved: 'badge-green' }[s] || 'badge-gray');

  const SECTIONS = [
    ['overview', 'Overview', 'layout-dashboard'], ['bookings', 'Bookings', 'calendar-days'],
    ['customers', 'Customers', 'users'], ['packages', 'Packages', 'gift'],
    ['themes', 'Themes', 'palette'], ['slots', 'Session Slots', 'clock'],
    ['proofs', 'Proof Galleries', 'images'], ['prints', 'Print Orders', 'printer'],
    ['payments', 'Payments', 'wallet'], ['enquiries', 'Enquiries', 'mail'],
    ['settings', 'Settings', 'settings'],
  ];

  const sidebar = document.getElementById('admin-sidebar');
  sidebar.innerHTML = `
    <div class="p-4 border-b border-pink-100 dark:border-white/10 flex items-center gap-3">
      <span class="w-11 h-11 rounded-2xl bg-pink-500 grid place-items-center text-white"><i data-lucide="shield-check" class="w-5 h-5"></i></span>
      <div>
        <div class="font-display font-bold text-[#3B3654] dark:text-white">Studio Admin</div>
        <div class="text-xs font-semibold text-[#8B86A3]">CakeBloom Control Center</div>
      </div>
    </div>
    <nav class="p-3 space-y-1" id="admin-nav">
      ${SECTIONS.map(([id, label, ic]) => `<a href="admin-dashboard.html#${id}" class="dash-link" data-sec="${id}"><i data-lucide="${ic}" class="w-[18px] h-[18px]"></i>${label}</a>`).join('')}
      <button class="dash-link w-full text-rose-500" id="admin-logout"><i data-lucide="log-out" class="w-[18px] h-[18px]"></i>Logout</button>
    </nav>`;

  const main = document.getElementById('admin-main');
  main.innerHTML = `
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="font-display font-bold text-2xl sm:text-3xl text-[#3B3654] dark:text-white" id="admin-title">Overview</h1>
      <p class="text-sm font-semibold text-[#8B86A3]">Manage bookings, packages, slots and more.</p>
    </div>
  </div>

  <section id="sec-overview" class="dash-sec space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" id="ad-stats"></div>
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="cb-card p-6">
        <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white mb-4">Upcoming Sessions</h3>
        <div class="space-y-3" id="ad-upcoming"></div>
      </div>
      <div class="cb-card p-6">
        <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white mb-4">Recent Payments</h3>
        <div class="space-y-3" id="ad-recent-pay"></div>
      </div>
    </div>
  </section>

  <section id="sec-bookings" class="dash-sec hidden">
    <div class="cb-card overflow-hidden">
      <div class="p-5 border-b border-pink-100 dark:border-white/10 flex items-center justify-between">
        <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">All Bookings</h3>
        <select id="bk-status-filter" class="cb-input !w-40 !py-2 text-sm">
          <option value="all">All statuses</option><option>confirmed</option><option>pending</option><option>completed</option><option>cancelled</option>
        </select>
      </div>
      <div class="overflow-x-auto" id="ad-bookings-table"></div>
    </div>
  </section>

  <section id="sec-customers" class="dash-sec hidden">
    <div class="cb-card overflow-hidden">
      <div class="p-5 border-b border-pink-100 dark:border-white/10"><h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">Customers</h3></div>
      <div class="overflow-x-auto" id="ad-customers-table"></div>
    </div>
  </section>

  <section id="sec-packages" class="dash-sec hidden">
    <div class="cb-card overflow-hidden">
      <div class="p-5 border-b border-pink-100 dark:border-white/10 flex items-center justify-between">
        <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">Packages</h3>
        <button class="cb-btn cb-btn-primary !py-2 text-sm" id="add-package"><i data-lucide="plus" class="w-4 h-4"></i>Add Package</button>
      </div>
      <div class="overflow-x-auto" id="ad-packages-table"></div>
    </div>
  </section>

  <section id="sec-themes" class="dash-sec hidden">
    <div class="cb-card overflow-hidden">
      <div class="p-5 border-b border-pink-100 dark:border-white/10 flex items-center justify-between">
        <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">Themes</h3>
        <button class="cb-btn cb-btn-primary !py-2 text-sm" id="add-theme"><i data-lucide="plus" class="w-4 h-4"></i>Add Theme</button>
      </div>
      <div class="overflow-x-auto" id="ad-themes-table"></div>
    </div>
  </section>

  <section id="sec-slots" class="dash-sec hidden">
    <div class="cb-card overflow-hidden">
      <div class="p-5 border-b border-pink-100 dark:border-white/10 flex items-center justify-between flex-wrap gap-3">
        <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">Session Slots</h3>
        <div class="flex gap-2">
          <select id="slot-day" class="cb-input !w-44 !py-2 text-sm"></select>
          <button class="cb-btn cb-btn-primary !py-2 text-sm" id="add-slot"><i data-lucide="plus" class="w-4 h-4"></i>Add Slot</button>
        </div>
      </div>
      <div class="overflow-x-auto" id="ad-slots-table"></div>
    </div>
  </section>

  <section id="sec-proofs" class="dash-sec hidden">
    <div class="cb-card overflow-hidden">
      <div class="p-5 border-b border-pink-100 dark:border-white/10"><h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">Proof Galleries</h3></div>
      <div class="p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="ad-proofs-grid"></div>
    </div>
  </section>

  <section id="sec-prints" class="dash-sec hidden">
    <div class="cb-card overflow-hidden">
      <div class="p-5 border-b border-pink-100 dark:border-white/10"><h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">Print Orders</h3></div>
      <div class="overflow-x-auto" id="ad-prints-table"></div>
    </div>
  </section>

  <section id="sec-payments" class="dash-sec hidden">
    <div class="cb-card overflow-hidden">
      <div class="p-5 border-b border-pink-100 dark:border-white/10"><h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">Payments</h3></div>
      <div class="overflow-x-auto" id="ad-payments-table"></div>
    </div>
  </section>

  <section id="sec-enquiries" class="dash-sec hidden">
    <div class="cb-card overflow-hidden">
      <div class="p-5 border-b border-pink-100 dark:border-white/10"><h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">Enquiries</h3></div>
      <div class="overflow-x-auto" id="ad-enquiries-table"></div>
    </div>
  </section>

  <section id="sec-settings" class="dash-sec hidden">
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="cb-card p-6">
        <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white mb-2">Studio Settings</h3>
        <p class="text-sm font-semibold text-[#8B86A3] mb-5">These preferences apply to the demo store.</p>
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-4">
            <div><div class="font-bold text-sm text-[#3B3654] dark:text-white">Advance payment required</div><div class="text-xs font-semibold text-[#8B86A3]">50% advance to confirm bookings</div></div>
            <button class="w-12 h-7 rounded-full bg-pink-500 relative transition" id="set-advance"><span class="absolute top-1 end-1 w-5 h-5 rounded-full bg-white shadow"></span></button>
          </div>
          <div class="flex items-center justify-between gap-4">
            <div><div class="font-bold text-sm text-[#3B3654] dark:text-white">Email notifications</div><div class="text-xs font-semibold text-[#8B86A3]">Send booking & payment emails</div></div>
            <button class="w-12 h-7 rounded-full bg-pink-500 relative transition" id="set-email"><span class="absolute top-1 end-1 w-5 h-5 rounded-full bg-white shadow"></span></button>
          </div>
        </div>
      </div>
      <div class="cb-card p-6">
        <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white mb-2">Demo Data</h3>
        <p class="text-sm font-semibold text-[#8B86A3] mb-5">Reset all localStorage data back to the original demo seed. This cannot be undone.</p>
        <button class="cb-btn cb-btn-outline !border-rose-300 !text-rose-500" id="reset-data"><i data-lucide="rotate-ccw" class="w-4 h-4"></i>Reset Demo Data</button>
      </div>
    </div>
  </section>`;

  /* ---------------- Section switching ---------------- */
  const titles = Object.fromEntries(SECTIONS.map(([id, label]) => [id, label]));
  function showSection(id) {
    if (!titles[id]) id = 'overview';
    document.querySelectorAll('.dash-sec').forEach(s => s.classList.add('hidden'));
    document.getElementById('sec-' + id).classList.remove('hidden');
    document.querySelectorAll('#admin-nav .dash-link').forEach(a => a.classList.toggle('active', a.getAttribute('data-sec') === id));
    document.getElementById('admin-title').textContent = titles[id];
    ({ overview: renderOverview, bookings: renderBookings, customers: renderCustomers, packages: renderPackages, themes: renderThemes, slots: renderSlots, proofs: renderProofs, prints: renderPrints, payments: renderPayments, enquiries: renderEnquiries }[id] || (() => {}))();
    cbRefreshIcons();
  }
  document.getElementById('admin-nav').addEventListener('click', (e) => {
    const a = e.target.closest('[data-sec]');
    if (a) { e.preventDefault(); location.hash = a.getAttribute('data-sec'); }
  });
  window.addEventListener('hashchange', () => showSection(location.hash.slice(1)));
  document.getElementById('admin-logout').addEventListener('click', () => { localStorage.removeItem(CB_KEYS.user); location.href = 'index.html'; });

  // Mobile drawer
  const drawerBtn = document.getElementById('drawer-btn');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawerBtn) drawerBtn.addEventListener('click', () => { drawer.classList.toggle('hidden'); overlay.classList.toggle('hidden'); });
  if (overlay) overlay.addEventListener('click', () => { drawer.classList.add('hidden'); overlay.classList.add('hidden'); });

  /* ---------------- Overview ---------------- */
  function renderOverview() {
    const revenue = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
    const upcoming = bookings.filter(b => b.status === 'confirmed').sort((a, b) => a.date.localeCompare(b.date));
    const stats = [
      { label: 'Total Bookings', value: bookings.length, icon: 'calendar-days', color: 'text-pink-400' },
      { label: 'Upcoming Sessions', value: upcoming.length, icon: 'calendar-heart', color: 'text-violet-400' },
      { label: 'Customers', value: parents.length, icon: 'users', color: 'text-sky-400' },
      { label: 'Completed Sessions', value: bookings.filter(b => b.status === 'completed').length, icon: 'circle-check', color: 'text-emerald-400' },
      { label: 'Pending Payments', value: payments.filter(p => p.status === 'Unpaid').length, icon: 'wallet', color: 'text-amber-400' },
      { label: 'Print Orders', value: prints.length, icon: 'printer', color: 'text-rose-400' },
      { label: 'Revenue', value: cbMoney(revenue), icon: 'indian-rupee', color: 'text-emerald-400' },
    ];
    document.getElementById('ad-stats').innerHTML = stats.map(c => `
      <div class="stat-card flex items-center gap-4">
        <span class="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-white/10 grid place-items-center"><i data-lucide="${c.icon}" class="w-6 h-6 ${c.color}"></i></span>
        <div><div class="font-display font-bold text-xl text-[#3B3654] dark:text-white">${c.value}</div><div class="text-xs font-bold text-[#8B86A3]">${c.label}</div></div>
      </div>`).join('');

    document.getElementById('ad-upcoming').innerHTML = upcoming.length ? upcoming.slice(0, 5).map(b => {
      const u = userById(b.userId), p = pkgById(b.packageId);
      return `<div class="flex items-center gap-3 p-3 rounded-2xl bg-pink-50/60 dark:bg-white/5">
        <img src="${p?.image}" class="w-12 h-12 rounded-xl object-cover" alt="">
        <div class="flex-1 min-w-0">
          <div class="font-bold text-sm text-[#3B3654] dark:text-white truncate">${cbEscape(u?.name || 'Parent')} — ${cbEscape(p?.name || '')}</div>
          <div class="text-xs font-semibold text-[#8B86A3]">${cbDate(b.date)} · ${cbEscape(b.time)}</div>
        </div>
        <span class="badge ${statusBadge(b.status)}">${b.status}</span>
      </div>`;
    }).join('') : '<p class="font-semibold text-[#8B86A3] text-sm">No upcoming sessions.</p>';

    document.getElementById('ad-recent-pay').innerHTML = payments.length ? payments.slice(0, 5).map(p => `
      <div class="flex items-center justify-between gap-3 p-3 rounded-2xl bg-violet-50/60 dark:bg-white/5">
        <div>
          <div class="font-bold text-sm text-[#3B3654] dark:text-white">${p.txnId}</div>
          <div class="text-xs font-semibold text-[#8B86A3]">${cbDate(p.date)} · ${cbEscape(p.method)}</div>
        </div>
        <div class="text-end">
          <div class="font-display font-bold text-[#3B3654] dark:text-white">${cbMoney(p.amount)}</div>
          <span class="badge ${statusBadge(p.status)}">${p.status}</span>
        </div>
      </div>`).join('') : '<p class="font-semibold text-[#8B86A3] text-sm">No payments yet.</p>';
    cbRefreshIcons();
  }

  /* ---------------- Bookings ---------------- */
  function renderBookings() {
    const f = document.getElementById('bk-status-filter').value;
    const list = bookings.filter(b => f === 'all' || b.status === f).sort((a, b) => b.date.localeCompare(a.date));
    document.getElementById('ad-bookings-table').innerHTML = list.length ? `
      <table class="cb-table min-w-[760px]">
        <thead><tr><th>ID</th><th>Customer</th><th>Package / Theme</th><th>Schedule</th><th>Status</th><th>Update</th></tr></thead>
        <tbody>${list.map(b => {
          const u = userById(b.userId), p = pkgById(b.packageId), t = thById(b.themeId);
          return `<tr>
            <td class="font-bold">#${b.id.slice(-6).toUpperCase()}</td>
            <td><span class="font-bold text-[#3B3654] dark:text-white">${cbEscape(u?.name || '—')}</span><br><span class="text-xs text-[#8B86A3]">${cbEscape(u?.childName || '')}</span></td>
            <td>${cbEscape(p?.name || '—')}<br><span class="text-xs text-[#8B86A3]">${cbEscape(t?.name || '')} theme</span></td>
            <td class="whitespace-nowrap">${cbDate(b.date)}<br><span class="text-xs text-[#8B86A3]">${cbEscape(b.time)}</span></td>
            <td><span class="badge ${statusBadge(b.status)}">${b.status}</span></td>
            <td>
              <select class="cb-input !w-32 !py-1.5 text-xs" data-bk-status="${b.id}">
                ${['confirmed', 'pending', 'completed', 'cancelled'].map(s => `<option ${s === b.status ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </td>
          </tr>`;
        }).join('')}</tbody>
      </table>` : '<div class="p-10 text-center font-semibold text-[#8B86A3]">No bookings found.</div>';
    document.querySelectorAll('[data-bk-status]').forEach(sel => sel.addEventListener('change', () => {
      const b = bookings.find(x => x.id === sel.getAttribute('data-bk-status'));
      b.status = sel.value; cbWrite(CB_KEYS.bookings, bookings);
      cbToast(`Booking #${b.id.slice(-6).toUpperCase()} marked ${b.status}`);
      renderBookings();
    }));
    cbRefreshIcons();
  }
  document.getElementById('bk-status-filter').addEventListener('change', renderBookings);

  /* ---------------- Customers ---------------- */
  function renderCustomers() {
    document.getElementById('ad-customers-table').innerHTML = parents.length ? `
      <table class="cb-table min-w-[640px]">
        <thead><tr><th>Parent</th><th>Contact</th><th>Child</th><th>Bookings</th><th>Total Spent</th></tr></thead>
        <tbody>${parents.map(u => {
          const ubs = bookings.filter(b => b.userId === u.id);
          const spent = payments.filter(p => p.userId === u.id && p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
          return `<tr>
            <td><span class="font-bold text-[#3B3654] dark:text-white">${cbEscape(u.name)}</span><br><span class="text-xs text-[#8B86A3]">Since ${cbDate(u.createdAt)}</span></td>
            <td>${cbEscape(u.email)}<br><span class="text-xs text-[#8B86A3]">${cbEscape(u.mobile)}</span></td>
            <td>${cbEscape(u.childName || '—')}<br><span class="text-xs text-[#8B86A3]">${u.childDob ? cbDate(u.childDob) : ''}</span></td>
            <td><span class="badge badge-blue">${ubs.length}</span></td>
            <td class="font-bold">${cbMoney(spent)}</td>
          </tr>`;
        }).join('')}</tbody>
      </table>` : '<div class="p-10 text-center font-semibold text-[#8B86A3]">No customers yet.</div>';
    cbRefreshIcons();
  }

  /* ---------------- Packages CRUD ---------------- */
  function renderPackages() {
    document.getElementById('ad-packages-table').innerHTML = `
      <table class="cb-table min-w-[720px]">
        <thead><tr><th>Package</th><th>Duration</th><th>Photos</th><th>Price</th><th>Popular</th><th>Actions</th></tr></thead>
        <tbody>${packages.map(p => `<tr>
          <td><div class="flex items-center gap-3"><img src="${p.image}" class="w-12 h-12 rounded-xl object-cover" alt=""><span class="font-bold text-[#3B3654] dark:text-white">${cbEscape(p.name)}</span></div></td>
          <td>${cbEscape(p.duration)}</td><td>${p.photos}</td>
          <td class="font-bold">${cbMoney(p.price)}</td>
          <td>${p.popular ? '<span class="badge badge-pink">Popular</span>' : '<span class="text-xs text-[#8B86A3]">—</span>'}</td>
          <td class="whitespace-nowrap">
            <button class="cb-btn cb-btn-ghost !py-1.5 !px-3 text-xs" data-edit-pkg="${p.id}"><i data-lucide="pencil" class="w-3.5 h-3.5"></i>Edit</button>
            <button class="cb-btn cb-btn-ghost !py-1.5 !px-3 text-xs !text-rose-500" data-del-pkg="${p.id}"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i>Delete</button>
          </td>
        </tr>`).join('')}</tbody>
      </table>`;
    document.querySelectorAll('[data-edit-pkg]').forEach(b => b.addEventListener('click', () => pkgForm(b.getAttribute('data-edit-pkg'))));
    document.querySelectorAll('[data-del-pkg]').forEach(b => b.addEventListener('click', () => {
      const id = b.getAttribute('data-del-pkg');
      if (!confirm('Delete this package?')) return;
      cbWrite(CB_KEYS.packages, packages.filter(p => p.id !== id));
      cbToast('Package deleted', 'info'); renderPackages();
    }));
    cbRefreshIcons();
  }
  document.getElementById('add-package').addEventListener('click', () => pkgForm(null));

  function pkgForm(id) {
    const p = id ? pkgById(id) : { name: '', theme: '', duration: '90 mins', photos: 20, backdrop: '', cake: '', props: '', price: 4999, image: 'assets/images/pkg-custom.svg', popular: false, description: '' };
    const m = document.getElementById('crud-modal');
    m.querySelector('.modal-content').innerHTML = `
      <div class="p-6">
        <h3 class="font-display font-bold text-xl text-[#3B3654] dark:text-white mb-5">${id ? 'Edit Package' : 'Add Package'}</h3>
        <form id="pkg-form" class="space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <div><label class="cb-label">Name</label><input id="pf-name" class="cb-input" value="${cbEscape(p.name)}" required></div>
            <div><label class="cb-label">Theme</label><input id="pf-theme" class="cb-input" value="${cbEscape(p.theme)}" required></div>
          </div>
          <div><label class="cb-label">Description</label><textarea id="pf-desc" class="cb-input" rows="2">${cbEscape(p.description)}</textarea></div>
          <div class="grid sm:grid-cols-3 gap-4">
            <div><label class="cb-label">Duration</label><input id="pf-duration" class="cb-input" value="${cbEscape(p.duration)}"></div>
            <div><label class="cb-label">Edited Photos</label><input id="pf-photos" type="number" min="1" class="cb-input" value="${p.photos}"></div>
            <div><label class="cb-label">Price (₹)</label><input id="pf-price" type="number" min="0" class="cb-input" value="${p.price}" required></div>
          </div>
          <div class="grid sm:grid-cols-3 gap-4">
            <div><label class="cb-label">Backdrop</label><input id="pf-backdrop" class="cb-input" value="${cbEscape(p.backdrop)}"></div>
            <div><label class="cb-label">Cake</label><input id="pf-cake" class="cb-input" value="${cbEscape(p.cake)}"></div>
            <div><label class="cb-label">Props</label><input id="pf-props" class="cb-input" value="${cbEscape(p.props)}"></div>
          </div>
          <div><label class="cb-label">Image URL</label><input id="pf-image" class="cb-input" value="${cbEscape(p.image)}"></div>
          <label class="flex items-center gap-2 font-bold text-sm text-[#55506E] dark:text-[#C6C1DA]"><input type="checkbox" id="pf-popular" ${p.popular ? 'checked' : ''} class="w-4 h-4 accent-pink-500">Mark as popular</label>
          <div class="flex gap-2">
            <button type="button" class="cb-btn cb-btn-outline flex-1" onclick="cbCloseModal('crud-modal')">Cancel</button>
            <button class="cb-btn cb-btn-primary flex-1">${id ? 'Save Changes' : 'Add Package'}</button>
          </div>
        </form>
      </div>`;
    cbOpenModal('crud-modal');
    document.getElementById('pkg-form').onsubmit = (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById('pf-name').value.trim(), theme: document.getElementById('pf-theme').value.trim(),
        description: document.getElementById('pf-desc').value.trim(), duration: document.getElementById('pf-duration').value.trim(),
        photos: +document.getElementById('pf-photos').value || 0, price: +document.getElementById('pf-price').value || 0,
        backdrop: document.getElementById('pf-backdrop').value.trim(), cake: document.getElementById('pf-cake').value.trim(),
        props: document.getElementById('pf-props').value.trim(), image: document.getElementById('pf-image').value.trim() || p.image,
        popular: document.getElementById('pf-popular').checked,
      };
      if (id) Object.assign(pkgById(id), data);
      else packages.push({ id: cbUid('pkg'), ...data });
      cbWrite(CB_KEYS.packages, packages);
      cbCloseModal('crud-modal');
      cbToast(id ? 'Package updated' : 'Package added');
      renderPackages();
    };
  }

  /* ---------------- Themes CRUD ---------------- */
  function renderThemes() {
    document.getElementById('ad-themes-table').innerHTML = `
      <table class="cb-table min-w-[560px]">
        <thead><tr><th>Theme</th><th>Description</th><th>Actions</th></tr></thead>
        <tbody>${themes.map(t => `<tr>
          <td><div class="flex items-center gap-3"><img src="${t.image}" class="w-12 h-12 rounded-xl object-cover" alt=""><span class="font-bold text-[#3B3654] dark:text-white">${cbEscape(t.name)}</span></div></td>
          <td class="text-sm text-[#6B6585] dark:text-[#A8A2C0]">${cbEscape(t.description)}</td>
          <td class="whitespace-nowrap">
            <button class="cb-btn cb-btn-ghost !py-1.5 !px-3 text-xs" data-edit-th="${t.id}"><i data-lucide="pencil" class="w-3.5 h-3.5"></i>Edit</button>
            <button class="cb-btn cb-btn-ghost !py-1.5 !px-3 text-xs !text-rose-500" data-del-th="${t.id}"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i>Delete</button>
          </td>
        </tr>`).join('')}</tbody>
      </table>`;
    document.querySelectorAll('[data-edit-th]').forEach(b => b.addEventListener('click', () => thForm(b.getAttribute('data-edit-th'))));
    document.querySelectorAll('[data-del-th]').forEach(b => b.addEventListener('click', () => {
      const id = b.getAttribute('data-del-th');
      if (!confirm('Delete this theme?')) return;
      cbWrite(CB_KEYS.themes, themes.filter(t => t.id !== id));
      cbToast('Theme deleted', 'info'); renderThemes();
    }));
    cbRefreshIcons();
  }
  document.getElementById('add-theme').addEventListener('click', () => thForm(null));

  function thForm(id) {
    const t = id ? thById(id) : { name: '', image: 'assets/images/theme-princess.svg', description: '' };
    const m = document.getElementById('crud-modal');
    m.querySelector('.modal-content').innerHTML = `
      <div class="p-6">
        <h3 class="font-display font-bold text-xl text-[#3B3654] dark:text-white mb-5">${id ? 'Edit Theme' : 'Add Theme'}</h3>
        <form id="th-form" class="space-y-4">
          <div><label class="cb-label">Name</label><input id="tf-name" class="cb-input" value="${cbEscape(t.name)}" required></div>
          <div><label class="cb-label">Description</label><textarea id="tf-desc" class="cb-input" rows="2">${cbEscape(t.description)}</textarea></div>
          <div><label class="cb-label">Image URL</label><input id="tf-image" class="cb-input" value="${cbEscape(t.image)}"></div>
          <div class="flex gap-2">
            <button type="button" class="cb-btn cb-btn-outline flex-1" onclick="cbCloseModal('crud-modal')">Cancel</button>
            <button class="cb-btn cb-btn-primary flex-1">${id ? 'Save Changes' : 'Add Theme'}</button>
          </div>
        </form>
      </div>`;
    cbOpenModal('crud-modal');
    document.getElementById('th-form').onsubmit = (e) => {
      e.preventDefault();
      const data = { name: document.getElementById('tf-name').value.trim(), description: document.getElementById('tf-desc').value.trim(), image: document.getElementById('tf-image').value.trim() || t.image };
      if (id) Object.assign(thById(id), data);
      else themes.push({ id: cbUid('th'), ...data });
      cbWrite(CB_KEYS.themes, themes);
      cbCloseModal('crud-modal');
      cbToast(id ? 'Theme updated' : 'Theme added');
      renderThemes();
    };
  }

  /* ---------------- Slots ---------------- */
  function renderSlots() {
    const daySel = document.getElementById('slot-day');
    const days = [...new Set(slots.map(s => s.date))].sort();
    if (!daySel.dataset.init) {
      daySel.innerHTML = days.map(d => `<option value="${d}">${cbDate(d)}</option>`).join('');
      daySel.dataset.init = '1';
    }
    const list = slots.filter(s => s.date === daySel.value).sort((a, b) => a.time.localeCompare(b.time));
    document.getElementById('ad-slots-table').innerHTML = `
      <table class="cb-table min-w-[480px]">
        <thead><tr><th>Date</th><th>Time</th><th>Availability</th><th>Action</th></tr></thead>
        <tbody>${list.map(s => `<tr>
          <td class="font-bold text-[#3B3654] dark:text-white">${cbDate(s.date)}</td>
          <td>${cbEscape(s.time)}</td>
          <td><span class="badge ${s.available ? 'badge-green' : 'badge-red'}">${s.available ? 'Available' : 'Booked'}</span></td>
          <td><button class="cb-btn cb-btn-ghost !py-1.5 !px-3 text-xs" data-toggle-slot="${s.id}">${s.available ? 'Mark Booked' : 'Release'}</button></td>
        </tr>`).join('')}</tbody>
      </table>`;
    document.querySelectorAll('[data-toggle-slot]').forEach(b => b.addEventListener('click', () => {
      const s = slots.find(x => x.id === b.getAttribute('data-toggle-slot'));
      s.available = !s.available; cbWrite(CB_KEYS.slots, slots);
      cbToast(`Slot ${s.time} ${s.available ? 'released' : 'marked booked'}`, 'info');
      renderSlots();
    }));
    cbRefreshIcons();
  }
  document.getElementById('slot-day').addEventListener('change', renderSlots);
  document.getElementById('add-slot').addEventListener('click', () => {
    const daySel = document.getElementById('slot-day');
    const time = prompt('Enter time slot (e.g. 03:00 PM):');
    if (!time) return;
    slots.push({ id: cbUid('sl'), date: daySel.value, time, available: true });
    cbWrite(CB_KEYS.slots, slots);
    cbToast('Slot added'); renderSlots();
  });

  /* ---------------- Proofs ---------------- */
  function renderProofs() {
    document.getElementById('ad-proofs-grid').innerHTML = proofs.length ? proofs.map(pr => {
      const bk = bookings.find(b => b.id === pr.bookingId);
      return `<div class="cb-card overflow-hidden">
        <div class="relative aspect-square">
          <img src="${pr.image}" class="w-full h-full object-cover" alt="">
          <div class="absolute top-2.5 start-2.5 flex gap-1.5">
            ${pr.favorite ? '<span class="badge badge-pink">Fav</span>' : ''}
            ${pr.selected ? '<span class="badge badge-green">Final</span>' : ''}
            ${pr.edited ? '<span class="badge badge-gray">Editing</span>' : ''}
          </div>
        </div>
        <div class="p-3">
          <div class="font-bold text-sm text-[#3B3654] dark:text-white">${cbEscape(pr.caption)}</div>
          <div class="text-xs font-semibold text-[#8B86A3]">Booking #${bk?.id.slice(-6).toUpperCase()} · ${cbEscape(userById(bk?.userId)?.name || '')}</div>
        </div>
      </div>`;
    }).join('') : '<div class="col-span-full p-10 text-center font-semibold text-[#8B86A3]">No proofs uploaded yet.</div>';
    cbRefreshIcons();
  }

  /* ---------------- Prints ---------------- */
  function renderPrints() {
    document.getElementById('ad-prints-table').innerHTML = prints.length ? `
      <table class="cb-table min-w-[640px]">
        <thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Qty</th><th>Amount</th><th>Status</th><th>Update</th></tr></thead>
        <tbody>${prints.map(o => `<tr>
          <td class="font-bold">#${o.id.slice(-6).toUpperCase()}</td>
          <td>${cbEscape(userById(o.userId)?.name || '—')}</td>
          <td>${cbEscape(o.type)}<br><span class="text-xs text-[#8B86A3]">${cbEscape(o.size)}</span></td>
          <td>${o.qty}</td><td class="font-bold">${cbMoney(o.price)}</td>
          <td><span class="badge ${statusBadge(o.status)}">${o.status}</span></td>
          <td><select class="cb-input !w-32 !py-1.5 text-xs" data-print-status="${o.id}">
            ${['Processing', 'In Progress', 'Delivered'].map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select></td>
        </tr>`).join('')}</tbody>
      </table>` : '<div class="p-10 text-center font-semibold text-[#8B86A3]">No print orders yet.</div>';
    document.querySelectorAll('[data-print-status]').forEach(sel => sel.addEventListener('change', () => {
      const o = prints.find(x => x.id === sel.getAttribute('data-print-status'));
      o.status = sel.value; cbWrite(CB_KEYS.prints, prints);
      cbToast(`Print order #${o.id.slice(-6).toUpperCase()} → ${o.status}`);
      renderPrints();
    }));
    cbRefreshIcons();
  }

  /* ---------------- Payments ---------------- */
  function renderPayments() {
    document.getElementById('ad-payments-table').innerHTML = payments.length ? `
      <table class="cb-table min-w-[680px]">
        <thead><tr><th>Payment ID</th><th>Customer</th><th>Booking</th><th>Amount</th><th>Method</th><th>Status</th><th>Update</th></tr></thead>
        <tbody>${payments.map(p => `<tr>
          <td class="font-bold text-[#3B3654] dark:text-white">${p.txnId}</td>
          <td>${cbEscape(userById(p.userId)?.name || '—')}</td>
          <td>#${p.bookingId.slice(-6).toUpperCase()}</td>
          <td class="font-bold">${cbMoney(p.amount)}</td>
          <td>${cbEscape(p.method)}</td>
          <td><span class="badge ${statusBadge(p.status)}">${p.status}</span></td>
          <td><select class="cb-input !w-32 !py-1.5 text-xs" data-pay-status="${p.id}">
            ${['Paid', 'Unpaid', 'Refunded'].map(s => `<option ${s === p.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select></td>
        </tr>`).join('')}</tbody>
      </table>` : '<div class="p-10 text-center font-semibold text-[#8B86A3]">No payments yet.</div>';
    document.querySelectorAll('[data-pay-status]').forEach(sel => sel.addEventListener('change', () => {
      const p = payments.find(x => x.id === sel.getAttribute('data-pay-status'));
      p.status = sel.value; cbWrite(CB_KEYS.payments, payments);
      cbToast(`Payment ${p.txnId} → ${p.status}`);
      renderPayments();
    }));
    cbRefreshIcons();
  }

  /* ---------------- Enquiries ---------------- */
  function renderEnquiries() {
    document.getElementById('ad-enquiries-table').innerHTML = enquiries.length ? `
      <table class="cb-table min-w-[560px]">
        <thead><tr><th>From</th><th>Message</th><th>Date</th><th>Status</th><th>Update</th></tr></thead>
        <tbody>${enquiries.map(q => `<tr>
          <td><span class="font-bold text-[#3B3654] dark:text-white">${cbEscape(q.name)}</span><br><span class="text-xs text-[#8B86A3]">${cbEscape(q.email)}</span></td>
          <td class="text-sm text-[#6B6585] dark:text-[#A8A2C0] max-w-xs">${cbEscape(q.message)}</td>
          <td class="whitespace-nowrap">${cbDate(q.date)}</td>
          <td><span class="badge ${statusBadge(q.status)}">${q.status}</span></td>
          <td><select class="cb-input !w-32 !py-1.5 text-xs" data-enq-status="${q.id}">
            ${['New', 'Resolved'].map(s => `<option ${s === q.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select></td>
        </tr>`).join('')}</tbody>
      </table>` : '<div class="p-10 text-center font-semibold text-[#8B86A3]">No enquiries yet. New contact-form messages will appear here.</div>';
    document.querySelectorAll('[data-enq-status]').forEach(sel => sel.addEventListener('change', () => {
      const q = enquiries.find(x => x.id === sel.getAttribute('data-enq-status'));
      q.status = sel.value; cbWrite(CB_KEYS.enquiries, enquiries);
      cbToast('Enquiry updated');
      renderEnquiries();
    }));
    cbRefreshIcons();
  }

  /* ---------------- Settings ---------------- */
  document.getElementById('reset-data').addEventListener('click', () => {
    if (!confirm('Reset ALL demo data? This clears every change made in the demo.')) return;
    Object.values(CB_KEYS).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('cakebloom_seeded');
    cbToast('Demo data reset', 'info');
    setTimeout(() => location.reload(), 800);
  });
  [['set-advance'], ['set-email']].forEach(([id]) => {
    document.getElementById(id).addEventListener('click', function () {
      const on = this.classList.toggle('bg-pink-500');
      this.classList.toggle('bg-gray-300', !on);
      this.querySelector('span').style.insetInlineEnd = on ? '' : 'auto';
      this.querySelector('span').style.insetInlineStart = on ? '' : '4px';
      cbToast('Setting saved (demo)', 'info');
    });
  });

  showSection(location.hash.slice(1));
})();
