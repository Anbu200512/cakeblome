/* CakeBloom â€” navbar, footer, dropdowns, mobile menu, theme/direction toggles */
(function () {
  'use strict';

  const page = document.body.getAttribute('data-page') || '';
  const user = cbUser();

  const icon = (n, cls) => `<i data-lucide="${n}" class="${cls || 'w-4 h-4'}"></i>`;

  function navLink(href, label, active) {
    return `<a href="${href}" class="nav-link ${active ? 'active' : ''}">${label}</a>`;
  }

  function dropdown(id, label, items, activePage) {
    const isActive = items.some(i => i.active);
    return `
    <div class="relative" data-dropdown>
      <button class="nav-link ${isActive ? 'active' : ''}" data-dropdown-btn aria-haspopup="true" aria-expanded="false">
        ${label}${icon('chevron-down', 'w-3.5 h-3.5 transition-transform duration-200')}
      </button>
      <div class="dropdown-panel" id="${id}" role="menu">
        ${items.map(i => `<a href="${i.href}" class="dropdown-item" role="menuitem">${icon(i.icon, 'w-4 h-4')}${i.label}</a>`).join('')}
      </div>
    </div>`;
  }

  const homeItems = [
    { href: 'index.html', label: 'Home 1', icon: 'house', active: page === 'home1' },
    { href: 'home2.html', label: 'Home 2', icon: 'sparkles', active: page === 'home2' },
  ];
  const dashItems = [
    { href: 'dashboard.html', label: 'Parent Dashboard', icon: 'layout-dashboard', active: page === 'dashboard' },
    { href: 'admin-dashboard.html', label: 'Admin Dashboard', icon: 'shield-check', active: page === 'admin' },
  ];

  const authBlock = user
    ? `<button class="cb-btn cb-btn-outline !py-2 !px-4 text-sm" id="nav-logout">${icon('log-out', 'w-4 h-4')}<span class="hidden sm:inline">Logout</span></button>`
    : `<a href="login.html" class="cb-btn cb-btn-primary !py-2 !px-4 text-sm">${icon('log-in', 'w-4 h-4')}<span class="hidden sm:inline">Login</span></a>`;

  const navHTML = `
  <header class="fixed top-0 inset-x-0 z-50">
    <nav class="bg-white/85 dark:bg-[#1B1730]/85 backdrop-blur-lg border-b border-pink-100 dark:border-white/10 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16 gap-1 sm:gap-2">
          <a href="index.html" class="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
            <span class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-pink-500 grid place-items-center text-white shadow-lg shadow-pink-200 dark:shadow-pink-500/20 shrink-0">
              ${icon('cake', 'w-5 h-5')}
            </span>
            <span class="font-display font-bold text-lg sm:text-2xl tracking-tight truncate">Cake<span class="text-gradient">Bloom</span></span>
          </a>

<div class="hidden lg:flex items-center gap-0.5">
            ${dropdown('dd-home', 'Home', homeItems, page)}
            ${navLink('about.html', 'About', page === 'about')}
            ${navLink('packages.html', 'Packages', page === 'packages')}
            ${navLink('studio-tour.html', 'Studio Tour', page === 'studio')}
            ${navLink('gallery.html', 'Gallery', page === 'gallery')}
            ${navLink('contact.html', 'Contact', page === 'contact')}
            ${dropdown('dd-dash', 'Dashboard', dashItems, page)}
          </div>

          <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button id="dir-toggle" class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl grid place-items-center text-[#55506E] dark:text-[#C6C1DA] hover:bg-pink-50 dark:hover:bg-white/10 transition" title="Toggle RTL/LTR">
              ${icon('arrow-left-right', 'w-[18px] h-[18px]')}
            </button>
            <button id="theme-toggle" class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl grid place-items-center text-[#55506E] dark:text-[#C6C1DA] hover:bg-pink-50 dark:hover:bg-white/10 transition" title="Toggle dark/light">
              ${icon('moon', 'w-[18px] h-[18px]')}
            </button>
            <button id="menu-btn" class="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl grid place-items-center text-[#55506E] dark:text-[#C6C1DA] hover:bg-pink-50 dark:hover:bg-white/10 transition">
              ${icon('menu', 'w-5 h-5')}
            </button>
            ${authBlock}
          </div>
        </div>
      </div>

      <div id="mobile-menu" class="hidden lg:hidden border-t border-pink-100 dark:border-white/10 bg-white/95 dark:bg-[#1B1730]/95 backdrop-blur-lg">
        <div class="px-4 py-3 space-y-1">
          <div class="flex items-center gap-2 px-2 py-1 text-xs font-extrabold uppercase tracking-wider text-pink-400">Home</div>
          <a href="index.html" class="nav-link w-full ${page === 'home1' ? 'active' : ''}">${icon('house', 'w-4 h-4')}Home 1</a>
<a href="home2.html" class="nav-link w-full ${page === 'home2' ? 'active' : ''}">${icon('sparkles', 'w-4 h-4')}Home 2</a>
          <a href="about.html" class="nav-link w-full ${page === 'about' ? 'active' : ''}">${icon('sparkles', 'w-4 h-4')}About</a>
          <a href="packages.html" class="nav-link w-full ${page === 'packages' ? 'active' : ''}">${icon('gift', 'w-4 h-4')}Packages</a>
          <a href="studio-tour.html" class="nav-link w-full ${page === 'studio' ? 'active' : ''}">${icon('camera', 'w-4 h-4')}Studio Tour</a>
          <a href="gallery.html" class="nav-link w-full ${page === 'gallery' ? 'active' : ''}">${icon('images', 'w-4 h-4')}Gallery</a>
          <a href="contact.html" class="nav-link w-full ${page === 'contact' ? 'active' : ''}">${icon('phone', 'w-4 h-4')}Contact</a>
          <div class="flex items-center gap-2 px-2 py-1 mt-2 text-xs font-extrabold uppercase tracking-wider text-pink-400">Dashboard</div>
          <a href="dashboard.html" class="nav-link w-full ${page === 'dashboard' ? 'active' : ''}">${icon('layout-dashboard', 'w-4 h-4')}Parent Dashboard</a>
          <a href="admin-dashboard.html" class="nav-link w-full ${page === 'admin' ? 'active' : ''}">${icon('shield-check', 'w-4 h-4')}Admin Dashboard</a>
          ${user
            ? `<button id="nav-logout-m" class="nav-link w-full text-rose-500">${icon('log-out', 'w-4 h-4')}Logout</button>`
: `<a href="login.html" class="nav-link w-full">${icon('log-in', 'w-4 h-4')}Login</a>`}
        </div>
      </div>
    </nav>
  </header>`;

  const mount = document.getElementById('site-nav');
  if (mount) mount.innerHTML = navHTML;

  /* Footer */
  const footerHTML = `
  <footer class="mt-20 bg-blush-50 dark:bg-[#171330] border-t border-pink-100 dark:border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <div class="flex items-center gap-2.5 mb-4">
          <span class="w-10 h-10 rounded-2xl bg-pink-500 grid place-items-center text-white">${icon('cake', 'w-5 h-5')}</span>
          <span class="font-display font-bold text-xl">Cake<span class="text-gradient">Bloom</span></span>
        </div>
        <p class="text-sm text-[#6B6585] dark:text-[#A8A2C0] leading-relaxed">Little Moments. Beautiful Memories. A premium kids' cake smash & photography studio crafting timeless first-birthday stories.</p>
        <div class="flex gap-2 mt-4">
          <a href="#" class="w-9 h-9 rounded-xl bg-white dark:bg-white/10 grid place-items-center text-pink-500 shadow-sm hover:scale-110 transition" aria-label="Instagram">${icon('instagram', 'w-4 h-4')}</a>
          <a href="#" class="w-9 h-9 rounded-xl bg-white dark:bg-white/10 grid place-items-center text-sky-500 shadow-sm hover:scale-110 transition" aria-label="Facebook">${icon('facebook', 'w-4 h-4')}</a>
          <a href="#" class="w-9 h-9 rounded-xl bg-white dark:bg-white/10 grid place-items-center text-rose-500 shadow-sm hover:scale-110 transition" aria-label="YouTube">${icon('youtube', 'w-4 h-4')}</a>
        </div>
      </div>
      <div>
        <h4 class="font-display font-bold mb-4 text-[#3B3654] dark:text-white">Explore</h4>
        <ul class="space-y-2.5 text-sm font-semibold text-[#6B6585] dark:text-[#A8A2C0]">
          <li><a href="packages.html" class="hover:text-pink-500 transition">Packages</a></li>
          <li><a href="studio-tour.html" class="hover:text-pink-500 transition">Studio Tour</a></li>
          <li><a href="gallery.html" class="hover:text-pink-500 transition">Gallery</a></li>
<li><a href="home2.html" class="hover:text-pink-500 transition">Home 2</a></li>
          <li><a href="about.html" class="hover:text-pink-500 transition">About</a></li>
          <li><a href="contact.html" class="hover:text-pink-500 transition">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-display font-bold mb-4 text-[#3B3654] dark:text-white">Parents</h4>
        <ul class="space-y-2.5 text-sm font-semibold text-[#6B6585] dark:text-[#A8A2C0]">
          <li><a href="dashboard.html" class="hover:text-pink-500 transition">Parent Dashboard</a></li>
          <li><a href="login.html" class="hover:text-pink-500 transition">Login</a></li>
          <li><a href="signup.html" class="hover:text-pink-500 transition">Create Account</a></li>
          <li><a href="admin-dashboard.html" class="hover:text-pink-500 transition">Admin</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-display font-bold mb-4 text-[#3B3654] dark:text-white">Visit Us</h4>
        <ul class="space-y-3 text-sm font-semibold text-[#6B6585] dark:text-[#A8A2C0]">
          <li class="flex gap-2.5">${icon('map-pin', 'w-4 h-4 mt-0.5 shrink-0 text-pink-400')}24 Blossom Lane, Indiranagar, Bengaluru 560038</li>
          <li class="flex gap-2.5">${icon('phone', 'w-4 h-4 mt-0.5 shrink-0 text-pink-400')}+91 98765 43210</li>
          <li class="flex gap-2.5">${icon('mail', 'w-4 h-4 mt-0.5 shrink-0 text-pink-400')}hello@cakebloom.studio</li>
          <li class="flex gap-2.5">${icon('clock', 'w-4 h-4 mt-0.5 shrink-0 text-pink-400')}Monâ€“Sun, 9 AM â€“ 7 PM</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-pink-100 dark:border-white/10 py-5 text-center text-xs font-semibold text-[#8B86A3]">
      Â© ${new Date().getFullYear()} CakeBloom Studio. All rights reserved. Made with love for little moments.
    </div>
  </footer>`;
  const fmount = document.getElementById('site-footer');
  if (fmount) fmount.innerHTML = footerHTML;

  /* ---------------- Behavior ---------------- */
  // Dropdowns: click toggles (works desktop + mobile), outside click closes
  document.querySelectorAll('[data-dropdown]').forEach((dd) => {
    const btn = dd.querySelector('[data-dropdown-btn]');
    const panel = dd.querySelector('.dropdown-panel');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = panel.classList.contains('open');
      document.querySelectorAll('.dropdown-panel.open').forEach(p => { p.classList.remove('open'); p.previousElementSibling.setAttribute('aria-expanded', 'false'); });
      if (!wasOpen) { panel.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-panel.open').forEach(p => { p.classList.remove('open'); p.previousElementSibling.setAttribute('aria-expanded', 'false'); });
  });
  document.querySelectorAll('.dropdown-panel').forEach(p => p.addEventListener('click', e => e.stopPropagation()));

  // Mobile menu
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      menuBtn.innerHTML = mobileMenu.classList.contains('hidden') ? icon('menu', 'w-5 h-5') : icon('x', 'w-5 h-5');
      cbRefreshIcons();
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));
  }

  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  const syncThemeIcon = () => {
    const dark = document.documentElement.classList.contains('dark');
    themeBtn.innerHTML = icon(dark ? 'sun' : 'moon', 'w-[18px] h-[18px]');
    themeBtn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
  };
  if (themeBtn) {
    syncThemeIcon();
    themeBtn.addEventListener('click', () => {
      const dark = !document.documentElement.classList.contains('dark');
      cbApplyTheme(dark ? 'dark' : 'light');
      syncThemeIcon();
      cbRefreshIcons();
      cbToast(dark ? 'Dark mode on' : 'Light mode on', 'info');
    });
  }

  // Direction toggle
  const dirBtn = document.getElementById('dir-toggle');
  if (dirBtn) {
    const syncDirectionControl = () => {
      const rtl = document.documentElement.getAttribute('dir') === 'rtl';
      dirBtn.title = rtl ? 'Switch to left-to-right' : 'Switch to right-to-left';
      dirBtn.setAttribute('aria-label', dirBtn.title);
      dirBtn.setAttribute('aria-pressed', String(rtl));
    };
    syncDirectionControl();
    dirBtn.addEventListener('click', () => {
      const rtl = document.documentElement.getAttribute('dir') === 'rtl';
      cbApplyDirection(rtl ? 'ltr' : 'rtl');
      syncDirectionControl();
      cbRefreshIcons();
      cbToast(rtl ? 'Direction: LTR' : 'Direction: RTL', 'info');
    });
  }

  // Logout
  const doLogout = () => {
    localStorage.removeItem(CB_KEYS.user);
    cbToast('Logged out successfully');
    setTimeout(() => location.href = 'index.html', 700);
  };
  ['nav-logout', 'nav-logout-m'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.addEventListener('click', doLogout);
  });

  cbRefreshIcons();
})();

