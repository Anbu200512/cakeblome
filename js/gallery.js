/* CakeBloom — packages page (filters + modal), gallery page, studio tour */
(function () {
  'use strict';

  /* ================= PACKAGES PAGE ================= */
  const pkgGrid = document.getElementById('package-grid');
  if (pkgGrid) {
    const packages = cbRead(CB_KEYS.packages, []);
    const themes = cbRead(CB_KEYS.themes, []);
    const themeFilter = document.getElementById('filter-theme');
    const priceFilter = document.getElementById('filter-price');
    const sortBy = document.getElementById('filter-sort');
    const countEl = document.getElementById('package-count');

    if (themeFilter) {
      themes.forEach(t => {
        const o = document.createElement('option');
        o.value = t.name; o.textContent = t.name;
        themeFilter.appendChild(o);
      });
    }

    function badge(text, cls) { return `<span class="badge ${cls}">${text}</span>`; }

    function render() {
      const tf = themeFilter ? themeFilter.value : 'all';
      const pf = priceFilter ? priceFilter.value : 'all';
      const sb = sortBy ? sortBy.value : 'popular';
      let list = packages.filter(p => {
        if (tf !== 'all' && p.theme !== tf) return false;
        if (pf === 'under6000' && p.price >= 6000) return false;
        if (pf === '6000-8000' && (p.price < 6000 || p.price > 8000)) return false;
        if (pf === 'above8000' && p.price <= 8000) return false;
        return true;
      });
      if (sb === 'low') list.sort((a, b) => a.price - b.price);
      else if (sb === 'high') list.sort((a, b) => b.price - a.price);
      else list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));

      if (countEl) countEl.textContent = list.length + ' package' + (list.length === 1 ? '' : 's');

      pkgGrid.innerHTML = list.map((p, i) => `
        <div class="cb-card overflow-hidden flex flex-col anim-fade-up" style="animation-delay:${i * 60}ms">
          <div class="relative h-52 overflow-hidden">
            <img src="${p.image}" alt="${cbEscape(p.name)} cake smash package" class="w-full h-full object-cover" loading="lazy">
            ${p.popular ? '<span class="absolute top-3 start-3">' + badge('Popular', 'badge-pink') + '</span>' : ''}
          </div>
          <div class="p-5 flex flex-col flex-1">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white">${cbEscape(p.name)}</h3>
              <span class="font-display font-bold text-pink-500">${cbMoney(p.price)}</span>
            </div>
            <p class="text-xs font-semibold text-[#8B86A3] mb-3">${cbEscape(p.theme)} theme · ${cbEscape(p.duration)} · ${p.photos} edited photos</p>
            <ul class="text-sm font-semibold text-[#55506E] dark:text-[#C6C1DA] space-y-1.5 mb-4 flex-1">
              <li class="flex items-center gap-2"><i data-lucide="image" class="w-4 h-4 text-pink-400"></i>${cbEscape(p.backdrop)}</li>
              <li class="flex items-center gap-2"><i data-lucide="cake" class="w-4 h-4 text-violet-400"></i>${cbEscape(p.cake)}</li>
              <li class="flex items-center gap-2"><i data-lucide="wand-sparkles" class="w-4 h-4 text-sky-400"></i>${cbEscape(p.props)}</li>
            </ul>
            <div class="flex gap-2">
              <button class="cb-btn cb-btn-outline flex-1 !py-2.5 text-sm" data-details="${p.id}">View Details</button>
              <button class="cb-btn cb-btn-primary flex-1 !py-2.5 text-sm" data-book="${p.id}">Book Session</button>
            </div>
          </div>
        </div>`).join('');

      cbRefreshIcons();
      pkgGrid.querySelectorAll('[data-details]').forEach(b => b.addEventListener('click', () => openPackageModal(b.getAttribute('data-details'))));
      pkgGrid.querySelectorAll('[data-book]').forEach(b => b.addEventListener('click', () => {
        const u = cbUser();
        if (!u) { cbToast('Please login to book a session', 'info'); setTimeout(() => location.href = 'login.html', 900); return; }
        location.href = 'dashboard.html#book';
      }));
    }

    function openPackageModal(id) {
      const p = packages.find(x => x.id === id);
      if (!p) return;
      const m = document.getElementById('package-modal');
      m.querySelector('.modal-content').innerHTML = `
        <div class="relative h-56">
          <img src="${p.image}" alt="${cbEscape(p.name)} package" class="w-full h-full object-cover">
          <button class="absolute top-3 end-3 w-9 h-9 rounded-full bg-black/40 text-white grid place-items-center hover:bg-black/60" onclick="cbCloseModal('package-modal')"><i data-lucide="x" class="w-5 h-5"></i></button>
          ${p.popular ? badge('Most Popular', 'badge-pink') : ''}
        </div>
        <div class="p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-display font-bold text-2xl text-[#3B3654] dark:text-white">${cbEscape(p.name)} Package</h3>
            <span class="font-display font-bold text-2xl text-pink-500">${cbMoney(p.price)}</span>
          </div>
          <p class="text-sm font-semibold text-[#6B6585] dark:text-[#A8A2C0] mb-4">${cbEscape(p.description)}</p>
          <div class="grid grid-cols-2 gap-3 mb-5">
            <div class="bg-pink-50 dark:bg-white/5 rounded-xl p-3"><div class="text-xs font-bold text-pink-400 uppercase tracking-wide mb-1">Duration</div><div class="font-bold text-sm text-[#3B3654] dark:text-white">${cbEscape(p.duration)}</div></div>
            <div class="bg-violet-50 dark:bg-white/5 rounded-xl p-3"><div class="text-xs font-bold text-violet-400 uppercase tracking-wide mb-1">Edited Photos</div><div class="font-bold text-sm text-[#3B3654] dark:text-white">${p.photos} photos</div></div>
            <div class="bg-sky-50 dark:bg-white/5 rounded-xl p-3"><div class="text-xs font-bold text-sky-400 uppercase tracking-wide mb-1">Backdrop</div><div class="font-bold text-sm text-[#3B3654] dark:text-white">${cbEscape(p.backdrop)}</div></div>
            <div class="bg-amber-50 dark:bg-white/5 rounded-xl p-3"><div class="text-xs font-bold text-amber-500 uppercase tracking-wide mb-1">Cake</div><div class="font-bold text-sm text-[#3B3654] dark:text-white">${cbEscape(p.cake)}</div></div>
          </div>
          <div class="bg-emerald-50 dark:bg-white/5 rounded-xl p-3 mb-5">
            <div class="text-xs font-bold text-emerald-500 uppercase tracking-wide mb-1">Props Included</div>
            <div class="font-bold text-sm text-[#3B3654] dark:text-white">${cbEscape(p.props)}</div>
          </div>
          <div class="flex gap-2">
            <button class="cb-btn cb-btn-outline flex-1" onclick="cbCloseModal('package-modal')">Close</button>
            <button class="cb-btn cb-btn-primary flex-1" id="modal-book-btn">${cbUser() ? 'Book This Package' : 'Login to Book'}</button>
          </div>
        </div>`;
      cbOpenModal('package-modal');
      document.getElementById('modal-book-btn').addEventListener('click', () => {
        cbCloseModal('package-modal');
        if (!cbUser()) { location.href = 'login.html'; return; }
        location.href = 'dashboard.html#book';
      });
      cbRefreshIcons();
    }

    [themeFilter, priceFilter, sortBy].forEach(el => el && el.addEventListener('change', render));
    render();
  }

  /* ================= GALLERY PAGE ================= */
  const galGrid = document.getElementById('gallery-grid');
  if (galGrid) {
    const items = [
      { cat: 'Cake Smash', src: 'assets/images/photos/gal-smash-1.jpg', cap: 'Pink Perfection — a joyful cake smash' },
      { cat: 'Cake Smash', src: 'assets/images/photos/gal-smash-2.jpg', cap: 'Blueberry Bash — frosting and fun' },
      { cat: 'Cake Smash', src: 'assets/images/photos/gal-smash-3.jpg', cap: 'Purple Haze — a colorful first smash' },
      { cat: 'Cake Smash', src: 'assets/images/photos/gal-smash-4.jpg', cap: 'Mint Condition — little hands, big mess' },
      { cat: 'First Birthday', src: 'assets/images/photos/gal-birthday-1.jpg', cap: 'One & Fun — a candlelit birthday' },
      { cat: 'First Birthday', src: 'assets/images/photos/gal-birthday-2.webp', cap: 'Birthday Wishes — a special first birthday' },
      { cat: 'First Birthday', src: 'assets/images/photos/h2-gallery-3-birthday-joy.jpg', cap: 'Birthday Joy — celebrating the big one' },
      { cat: 'Baby Portraits', src: 'assets/images/photos/h2-gallery-1-tiny-portraits.jpg', cap: 'Tiny Portraits — little details to remember' },
      { cat: 'Baby Portraits', src: 'assets/images/photos/h2-gallery-5-rosy-cheeks.jpg', cap: 'Rosy Cheeks — a sweet baby portrait' },
      { cat: 'Family', src: 'assets/images/photos/h2-gallery-2-family-first.jpg', cap: 'Family First — together for the milestone' },
      { cat: 'Theme Sessions', src: 'assets/images/photos/h2-gallery-4-blueberry-bash.jpg', cap: 'Blueberry Bash — a playful themed session' },
    ];
    function renderGallery() {
      galGrid.innerHTML = items.map((it, i) => `
        <figure class="relative group rounded-3xl overflow-hidden shadow-lg cursor-pointer reveal" data-lb="${i}" style="aspect-ratio:${[4 / 3, 1, 3 / 4, 4 / 5][i % 4]}">
          <img src="${it.src}" alt="${cbEscape(it.cap)}" class="w-full h-full object-cover transition duration-700 group-hover:scale-110" loading="lazy">
          <figcaption class="absolute inset-x-0 bottom-0 bg-black/75 p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
            <span class="badge badge-pink mb-1.5">${cbEscape(it.cat)}</span>
            <p class="text-white font-bold text-sm">${cbEscape(it.cap)}</p>
          </figcaption>
          <span class="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur text-white grid place-items-center opacity-0 group-hover:opacity-100 transition"><i data-lucide="expand" class="w-4 h-4"></i></span>
        </figure>`).join('');
      cbObserveReveals(galGrid);
      cbRefreshIcons();
      galGrid.querySelectorAll('[data-lb]').forEach(el => el.addEventListener('click', () => {
        cbLightbox(items.map(x => ({ src: x.src, caption: x.cap })), +el.getAttribute('data-lb'));
      }));
    }

    renderGallery();
  }

  /* ================= STUDIO TOUR ================= */
  const tourGrid = document.getElementById('tour-grid');
  if (tourGrid) {
    const spots = [
      { src: 'assets/images/photos/studio-entrance.jpg', cap: 'Studio Entrance', desc: 'A warm, welcoming doorway with a pastel welcome wall, sanitised shoe rack and a tiny coat hanger corner for little guests.' },
      { src: 'assets/images/photos/studio-main.jpg', cap: 'Cake Smash Area', desc: 'Our signature smash zone: a padded floor, themed backdrop and a low table set at the perfect height for tiny cake destroyers.' },
      { src: 'assets/images/photos/studio-about.jpg', cap: 'Themed Backdrops', desc: 'Ten hand-painted and printed backdrops — from royal castles to galaxies — swapped in minutes between sessions.' },
      { src: 'assets/images/photos/studio-sanitised-props.jpg', cap: 'Props Collection', desc: 'Over 200 props: tiaras, capes, tails, crowns, balloons and handmade sets, all washed after every session.' },
      { src: 'assets/images/photos/studio-parent-lounge.jpg', cap: 'Parent Waiting Area', desc: 'A cosy lounge with comfortable seating, charging points, refreshments and a live view of the shoot on our monitor.' },
      { src: 'assets/images/photos/studio-nursing-room.jpg', cap: 'Changing Area', desc: 'A private, sanitised changing space with a nursing mirror, wipes, and outfit hooks for every costume change.' },
      { src: 'assets/images/photos/studio-diffused-light.jpg', cap: 'Lighting Setup', desc: 'Professional softbox and ring lighting, always diffused for safe, flicker-free, baby-friendly illumination.' },
      { src: 'assets/images/photos/studio-safety.jpg', cap: 'Safety & Cleanliness', desc: 'Hospital-grade sanitisation, hypoallergenic props, rounded furniture edges and a first-aid certified team on every floor.' },
    ];
    tourGrid.innerHTML = spots.map((s, i) => `
      <div class="cb-card overflow-hidden reveal">
        <div class="relative h-56 overflow-hidden cursor-pointer" data-tour="${i}">
          <img src="${s.src}" alt="${cbEscape(s.cap)}" class="w-full h-full object-cover" loading="lazy">
          <span class="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/25 backdrop-blur text-white grid place-items-center"><i data-lucide="expand" class="w-4 h-4"></i></span>
        </div>
        <div class="p-5">
          <h3 class="font-display font-bold text-lg text-[#3B3654] dark:text-white mb-1.5">${cbEscape(s.cap)}</h3>
          <p class="text-sm font-semibold text-[#6B6585] dark:text-[#A8A2C0] leading-relaxed">${cbEscape(s.desc)}</p>
        </div>
      </div>`).join('');
    cbObserveReveals(tourGrid);
    cbRefreshIcons();
    tourGrid.querySelectorAll('[data-tour]').forEach(el => el.addEventListener('click', () => {
      cbLightbox(spots.map(s => ({ src: s.src, caption: s.cap })), +el.getAttribute('data-tour'));
    }));
  }
})();

