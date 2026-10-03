/* CakeBloom â€” Parent Dashboard */
(function () {
  'use strict';

  // Let visitors explore the parent dashboard without signing in by using
  // the seeded demo parent when there is no active session.
  const user = cbUser() || cbRead(CB_KEYS.users, []).find(u => u.role === 'parent');
  if (!user || user.role !== 'parent') { location.href = 'login.html'; return; }

  const users = cbRead(CB_KEYS.users, []).find(u => u.id === user.id) || user;
  const bookings = cbRead(CB_KEYS.bookings, []);
  const packages = cbRead(CB_KEYS.packages, []);
  const themes = cbRead(CB_KEYS.themes, []);
  const slots = cbRead(CB_KEYS.slots, []);
  const proofs = cbRead(CB_KEYS.proofs, []);
  const prints = cbRead(CB_KEYS.prints, []);
  const payments = cbRead(CB_KEYS.payments, []);
  const notifs = cbRead(CB_KEYS.notifs, []);

  const myBookings = () => bookings.filter(b => b.userId === user.id);
  const myProofs = () => proofs.filter(p => myBookings().some(b => b.id === p.bookingId));
  const myPrints = () => prints.filter(p => p.userId === user.id);
  const myPayments = () => payments.filter(p => p.userId === user.id);
  const myNotifs = () => notifs.filter(n => n.userId === user.id || n.userId === 'all');

  const pkgById = id => packages.find(p => p.id === id);
  const thById = id => themes.find(t => t.id === id);
  const statusBadge = s => ({ confirmed: 'badge-green', pending: 'badge-yellow', completed: 'badge-blue', cancelled: 'badge-red', Paid: 'badge-green', Unpaid: 'badge-yellow', Processing: 'badge-blue', Delivered: 'badge-green', 'In Progress': 'badge-gray', New: 'badge-pink' }[s] || 'badge-gray');

  /* ---------------- Layout ---------------- */
  const SECTIONS = [
    ['overview', 'Overview', 'layout-dashboard'], ['book', 'Book Session', 'calendar-heart'],
    ['bookings', 'My Bookings', 'calendar-days'], ['theme', 'Package & Theme', 'gift'],
    ['proofs', 'Proof Gallery', 'images'], ['prints', 'Print Orders', 'printer'],
    ['payments', 'Payments', 'wallet'], ['notifications', 'Notifications', 'bell'],
    ['profile', 'Profile', 'user-round'],
  ];

  const sidebar = document.getElementById('dash-sidebar');
  sidebar.innerHTML = `
    <div class="p-4 border-b border-pink-100 dark:border-white/10">
      <a href="index.html" class="flex items-center gap-3" aria-label="CakeBloom home">
        <span class="w-11 h-11 rounded-2xl bg-pink-500 grid place-items-center text-white shrink-0"><i data-lucide="cake" class="w-6 h-6"></i></span>
        <span class="font-display font-extrabold text-xl text-[#3B3654] dark:text-white">Cake<span class="text-gradient">Bloom</span></span>
      </a>
    </div>
    <nav class="p-3 space-y-1" id="dash-nav">
      ${SECTIONS.map(([id, label, ic]) => `<a href="dashboard.html#${id}" class="dash-link" data-sec="${id}"><i data-lucide="${ic}" class="w-[18px] h-[18px]"></i>${label}</a>`).join('')}
      <button class="dash-link w-full text-rose-500" id="dash-logout"><i data-lucide="log-out" class="w-[18px] h-[18px]"></i>Logout</button>
    </nav>`;

  const main = document.getElementById('dash-main');
  const unread = myNotifs().filter(n => !n.read).length;

  main.innerHTML = `
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="font-display font-bold text-2xl sm:text-3xl text-[#3B3654] dark:text-white" id="dash-title">Overview</h1>
      <p class="text-sm font-semibold text-[#8B86A3]">Welcome back, ${cbEscape(users.name.split(' ')[0])}! Here's what's happening.</p>
    </div>
    <button class="cb-btn cb-btn-primary !py-2.5 text-sm hidden sm:inline-flex" id="quick-book"><i data-lucide="calendar-heart" class="w-4 h-4"></i>Book Session</button>
  </div>

  <section id="sec-overview" class="dash-sec space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" id="ov-cards"></div>
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="cb-card p-6">
        <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white mb-4 flex items-center gap-2"><i data-lucide="cake" class="w-5 h-5 text-pink-400"></i>Upcoming Session</h3>
        <div id="ov-session"></div>
      </div>
      <div class="cb-card p-6">
        <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white mb-4 flex items-center gap-2"><i data-lucide="wallet" class="w-5 h-5 text-violet-400"></i>Payment Status</h3>
        <div id="ov-payment"></div>
      </div>
    </div>
  </section>

  <section id="sec-book" class="dash-sec hidden">
    <div class="cb-card p-6 max-w-3xl">
      <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white mb-1">Book a Cake Smash Session</h3>
      <p class="text-sm font-semibold text-[#8B86A3] mb-5">Pick a date, time slot, package and theme. A 50% advance confirms your booking.</p>
      <form id="book-form" class="space-y-5">
        <div>
          <label class="cb-label">Select Date</label>
          <select id="bk-date" class="cb-input" required></select>
        </div>
        <div>
          <label class="cb-label">Available Time Slots</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" id="bk-slots"></div>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="cb-label">Package</label>
            <select id="bk-package" class="cb-input" required></select>
          </div>
          <div>
            <label class="cb-label">Theme</label>
            <select id="bk-theme" class="cb-input" required></select>
          </div>
        </div>
        <div>
          <label class="cb-label">Notes for the photographer (optional)</label>
          <textarea id="bk-notes" class="cb-input" rows="2" placeholder="Allergies, favourite toys, nap times..."></textarea>
        </div>
        <div class="bg-pink-50 dark:bg-white/5 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div class="text-xs font-bold text-pink-400 uppercase tracking-wide">Payable on confirmation (50% advance)</div>
            <div class="font-display font-bold text-2xl text-[#3B3654] dark:text-white" id="bk-amount">â€”</div>
          </div>
          <button type="submit" class="cb-btn cb-btn-primary"><i data-lucide="circle-check" class="w-4 h-4"></i>Confirm Booking</button>
        </div>
      </form>
    </div>
  </section>

  <section id="sec-bookings" class="dash-sec hidden">
    <div class="cb-card overflow-hidden">
      <div class="p-5 border-b border-pink-100 dark:border-white/10"><h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">My Bookings</h3></div>
      <div class="overflow-x-auto" id="bookings-table"></div>
    </div>
  </section>

  <section id="sec-theme" class="dash-sec hidden">
    <div class="grid gap-6 lg:grid-cols-2" id="theme-cards"></div>
  </section>

  <section id="sec-proofs" class="dash-sec hidden">
    <div class="cb-card p-5 mb-5">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">Proof Gallery</h3>
          <p class="text-sm font-semibold text-[#8B86A3]">Tap the heart to favourite, the check to select final photos, and the wand to send for editing.</p>
        </div>
        <button class="cb-btn cb-btn-primary !py-2.5 text-sm" id="order-prints-btn"><i data-lucide="printer" class="w-4 h-4"></i>Order Prints</button>
      </div>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="proofs-grid"></div>
  </section>

  <section id="sec-prints" class="dash-sec hidden">
    <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white mb-4">Order Prints & Products</h3>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-8" id="print-shop"></div>
    <div class="cb-card overflow-hidden">
      <div class="p-5 border-b border-pink-100 dark:border-white/10"><h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">My Print Orders</h3></div>
      <div class="overflow-x-auto" id="prints-table"></div>
    </div>
  </section>

  <section id="sec-payments" class="dash-sec hidden">
    <div class="cb-card overflow-hidden">
      <div class="p-5 border-b border-pink-100 dark:border-white/10"><h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">Payments</h3></div>
      <div class="overflow-x-auto" id="payments-table"></div>
    </div>
  </section>

  <section id="sec-notifications" class="dash-sec hidden">
    <div class="cb-card p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">Notifications ${unread ? `<span class="badge badge-pink ms-2">${unread} new</span>` : ''}</h3>
        <button class="cb-btn cb-btn-ghost !py-2 text-sm" id="mark-read">Mark all read</button>
      </div>
      <div class="space-y-3" id="notif-list"></div>
    </div>
  </section>

  <section id="sec-profile" class="dash-sec hidden">
    <div class="cb-card p-6 max-w-2xl">
      <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white mb-5">Profile Details</h3>
      <form id="profile-form" class="space-y-4">
        <div class="grid sm:grid-cols-2 gap-4">
          <div><label class="cb-label">Parent Name</label><input id="pf-name" class="cb-input" required></div>
          <div><label class="cb-label">Mobile</label><input id="pf-mobile" class="cb-input" required></div>
        </div>
        <div><label class="cb-label">Email</label><input id="pf-email" class="cb-input" disabled></div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div><label class="cb-label">Child Name</label><input id="pf-child" class="cb-input"></div>
          <div><label class="cb-label">Child Date of Birth</label><input id="pf-dob" type="date" class="cb-input"></div>
        </div>
        <button class="cb-btn cb-btn-primary"><i data-lucide="save" class="w-4 h-4"></i>Save Changes</button>
      </form>
    </div>
  </section>`;

  /* ---------------- Section switching ---------------- */
  const titles = Object.fromEntries(SECTIONS.map(([id, label]) => [id, label]));
  function showSection(id) {
    if (!titles[id]) id = 'overview';
    document.querySelectorAll('.dash-sec').forEach(s => s.classList.add('hidden'));
    document.getElementById('sec-' + id).classList.remove('hidden');
    document.querySelectorAll('#dash-nav .dash-link').forEach(a => a.classList.toggle('active', a.getAttribute('data-sec') === id));
    document.getElementById('dash-title').textContent = titles[id];
    if (id === 'overview') renderOverview();
    if (id === 'bookings') renderBookings();
    if (id === 'theme') renderTheme();
    if (id === 'proofs') renderProofs();
    if (id === 'prints') renderPrints();
    if (id === 'payments') renderPayments();
    if (id === 'notifications') renderNotifs();
    if (id === 'profile') fillProfile();
    if (id === 'book') initBookingForm();
    cbRefreshIcons();
  }
  document.getElementById('dash-nav').addEventListener('click', (e) => {
    const a = e.target.closest('[data-sec]');
    if (a) { e.preventDefault(); location.hash = a.getAttribute('data-sec'); }
  });
  document.getElementById('quick-book').addEventListener('click', () => location.hash = 'book');
  window.addEventListener('hashchange', () => showSection(location.hash.slice(1)));

  // Mobile drawer
  const drawerBtn = document.getElementById('drawer-btn');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawerBtn) drawerBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('is-open');
    overlay.classList.toggle('hidden', !isOpen);
  });
  if (overlay) overlay.addEventListener('click', () => {
    drawer.classList.remove('is-open');
    overlay.classList.add('hidden');
  });
  document.getElementById('dash-logout').addEventListener('click', () => { localStorage.removeItem(CB_KEYS.user); location.href = 'index.html'; });

  /* ---------------- Overview ---------------- */
  function renderOverview() {
    const upcoming = myBookings().filter(b => b.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date))[0];
    const paid = myPayments().filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
    const total = myBookings().reduce((s, b) => s + (pkgById(b.packageId)?.price || 0), 0);
    const cards = [
      { label: 'Upcoming Sessions', value: myBookings().filter(b => b.status === 'confirmed').length, icon: 'calendar-heart', color: 'text-pink-400' },
      { label: 'Proof Photos', value: myProofs().length, icon: 'images', color: 'text-violet-400' },
      { label: 'Print Orders', value: myPrints().length, icon: 'printer', color: 'text-sky-400' },
      { label: 'Total Spent', value: cbMoney(paid), icon: 'wallet', color: 'text-emerald-400' },
    ];
    document.getElementById('ov-cards').innerHTML = cards.map(c => `
      <div class="stat-card flex items-center gap-4">
        <span class="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-white/10 grid place-items-center"><i data-lucide="${c.icon}" class="w-6 h-6 ${c.color}"></i></span>
        <div><div class="font-display font-bold text-xl text-[#3B3654] dark:text-white">${c.value}</div><div class="text-xs font-bold text-[#8B86A3]">${c.label}</div></div>
      </div>`).join('');

    document.getElementById('ov-session').innerHTML = upcoming ? (() => {
      const p = pkgById(upcoming.packageId), t = thById(upcoming.themeId);
      return `
      <div class="flex gap-4 items-start">
        <img src="${p?.image}" alt="${cbEscape(p?.name)}" class="w-24 h-24 rounded-2xl object-cover shadow">
        <div class="flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-display font-bold text-[#3B3654] dark:text-white">${cbEscape(p?.name)} Package</span>
            <span class="badge ${statusBadge(upcoming.status)}">${upcoming.status}</span>
          </div>
          <div class="text-sm font-semibold text-[#6B6585] dark:text-[#A8A2C0] mt-1 flex items-center gap-1.5"><i data-lucide="palette" class="w-4 h-4 text-violet-400"></i>${cbEscape(t?.name)} theme</div>
          <div class="text-sm font-semibold text-[#6B6585] dark:text-[#A8A2C0] mt-1 flex items-center gap-1.5"><i data-lucide="calendar" class="w-4 h-4 text-pink-400"></i>${cbDate(upcoming.date)} Â· ${cbEscape(upcoming.time)}</div>
        </div>
      </div>`;
    })() : `<div class="text-center py-8">
        <i data-lucide="calendar-x" class="w-10 h-10 text-[#D8D2E8] mx-auto mb-3"></i>
        <p class="font-semibold text-[#8B86A3] mb-3">No sessions booked yet</p>
        <button class="cb-btn cb-btn-primary !py-2 text-sm" onclick="location.hash='book'">Book your first session</button>
      </div>`;

    const lastPay = myPayments()[0];
    document.getElementById('ov-payment').innerHTML = lastPay ? `
      <div class="space-y-3">
        <div class="flex justify-between text-sm font-semibold"><span class="text-[#8B86A3]">Package total</span><span class="text-[#3B3654] dark:text-white">${cbMoney(total)}</span></div>
        <div class="flex justify-between text-sm font-semibold"><span class="text-[#8B86A3]">Paid (advance)</span><span class="text-emerald-500">${cbMoney(paid)}</span></div>
        <div class="flex justify-between text-sm font-semibold"><span class="text-[#8B86A3]">Balance due at studio</span><span class="text-amber-500">${cbMoney(Math.max(total - paid, 0))}</span></div>
        <div class="border-t border-dashed border-pink-200 dark:border-white/10 pt-3 flex justify-between items-center">
          <span class="text-sm font-bold text-[#8B86A3]">Last payment</span>
          <span class="badge ${statusBadge(lastPay.status)}">${lastPay.status} Â· ${cbMoney(lastPay.amount)}</span>
        </div>
      </div>` : `<p class="font-semibold text-[#8B86A3]">No payments yet. Your first booking will generate an advance payment.</p>`;
    cbRefreshIcons();
  }

  /* ---------------- Booking ---------------- */
  let bkSlot = null;
  function initBookingForm() {
    const dateSel = document.getElementById('bk-date');
    const slotWrap = document.getElementById('bk-slots');
    const pkgSel = document.getElementById('bk-package');
    const thSel = document.getElementById('bk-theme');
    const amountEl = document.getElementById('bk-amount');

    const dates = [...new Set(slots.filter(s => s.available).map(s => s.date))].sort();
    dateSel.innerHTML = dates.map(d => `<option value="${d}">${cbDate(d)}</option>`).join('');
    pkgSel.innerHTML = packages.map(p => `<option value="${p.id}">${cbEscape(p.name)} â€” ${cbMoney(p.price)}</option>`).join('');
    thSel.innerHTML = themes.map(t => `<option value="${t.id}">${cbEscape(t.name)}</option>`).join('');

    function renderSlots() {
      bkSlot = null;
      const list = slots.filter(s => s.date === dateSel.value && s.available);
      slotWrap.innerHTML = list.length ? list.map(s => `
        <button type="button" class="slot-btn border-2 border-pink-100 dark:border-white/10 rounded-xl py-2.5 text-sm font-bold text-[#55506E] dark:text-[#C6C1DA] hover:border-pink-300 transition" data-slot="${s.id}">${cbEscape(s.time)}</button>`).join('')
        : `<p class="col-span-full text-sm font-semibold text-rose-400 py-3">No slots available on this date. Try another date.</p>`;
      slotWrap.querySelectorAll('[data-slot]').forEach(b => b.addEventListener('click', () => {
        slotWrap.querySelectorAll('[data-slot]').forEach(x => { x.classList.remove('!border-pink-500', 'bg-pink-50', 'dark:bg-pink-500/10', 'text-pink-600'); });
        b.classList.add('!border-pink-500', 'bg-pink-50', 'dark:bg-pink-500/10', 'text-pink-600');
        bkSlot = b.getAttribute('data-slot');
      }));
      updateAmount();
    }
    function updateAmount() {
      const p = pkgById(pkgSel.value);
      amountEl.textContent = p ? cbMoney(Math.round(p.price * 0.5)) : 'â€”';
    }
    dateSel.addEventListener('change', renderSlots);
    pkgSel.addEventListener('change', updateAmount);
    renderSlots();

    document.getElementById('book-form').onsubmit = (e) => {
      e.preventDefault();
      if (!bkSlot) { cbToast('Please select a time slot', 'error'); return; }
      const p = pkgById(pkgSel.value);
      const booking = {
        id: cbUid('bk'), userId: user.id, packageId: p.id, themeId: thSel.value,
        date: dateSel.value, time: slots.find(s => s.id === bkSlot).time,
        status: 'confirmed', notes: document.getElementById('bk-notes').value.trim(), createdAt: new Date().toISOString(),
      };
      bookings.push(booking); cbWrite(CB_KEYS.bookings, bookings);
      const slot = slots.find(s => s.id === bkSlot); slot.available = false; cbWrite(CB_KEYS.slots, slots);
      const pay = {
        id: cbUid('pay'), bookingId: booking.id, userId: user.id, amount: Math.round(p.price * 0.5),
        date: new Date().toISOString(), method: 'UPI (Demo)', status: 'Paid',
        txnId: 'CB' + Date.now().toString(36).toUpperCase(),
      };
      payments.push(pay); cbWrite(CB_KEYS.payments, payments);
      notifs.unshift({ id: cbUid('nt'), userId: user.id, title: 'Booking confirmed', message: `Your ${p.name} session is confirmed for ${cbDate(booking.date)} at ${booking.time}.`, date: new Date().toISOString(), read: false });
      cbWrite(CB_KEYS.notifs, notifs);
      cbToast('Booking confirmed! Advance payment received.');
      location.hash = 'bookings';
    };
  }

  /* ---------------- My Bookings ---------------- */
  function renderBookings() {
    const list = myBookings().sort((a, b) => b.date.localeCompare(a.date));
    document.getElementById('bookings-table').innerHTML = list.length ? `
      <table class="cb-table min-w-[640px]">
        <thead><tr><th>Booking</th><th>Package / Theme</th><th>Schedule</th><th>Amount</th><th>Status</th><th></th></tr></thead>
        <tbody>${list.map(b => {
          const p = pkgById(b.packageId), t = thById(b.themeId);
          return `<tr>
            <td><span class="font-bold text-[#3B3654] dark:text-white">#${b.id.slice(-6).toUpperCase()}</span><br><span class="text-xs text-[#8B86A3]">${cbDate(b.createdAt)}</span></td>
            <td><span class="font-bold text-[#3B3654] dark:text-white">${cbEscape(p?.name)}</span><br><span class="text-xs text-[#8B86A3]">${cbEscape(t?.name)} theme</span></td>
            <td class="whitespace-nowrap">${cbDate(b.date)}<br><span class="text-xs text-[#8B86A3]">${cbEscape(b.time)}</span></td>
            <td class="font-bold">${cbMoney(p?.price)}</td>
            <td><span class="badge ${statusBadge(b.status)}">${b.status}</span></td>
            <td>${b.status === 'confirmed' ? `<button class="text-xs font-bold text-rose-400 hover:underline" data-cancel="${b.id}">Cancel</button>` : ''}</td>
          </tr>`;
        }).join('')}</tbody>
      </table>` : `<div class="p-10 text-center"><i data-lucide="calendar-x" class="w-10 h-10 text-[#D8D2E8] mx-auto mb-3"></i><p class="font-semibold text-[#8B86A3]">No bookings yet.</p></div>`;
    document.querySelectorAll('[data-cancel]').forEach(b => b.addEventListener('click', () => {
      const bk = bookings.find(x => x.id === b.getAttribute('data-cancel'));
      if (!bk) return;
      if (!confirm('Cancel this booking? The slot will be released.')) return;
      bk.status = 'cancelled'; cbWrite(CB_KEYS.bookings, bookings);
      const slot = slots.find(s => s.date === bk.date && s.time === bk.time);
      if (slot) { slot.available = true; cbWrite(CB_KEYS.slots, slots); }
      cbToast('Booking cancelled', 'info'); renderBookings();
    }));
    cbRefreshIcons();
  }

  /* ---------------- Package & Theme ---------------- */
  function renderTheme() {
    const latest = myBookings().filter(b => b.status !== 'cancelled').sort((a, b) => b.date.localeCompare(a.date))[0];
    const p = latest ? pkgById(latest.packageId) : null;
    const t = latest ? thById(latest.themeId) : null;
    document.getElementById('theme-cards').innerHTML = p ? `
      <div class="cb-card overflow-hidden">
        <img src="${p.image}" alt="${cbEscape(p.name)} package" class="h-52 w-full object-cover">
        <div class="p-6">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">${cbEscape(p.name)} Package</h4>
            <span class="font-display font-bold text-pink-500">${cbMoney(p.price)}</span>
          </div>
          <p class="text-sm font-semibold text-[#6B6585] dark:text-[#A8A2C0] mb-4">${cbEscape(p.description)}</p>
          <ul class="text-sm font-semibold text-[#55506E] dark:text-[#C6C1DA] space-y-2">
            <li class="flex gap-2"><i data-lucide="clock" class="w-4 h-4 text-pink-400 mt-0.5"></i>${cbEscape(p.duration)} Â· ${p.photos} edited photos</li>
            <li class="flex gap-2"><i data-lucide="image" class="w-4 h-4 text-violet-400 mt-0.5"></i>${cbEscape(p.backdrop)}</li>
            <li class="flex gap-2"><i data-lucide="cake" class="w-4 h-4 text-sky-400 mt-0.5"></i>${cbEscape(p.cake)}</li>
            <li class="flex gap-2"><i data-lucide="wand-sparkles" class="w-4 h-4 text-emerald-400 mt-0.5"></i>${cbEscape(p.props)}</li>
          </ul>
        </div>
      </div>
      <div class="cb-card overflow-hidden">
        <img src="${t.image}" alt="${cbEscape(t.name)} theme" class="h-52 w-full object-cover">
        <div class="p-6">
          <h4 class="font-display font-bold text-lg text-[#3B3654] dark:text-white mb-2">${cbEscape(t.name)} Theme</h4>
          <p class="text-sm font-semibold text-[#6B6585] dark:text-[#A8A2C0] mb-4">${cbEscape(t.description)}</p>
          <div class="bg-pink-50 dark:bg-white/5 rounded-2xl p-4 text-sm font-semibold text-[#55506E] dark:text-[#C6C1DA]">
            Session scheduled for <span class="text-pink-500 font-bold">${cbDate(latest.date)} at ${cbEscape(latest.time)}</span>. Our team will set up the full ${cbEscape(t.name)} set 30 minutes before you arrive.
          </div>
        </div>
      </div>` : `<div class="cb-card p-10 text-center col-span-full"><p class="font-semibold text-[#8B86A3]">Book a session to see your package and theme here.</p></div>`;
    cbRefreshIcons();
  }

  /* ---------------- Proofs ---------------- */
  function renderProofs() {
    const list = myProofs();
    document.getElementById('proofs-grid').innerHTML = list.length ? list.map(pr => `
      <div class="cb-card overflow-hidden group">
        <div class="relative aspect-square">
          <img src="${pr.image}" alt="${cbEscape(pr.caption)}" class="w-full h-full object-cover">
          <div class="absolute inset-x-0 bottom-0 bg-black/70 p-3 flex items-center justify-between">
            <span class="text-white text-xs font-bold">${cbEscape(pr.caption)}</span>
          </div>
          <button class="absolute top-2.5 start-2.5 w-9 h-9 rounded-full grid place-items-center transition ${pr.favorite ? 'bg-pink-500 text-white' : 'bg-white/80 text-[#555066] hover:bg-white'}" data-fav="${pr.id}" title="Favourite"><i data-lucide="heart" class="w-4 h-4" fill="${pr.favorite ? 'currentColor' : 'none'}"></i></button>
          <button class="absolute top-2.5 end-2.5 w-9 h-9 rounded-full grid place-items-center transition ${pr.selected ? 'bg-emerald-500 text-white' : 'bg-white/80 text-[#555066] hover:bg-white'}" data-sel="${pr.id}" title="Select as final"><i data-lucide="check" class="w-4 h-4"></i></button>
          <button class="absolute bottom-2.5 end-2.5 w-9 h-9 rounded-full grid place-items-center transition ${pr.edited ? 'bg-violet-500 text-white' : 'bg-white/80 text-[#555066] hover:bg-white'}" data-edit="${pr.id}" title="Send for editing"><i data-lucide="wand-sparkles" class="w-4 h-4"></i></button>
        </div>
        <div class="p-3 flex gap-2 text-[11px] font-bold">
          ${pr.favorite ? '<span class="badge badge-pink">Favourite</span>' : ''}
          ${pr.selected ? '<span class="badge badge-green">Final</span>' : ''}
          ${pr.edited ? '<span class="badge badge-gray">In Editing</span>' : ''}
        </div>
      </div>`).join('') : `<div class="col-span-full cb-card p-10 text-center"><p class="font-semibold text-[#8B86A3]">Proofs will appear here after your session.</p></div>`;

    document.querySelectorAll('[data-fav]').forEach(b => b.addEventListener('click', () => {
      const pr = proofs.find(x => x.id === b.getAttribute('data-fav')); pr.favorite = !pr.favorite;
      cbWrite(CB_KEYS.proofs, proofs); renderProofs();
      cbToast(pr.favorite ? 'Added to favourites' : 'Removed from favourites', 'info');
    }));
    document.querySelectorAll('[data-sel]').forEach(b => b.addEventListener('click', () => {
      const pr = proofs.find(x => x.id === b.getAttribute('data-sel')); pr.selected = !pr.selected;
      cbWrite(CB_KEYS.proofs, proofs); renderProofs();
      cbToast(pr.selected ? 'Selected as final photo' : 'Removed from finals', 'info');
    }));
    document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => {
      const pr = proofs.find(x => x.id === b.getAttribute('data-edit')); pr.edited = !pr.edited;
      cbWrite(CB_KEYS.proofs, proofs); renderProofs();
      cbToast(pr.edited ? 'Sent for editing' : 'Editing cancelled', 'info');
    }));
    cbRefreshIcons();
  }

  /* ---------------- Print Orders ---------------- */
  const PRODUCTS = [
    { id: 'std', name: 'Standard Prints', desc: '6Ã—4 inch glossy prints', price: 49, img: 'assets/images/photos/gal-smash-1.jpg', unit: 'print' },
    { id: 'enl', name: 'Enlargements', desc: '12Ã—18 inch premium prints', price: 499, img: 'assets/images/photos/gal-birthday-1.jpg', unit: 'print' },
    { id: 'alb', name: 'Photo Album', desc: '20-page linen hardcover album', price: 2499, img: 'assets/images/photos/h2-gallery-2-family-first.jpg', unit: 'album' },
    { id: 'cnv', name: 'Canvas Print', desc: '16Ã—20 inch gallery canvas', price: 1899, img: 'assets/images/photos/h2-gallery-1-tiny-portraits.jpg', unit: 'canvas' },
    { id: 'dig', name: 'Digital Package', desc: 'All edited photos in HD + web', price: 1499, img: 'assets/images/photos/h2-gallery-3-birthday-joy.jpg', unit: 'package' },
  ];
  function renderPrints() {
    document.getElementById('print-shop').innerHTML = PRODUCTS.map(p => `
      <div class="cb-card overflow-hidden flex flex-col">
        <img src="${p.img}" alt="${cbEscape(p.name)}" class="h-40 w-full object-cover">
        <div class="p-5 flex flex-col flex-1">
          <h4 class="font-display font-bold text-[#3B3654] dark:text-white">${cbEscape(p.name)}</h4>
          <p class="text-xs font-semibold text-[#8B86A3] mb-3">${cbEscape(p.desc)}</p>
          <div class="mt-auto flex items-center justify-between gap-2">
            <span class="font-display font-bold text-pink-500">${cbMoney(p.price)}<span class="text-xs text-[#8B86A3] font-body">/${p.unit}</span></span>
            <div class="flex items-center gap-2">
              <input type="number" min="1" value="1" id="qty-${p.id}" class="cb-input !w-20 !py-1.5 text-center">
              <button class="cb-btn cb-btn-primary !py-2 !px-3.5 text-sm" data-order="${p.id}">Order</button>
            </div>
          </div>
        </div>
      </div>`).join('');

    document.querySelectorAll('[data-order]').forEach(b => b.addEventListener('click', () => {
      const p = PRODUCTS.find(x => x.id === b.getAttribute('data-order'));
      const qty = Math.max(1, parseInt(document.getElementById('qty-' + p.id).value) || 1);
      prints.unshift({
        id: cbUid('po'), userId: user.id, type: p.name, size: p.desc, qty,
        price: p.price * qty, status: 'Processing', date: new Date().toISOString(),
      });
      cbWrite(CB_KEYS.prints, prints);
      cbToast(`${qty} Ã— ${p.name} ordered`);
      renderPrints();
    }));

    const list = myPrints();
    document.getElementById('prints-table').innerHTML = list.length ? `
      <table class="cb-table min-w-[560px]">
        <thead><tr><th>Order</th><th>Product</th><th>Qty</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>${list.map(o => `<tr>
          <td class="font-bold text-[#3B3654] dark:text-white">#${o.id.slice(-6).toUpperCase()}</td>
          <td>${cbEscape(o.type)}<br><span class="text-xs text-[#8B86A3]">${cbEscape(o.size)}</span></td>
          <td>${o.qty}</td><td class="font-bold">${cbMoney(o.price)}</td>
          <td>${cbDate(o.date)}</td><td><span class="badge ${statusBadge(o.status)}">${o.status}</span></td>
        </tr>`).join('')}</tbody>
      </table>` : `<div class="p-10 text-center"><i data-lucide="printer" class="w-10 h-10 text-[#D8D2E8] mx-auto mb-3"></i><p class="font-semibold text-[#8B86A3]">No print orders yet.</p></div>`;
    cbRefreshIcons();
  }

  document.getElementById('order-prints-btn').addEventListener('click', () => location.hash = 'prints');

  /* ---------------- Payments ---------------- */
  function renderPayments() {
    const list = myPayments();
    document.getElementById('payments-table').innerHTML = list.length ? `
      <table class="cb-table min-w-[640px]">
        <thead><tr><th>Payment ID</th><th>Booking</th><th>Method</th><th>Date</th><th>Amount</th><th>Status</th><th>Receipt</th></tr></thead>
        <tbody>${list.map(pay => {
          const bk = bookings.find(b => b.id === pay.bookingId);
          return `<tr>
            <td class="font-bold text-[#3B3654] dark:text-white">${pay.txnId}</td>
            <td>#${(bk?.id || pay.bookingId).slice(-6).toUpperCase()}<br><span class="text-xs text-[#8B86A3]">${cbEscape(pkgById(bk?.packageId)?.name || '')}</span></td>
            <td>${cbEscape(pay.method)}</td><td>${cbDate(pay.date)}</td>
            <td class="font-bold">${cbMoney(pay.amount)}</td>
            <td><span class="badge ${statusBadge(pay.status)}">${pay.status}</span></td>
            <td><button class="cb-btn cb-btn-outline !py-1.5 !px-3 text-xs" data-receipt="${pay.id}">View</button></td>
          </tr>`;
        }).join('')}</tbody>
      </table>` : `<div class="p-10 text-center"><i data-lucide="wallet" class="w-10 h-10 text-[#D8D2E8] mx-auto mb-3"></i><p class="font-semibold text-[#8B86A3]">No payments yet.</p></div>`;
    document.querySelectorAll('[data-receipt]').forEach(b => b.addEventListener('click', () => {
      const pay = payments.find(x => x.id === b.getAttribute('data-receipt'));
      const bk = bookings.find(x => x.id === pay.bookingId);
      const m = document.getElementById('receipt-modal');
      m.querySelector('.modal-content').innerHTML = `
        <div class="p-6">
          <div class="text-center border-b border-dashed border-pink-200 dark:border-white/15 pb-4 mb-4">
            <div class="flex items-center justify-center gap-2 mb-1"><i data-lucide="cake" class="w-5 h-5 text-pink-400"></i><span class="font-display font-bold text-lg">CakeBloom Studio</span></div>
            <p class="text-xs font-semibold text-[#8B86A3]">Payment Receipt (Demo)</p>
          </div>
          <div class="space-y-2.5 text-sm font-semibold">
            <div class="flex justify-between"><span class="text-[#8B86A3]">Payment ID</span><span class="text-[#3B3654] dark:text-white">${pay.txnId}</span></div>
            <div class="flex justify-between"><span class="text-[#8B86A3]">Booking</span><span class="text-[#3B3654] dark:text-white">#${bk?.id.slice(-6).toUpperCase()} Â· ${cbEscape(pkgById(bk?.packageId)?.name || '')}</span></div>
            <div class="flex justify-between"><span class="text-[#8B86A3]">Date</span><span class="text-[#3B3654] dark:text-white">${cbDateTime(pay.date)}</span></div>
            <div class="flex justify-between"><span class="text-[#8B86A3]">Method</span><span class="text-[#3B3654] dark:text-white">${cbEscape(pay.method)}</span></div>
            <div class="flex justify-between"><span class="text-[#8B86A3]">Status</span><span class="badge ${statusBadge(pay.status)}">${pay.status}</span></div>
            <div class="flex justify-between border-t border-dashed border-pink-200 dark:border-white/15 pt-2.5"><span class="text-[#8B86A3]">Amount Paid</span><span class="font-display font-bold text-pink-500 text-lg">${cbMoney(pay.amount)}</span></div>
          </div>
          <button class="cb-btn cb-btn-primary w-full mt-5" onclick="cbCloseModal('receipt-modal')">Done</button>
        </div>`;
      cbOpenModal('receipt-modal');
    }));
    cbRefreshIcons();
  }

  /* ---------------- Notifications ---------------- */
  function renderNotifs() {
    const list = myNotifs();
    document.getElementById('notif-list').innerHTML = list.length ? list.map(n => `
      <div class="flex gap-3 p-4 rounded-2xl ${n.read ? 'bg-white dark:bg-white/5' : 'bg-pink-50 dark:bg-pink-500/10 border border-pink-100 dark:border-pink-500/20'}">
        <span class="w-10 h-10 rounded-xl grid place-items-center shrink-0 ${n.read ? 'bg-violet-100 text-violet-500 dark:bg-white/10' : 'bg-pink-100 text-pink-500 dark:bg-pink-500/20'}"><i data-lucide="bell" class="w-5 h-5"></i></span>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class="font-bold text-sm text-[#3B3654] dark:text-white">${cbEscape(n.title)}</span>
            ${!n.read ? '<span class="w-2 h-2 rounded-full bg-pink-500"></span>' : ''}
          </div>
          <p class="text-sm font-semibold text-[#6B6585] dark:text-[#A8A2C0] mt-0.5">${cbEscape(n.message)}</p>
          <p class="text-xs font-bold text-[#B4AED0] mt-1">${cbDateTime(n.date)}</p>
        </div>
      </div>`).join('') : `<p class="text-center font-semibold text-[#8B86A3] py-8">All caught up!</p>`;
    cbRefreshIcons();
  }
  document.getElementById('mark-read').addEventListener('click', () => {
    myNotifs().forEach(n => n.read = true);
    cbWrite(CB_KEYS.notifs, notifs);
    cbToast('All notifications marked as read', 'info');
    renderNotifs();
  });

  /* ---------------- Profile ---------------- */
  function fillProfile() {
    document.getElementById('pf-name').value = users.name;
    document.getElementById('pf-mobile').value = users.mobile;
    document.getElementById('pf-email').value = users.email;
    document.getElementById('pf-child').value = users.childName || '';
    document.getElementById('pf-dob').value = users.childDob || '';
  }
  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const all = cbRead(CB_KEYS.users, []);
    const u = all.find(x => x.id === user.id);
    u.name = document.getElementById('pf-name').value.trim();
    u.mobile = document.getElementById('pf-mobile').value.trim();
    u.childName = document.getElementById('pf-child').value.trim();
    u.childDob = document.getElementById('pf-dob').value;
    cbWrite(CB_KEYS.users, all);
    cbWrite(CB_KEYS.user, { id: u.id, name: u.name, email: u.email, role: u.role });
    cbToast('Profile updated');
  });

  showSection(location.hash.slice(1));
})();

