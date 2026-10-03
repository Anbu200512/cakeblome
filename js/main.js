/* CakeBloom — core: store, theme, direction, toast, modal, lightbox, helpers */
(function () {
  'use strict';

  /* ---------------- Store ---------------- */
  const K = {
    theme: 'cakebloom_theme', dir: 'cakebloom_direction', user: 'cakebloom_user',
    users: 'cakebloom_users', bookings: 'cakebloom_bookings', slots: 'cakebloom_slots',
    packages: 'cakebloom_packages', themes: 'cakebloom_themes', proofs: 'cakebloom_proofs',
    prints: 'cakebloom_print_orders', payments: 'cakebloom_payments', notifs: 'cakebloom_notifications',
    enquiries: 'cakebloom_enquiries',
  };
  window.CB_KEYS = K;

  const read = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  window.cbRead = read; window.cbWrite = write;

  function iso(d) { return d.toISOString().slice(0, 10); }
  function addDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return d; }

  function seed() {
    if (localStorage.getItem('cakebloom_seeded')) return;

    const users = [
      { id: 'u-admin', name: 'Studio Admin', email: 'admin@cakebloom.com', mobile: '9000000001', password: 'admin123', role: 'admin', childName: '', childDob: '', createdAt: iso(addDays(-90)) },
      { id: 'u-parent', name: 'Ananya Sharma', email: 'parent@cakebloom.com', mobile: '9876543210', password: 'parent123', role: 'parent', childName: 'Aarav Sharma', childDob: iso(addDays(-400)), createdAt: iso(addDays(-60)) },
    ];

    const packages = [
      { id: 'pkg-1', name: 'Princess', theme: 'Princess', duration: '90 mins', photos: 25, backdrop: 'Royal castle backdrop', cake: 'Vanilla princess cake', props: 'Tiara, wand, cape, throne chair', price: 7999, image: 'assets/images/pkg-princess.svg', popular: true, description: 'A royal celebration fit for your little prince or princess. Glittering tiaras, a castle backdrop and a cake fit for the palace.' },
      { id: 'pkg-2', name: 'Superhero', theme: 'Superhero', duration: '90 mins', photos: 25, backdrop: 'City skyline backdrop', cake: 'Comic-style cake', props: 'Capes, masks, emblems, action signs', price: 7499, image: 'assets/images/pkg-superhero.svg', popular: true, description: 'Action-packed frames with capes, masks and comic-book energy. Perfect for your little hero\'s big day.' },
      { id: 'pkg-3', name: 'Jungle', theme: 'Jungle', duration: '90 mins', photos: 25, backdrop: 'Tropical jungle backdrop', cake: 'Jungle animal cake', props: 'Vines, leaves, animal plush, safari hat', price: 6999, image: 'assets/images/pkg-jungle.svg', popular: false, description: 'Wild and wonderful! Lush greens, friendly animals and a cake surrounded by jungle magic.' },
      { id: 'pkg-4', name: 'Space', theme: 'Space', duration: '90 mins', photos: 25, backdrop: 'Galaxy & stars backdrop', cake: 'Rocket cake', props: 'Rocket, planets, astronaut helmet, stars', price: 8499, image: 'assets/images/pkg-space.svg', popular: true, description: 'Blast off into a galaxy of stars, planets and cosmic cake. Out of this world fun guaranteed.' },
      { id: 'pkg-5', name: 'Rainbow', theme: 'Rainbow', duration: '75 mins', photos: 20, backdrop: 'Rainbow arch backdrop', cake: 'Rainbow layer cake', props: 'Rainbow arch, clouds, color props', price: 6499, image: 'assets/images/pkg-rainbow.svg', popular: false, description: 'Every color of joy! A vibrant rainbow arch, fluffy clouds and a show-stopping rainbow cake.' },
      { id: 'pkg-6', name: 'Dinosaur', theme: 'Dinosaur', duration: '90 mins', photos: 25, backdrop: 'Prehistoric valley backdrop', cake: 'Dino egg cake', props: 'Dino tails, eggs, fossils, jungle plants', price: 7499, image: 'assets/images/pkg-dinosaur.svg', popular: true, description: 'Rawr! A prehistoric adventure with dino tails, giant eggs and a stomping-good cake smash.' },
      { id: 'pkg-7', name: 'Teddy Bear', theme: 'Teddy Bear', duration: '75 mins', photos: 20, backdrop: 'Cozy picnic backdrop', cake: 'Teddy honey cake', props: 'Teddy bears, picnic blanket, honey pots', price: 5999, image: 'assets/images/pkg-teddy.svg', popular: false, description: 'Soft, cuddly and sweet. A teddy bear picnic with the fluffiest friends and a honey cake.' },
      { id: 'pkg-9', name: 'Minimalist', theme: 'Minimalist', duration: '60 mins', photos: 15, backdrop: 'Solid pastel backdrop', cake: 'Simple buttercream cake', props: 'Balloon, banner, single prop', price: 4999, image: 'assets/images/pkg-minimalist.svg', popular: false, description: 'Less is more. Clean pastel tones, one perfect balloon and timeless, elegant frames.' },
      { id: 'pkg-10', name: 'Custom Theme', theme: 'Custom', duration: '120 mins', photos: 30, backdrop: 'Your choice of backdrop', cake: 'Custom-designed cake', props: 'Personalised props & set', price: 11999, image: 'assets/images/pkg-custom.svg', popular: false, description: 'Dream it, we build it. A fully personalised set, props and cake designed around your child\'s favorite thing.' },
    ];

    const themes = [
      { id: 'th-1', name: 'Princess', image: 'assets/images/theme-princess.svg', description: 'Royal castle, tiaras and all things sparkly.' },
      { id: 'th-2', name: 'Superhero', image: 'assets/images/theme-superhero.svg', description: 'Capes, masks and comic-book action.' },
      { id: 'th-3', name: 'Jungle', image: 'assets/images/theme-jungle.svg', description: 'Lush greens and friendly wild animals.' },
      { id: 'th-4', name: 'Space', image: 'assets/images/theme-space.svg', description: 'Stars, rockets and galactic adventures.' },
      { id: 'th-5', name: 'Rainbow', image: 'assets/images/gal-smash-1.svg', description: 'Every color of the rainbow in one joyful set.' },
      { id: 'th-6', name: 'Dinosaur', image: 'assets/images/gal-theme-1.svg', description: 'Prehistoric fun with dino friends.' },
      { id: 'th-7', name: 'Teddy Bear', image: 'assets/images/pkg-teddy.svg', description: 'A cozy teddy bear picnic celebration.' },
      { id: 'th-8', name: 'Floral', image: 'assets/images/pkg-floral.svg', description: 'Soft blooms and garden-party charm.' },
      { id: 'th-9', name: 'Minimalist', image: 'assets/images/pkg-minimalist.svg', description: 'Clean, modern and timeless pastels.' },
      { id: 'th-10', name: 'Custom', image: 'assets/images/pkg-custom.svg', description: 'Tell us your idea and we will create it.' },
    ];

    const times = ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];
    const slots = [];
    let sid = 1;
    for (let d = 1; d <= 21; d++) {
      const date = iso(addDays(d));
      times.forEach((t, i) => {
        const booked = (d * 7 + i * 3) % 9 === 0; // deterministic pseudo-availability
        slots.push({ id: 'sl-' + (sid++), date, time: t, available: !booked });
      });
    }

    const proofs = [
      { id: 'pr-1', bookingId: 'bk-1', image: 'assets/images/proof-1.svg', caption: 'First look at the cake', favorite: false, selected: false, edited: false },
      { id: 'pr-2', bookingId: 'bk-1', image: 'assets/images/proof-2.svg', caption: 'The big splash', favorite: true, selected: true, edited: false },
      { id: 'pr-3', bookingId: 'bk-1', image: 'assets/images/proof-3.svg', caption: 'Curious fingers', favorite: false, selected: false, edited: false },
      { id: 'pr-4', bookingId: 'bk-1', image: 'assets/images/proof-4.svg', caption: 'Frosting everywhere', favorite: false, selected: true, edited: false },
      { id: 'pr-5', bookingId: 'bk-1', image: 'assets/images/proof-5.svg', caption: 'Giggles with daddy', favorite: true, selected: false, edited: false },
      { id: 'pr-6', bookingId: 'bk-1', image: 'assets/images/proof-6.svg', caption: 'Cake champion', favorite: false, selected: false, edited: false },
    ];

    const bookings = [
      { id: 'bk-1', userId: 'u-parent', packageId: 'pkg-1', themeId: 'th-1', date: iso(addDays(6)), time: '10:30 AM', status: 'Confirmed', notes: 'Aarav loves pink and sparkles!', createdAt: iso(addDays(-10)) },
    ];

    const payments = [
      { id: 'pay-1', bookingId: 'bk-1', userId: 'u-parent', amount: 4000, date: iso(addDays(-10)), method: 'UPI', status: 'Paid', txnId: 'CB' + Date.now().toString(36).toUpperCase() + '01' },
    ];

    const notifs = [
      { id: 'nt-1', userId: 'u-parent', title: 'Booking confirmed', message: 'Your Princess cake smash session is confirmed for ' + iso(addDays(6)) + ' at 10:30 AM.', date: iso(addDays(-1)), read: false },
      { id: 'nt-2', userId: 'u-parent', title: 'Proofs ready soon', message: 'Your edited proofs will be uploaded within 5 working days after the session.', date: iso(addDays(-1)), read: false },
      { id: 'nt-3', userId: 'all', title: 'New Space package', message: 'Our galactic Space theme is now bookable. Limited slots for this month!', date: iso(addDays(-3)), read: true },
    ];

    write(K.users, users); write(K.packages, packages); write(K.themes, themes);
    write(K.slots, slots); write(K.bookings, bookings); write(K.proofs, proofs);
    write(K.payments, payments); write(K.notifs, notifs); write(K.prints, []); write(K.enquiries, []);
    localStorage.setItem('cakebloom_seeded', '1');
  }
  window.cbSeed = seed;

  /* ---------------- Theme & direction ---------------- */
  function applyTheme(t) {
    localStorage.setItem(K.theme, t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }
  function applyDirection(d) {
    localStorage.setItem(K.dir, d);
    document.documentElement.setAttribute('dir', d);
  }
  window.cbApplyTheme = applyTheme; window.cbApplyDirection = applyDirection;

  /* ---------------- Helpers ---------------- */
  window.cbUser = () => read(K.user, null);
  window.cbEscape = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window.cbMoney = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
  window.cbDate = (d) => { try { return new Date(d + (d.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return d; } };
  window.cbDateTime = (d) => { try { return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }); } catch (e) { return d; } };
  window.cbUid = (p) => p + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  window.cbRefreshIcons = () => { try { if (window.lucide) lucide.createIcons(); } catch (e) {} };

  /* ---------------- Toast ---------------- */
  window.cbToast = function (msg, type) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
    const t = document.createElement('div');
    t.className = 'toast anim-toast' + (type === 'error' ? ' error' : type === 'info' ? ' info' : '');
    const icon = type === 'error' ? 'circle-alert' : type === 'info' ? 'info' : 'circle-check';
    t.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5 shrink-0"></i><span>${cbEscape(msg)}</span>`;
    wrap.appendChild(t);
    cbRefreshIcons();
    setTimeout(() => { t.style.transition = 'all .3s'; t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; setTimeout(() => t.remove(), 300); }, 3400);
  };

  /* ---------------- Modal ---------------- */
  window.cbOpenModal = function (id) {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('hidden'); document.body.style.overflow = 'hidden'; cbRefreshIcons(); }
  };
  window.cbCloseModal = function (id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add('hidden'); document.body.style.overflow = ''; }
  };
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) e.target.classList.add('hidden'), document.body.style.overflow = '';
  });

  /* ---------------- Lightbox ---------------- */
  window.cbLightbox = function (images, index) {
    index = index || 0;
    const bd = document.createElement('div');
    bd.className = 'lightbox-backdrop';
    bd.innerHTML = `
      <button class="lightbox-btn" style="inset-inline-start:1rem" id="lb-prev" aria-label="Previous"><i data-lucide="chevron-left" class="w-6 h-6"></i></button>
      <img class="lightbox-img" id="lb-img" src="" alt="">
      <button class="lightbox-btn" style="inset-inline-end:1rem" id="lb-next" aria-label="Next"><i data-lucide="chevron-right" class="w-6 h-6"></i></button>
      <button id="lb-close" class="lightbox-btn" style="top:1rem;inset-inline-end:1rem;transform:none" aria-label="Close"><i data-lucide="x" class="w-6 h-6"></i></button>
      <div id="lb-cap" style="position:absolute;bottom:1.25rem;left:50%;transform:translateX(-50%);color:#fff;font-weight:700;background:rgba(0,0,0,.45);padding:.4rem 1rem;border-radius:9999px;font-size:.85rem;white-space:nowrap;max-width:90vw;overflow:hidden;text-overflow:ellipsis"></div>`;
    document.body.appendChild(bd);
    document.body.style.overflow = 'hidden';
    const img = bd.querySelector('#lb-img'), cap = bd.querySelector('#lb-cap');
    const show = (i) => { index = (i + images.length) % images.length; img.src = images[index].src; cap.textContent = images[index].caption || ''; };
    show(index);
    bd.querySelector('#lb-prev').onclick = (e) => { e.stopPropagation(); show(index - 1); };
    bd.querySelector('#lb-next').onclick = (e) => { e.stopPropagation(); show(index + 1); };
    bd.querySelector('#lb-close').onclick = () => { bd.remove(); document.body.style.overflow = ''; };
    bd.onclick = (e) => { if (e.target === bd) { bd.remove(); document.body.style.overflow = ''; } };
    document.addEventListener('keydown', function h(e) {
      if (!document.body.contains(bd)) { document.removeEventListener('keydown', h); return; }
      if (e.key === 'Escape') { bd.remove(); document.body.style.overflow = ''; }
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    cbRefreshIcons();
  };

  /* ---------------- Reveal on scroll ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  window.cbObserveReveals = function (root) {
    (root || document).querySelectorAll('.reveal:not(.revealed)').forEach((el) => io.observe(el));
  };

  /* ---------------- FAQ accordion ---------------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-faq]');
    if (!btn) return;
    const body = document.getElementById(btn.getAttribute('data-faq'));
    const icon = btn.querySelector('[data-faq-icon]');
    const open = body.classList.toggle('open');
    if (icon) icon.style.transform = open ? 'rotate(180deg)' : '';
  });

  /* ---------------- Boot ---------------- */
  seed();
  const packageImages = {
    'pkg-1': 'assets/images/photos/pkg-princess.jpg',
    'pkg-2': 'assets/images/photos/pkg-superhero.jpg',
    'pkg-3': 'assets/images/photos/pkg-jungle.jpg',
    'pkg-4': 'assets/images/photos/pkg-space.jpg',
    'pkg-5': 'assets/images/photos/pkg-rainbow.jpg',
    'pkg-6': 'assets/images/photos/pkg-dinosaur.jpg',
    'pkg-7': 'assets/images/photos/pkg-teddy.jpg',
    'pkg-8': 'assets/images/photos/pkg-floral.jpg',
    'pkg-9': 'assets/images/photos/pkg-minimalist.jpg',
    'pkg-10': 'assets/images/photos/pkg-custom.jpg',
  };
  const seededPackages = read(K.packages, []);
  const packagesWithoutFloral = seededPackages.filter(p => p.id !== 'pkg-8' && p.name !== 'Floral');
  let packageImagesChanged = false;
  seededPackages.forEach(p => {
    if (packageImages[p.id] && p.image !== packageImages[p.id]) {
      p.image = packageImages[p.id];
      packageImagesChanged = true;
    }
  });
  if (packageImagesChanged || packagesWithoutFloral.length !== seededPackages.length) write(K.packages, packagesWithoutFloral);

  const themeImages = {
    'th-1': 'assets/images/photos/theme-princess.jpg',
    'th-2': 'assets/images/photos/theme-superhero.jpg',
    'th-3': 'assets/images/photos/theme-jungle.jpg',
    'th-4': 'assets/images/photos/theme-space.jpg',
    'th-5': 'assets/images/photos/pkg-rainbow.jpg',
    'th-6': 'assets/images/photos/pkg-dinosaur.jpg',
    'th-7': 'assets/images/photos/pkg-teddy.jpg',
    'th-8': 'assets/images/photos/pkg-floral.jpg',
    'th-9': 'assets/images/photos/pkg-minimalist.jpg',
    'th-10': 'assets/images/photos/pkg-custom.jpg',
  };
  const seededThemes = read(K.themes, []);
  let themeImagesChanged = false;
  seededThemes.forEach(t => {
    if (themeImages[t.id] && t.image !== themeImages[t.id]) {
      t.image = themeImages[t.id];
      themeImagesChanged = true;
    }
  });
  if (themeImagesChanged) write(K.themes, seededThemes);

  const proofImages = {
    'pr-1': 'assets/images/photos/gal-smash-1.jpg',
    'pr-2': 'assets/images/photos/proof-2.jpg',
    'pr-3': 'assets/images/photos/gal-smash-2.jpg',
    'pr-4': 'assets/images/photos/proof-4.jpg',
    'pr-5': 'assets/images/photos/gal-smash-3.jpg',
    'pr-6': 'assets/images/photos/gal-smash-4.jpg',
  };
  const seededProofs = read(K.proofs, []);
  let proofImagesChanged = false;
  seededProofs.forEach(p => {
    if (proofImages[p.id] && p.image !== proofImages[p.id]) {
      p.image = proofImages[p.id];
      proofImagesChanged = true;
    }
  });
  if (proofImagesChanged) write(K.proofs, seededProofs);
  document.addEventListener('DOMContentLoaded', () => cbObserveReveals());
})();
