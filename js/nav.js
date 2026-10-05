/* CakeBloom — navbar, footer, dropdowns, mobile menu, theme/direction toggles */
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

  // Collapsible group used by the mobile panel (opens itself when a child is active).
  function mAccGroup(id, label, openByDefault, links) {
    return `
    <div class="m-acc-group ${openByDefault ? 'open' : ''}" data-acc>
      <button type="button" class="m-acc-trigger" data-acc-trigger aria-expanded="${openByDefault}" aria-controls="${id}">
        <span>${label}</span>
        <i data-lucide="chevron-down" class="m-acc-chev w-4 h-4"></i>
      </button>
      <div class="m-acc-panel" id="${id}">
        <div>
          ${links.map(([href, text, active]) => `<a href="${href}" class="m-acc-link ${active ? 'active' : ''}">${text}</a>`).join('')}
        </div>
      </div>
    </div>`;
  }

  // Below xl (1280px) only the logo and the hamburger stay in the bar, so every
  // other control is duplicated inside the collapsible panel.
  const desktopOnly = 'hidden xl:inline-flex';

  const navHTML = `
  <header class="fixed top-0 inset-x-0 z-50">
    <nav class="bg-white/85 dark:bg-[#1B1730]/85 backdrop-blur-lg border-b border-pink-100 dark:border-white/10 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16 gap-1 sm:gap-2">
          <a href="index.html" class="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
            <span class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-pink-500 grid place-items-center text-white shadow-lg shadow-pink-200 dark:shadow-pink-500/20 shrink-0">
              ${icon('cake', 'w-5 h-5')}
            </span>
            <span class="font-display font-extrabold text-lg sm:text-2xl tracking-tight truncate">Cake<span class="text-gradient">Bloom</span></span>
          </a>

<div class="hidden xl:flex items-center gap-0.5">
            ${dropdown('dd-home', 'Home', homeItems, page)}
            ${navLink('about.html', 'About', page === 'about')}
            ${navLink('packages.html', 'Packages', page === 'packages')}
            ${navLink('studio-tour.html', 'Studio Tour', page === 'studio')}
            ${navLink('gallery.html', 'Gallery', page === 'gallery')}
            ${navLink('contact.html', 'Contact', page === 'contact')}
            ${dropdown('dd-dash', 'Dashboard', dashItems, page)}
          </div>

          <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button id="dir-toggle" class="hidden xl:grid w-8 h-8 sm:w-9 sm:h-9 rounded-xl place-items-center text-[#55506E] dark:text-[#C6C1DA] hover:bg-pink-50 dark:hover:bg-white/10 transition" title="Toggle RTL/LTR">
              ${icon('arrow-left-right', 'w-[18px] h-[18px]')}
            </button>
            <button id="theme-toggle" class="hidden xl:grid w-8 h-8 sm:w-9 sm:h-9 rounded-xl place-items-center text-[#55506E] dark:text-[#C6C1DA] hover:bg-pink-50 dark:hover:bg-white/10 transition" title="Toggle dark/light">
              ${icon('moon', 'w-[18px] h-[18px]')}
            </button>
            <span class="${desktopOnly}">${authBlock}</span>
            <button id="menu-btn" class="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl grid place-items-center text-[#55506E] dark:text-[#C6C1DA] hover:bg-pink-50 dark:hover:bg-white/10 transition" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
              ${icon('menu', 'w-5 h-5')}
            </button>
          </div>
        </div>
      </div>

<div id="mobile-menu" class="hidden xl:hidden border-t border-pink-100 dark:border-white/10 bg-white/95 dark:bg-[#1B1730]/95 backdrop-blur-lg max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain">
        <div class="px-4 py-4 space-y-2.5">
          ${mAccGroup('m-acc-home', 'Home', page === 'home1' || page === 'home2', [
            ['index.html', 'Home 1', page === 'home1'],
            ['home2.html', 'Home 2', page === 'home2'],
          ])}

          <a href="about.html" class="nav-link w-full ${page === 'about' ? 'active' : ''}">About</a>
          <a href="packages.html" class="nav-link w-full ${page === 'packages' ? 'active' : ''}">Packages</a>
          <a href="studio-tour.html" class="nav-link w-full ${page === 'studio' ? 'active' : ''}">Studio Tour</a>
          <a href="gallery.html" class="nav-link w-full ${page === 'gallery' ? 'active' : ''}">Gallery</a>
          <a href="contact.html" class="nav-link w-full ${page === 'contact' ? 'active' : ''}">Contact</a>

          ${mAccGroup('m-acc-dash', 'Dashboard', page === 'dashboard' || page === 'admin', [
            ['dashboard.html', 'Parent Dashboard', page === 'dashboard'],
            ['admin-dashboard.html', 'Admin Dashboard', page === 'admin'],
          ])}

          <div class="h-px bg-pink-100 dark:bg-white/10 my-3"></div>

          <div class="flex items-center justify-center gap-4">
            <button type="button" class="m-icon-btn" data-panel-dir aria-label="Toggle RTL/LTR" title="Toggle RTL/LTR">
              <span data-dir-icon>${icon('arrow-left-right', 'w-[18px] h-[18px]')}</span>
            </button>
            <button type="button" class="m-icon-btn" data-panel-theme aria-label="Toggle dark/light" title="Toggle dark/light">
              <span data-theme-icon>${icon('moon', 'w-[18px] h-[18px]')}</span>
            </button>
          </div>

          <div class="pt-1">
            ${user
              ? `<button type="button" class="cb-btn cb-btn-outline w-full" id="nav-logout-m">${icon('log-out', 'w-4 h-4')}Logout</button>`
              : `<a href="login.html" class="cb-btn cb-btn-primary w-full">${icon('log-in', 'w-4 h-4')}Login</a>`}
          </div>
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
          <span class="w-10 h-10 rounded-2xl bg-pink-500 grid place-items-center text-white shrink-0">${icon('cake', 'w-5 h-5')}</span>
          <span class="font-display font-extrabold text-xl">Cake<span class="text-gradient">Bloom</span></span>
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
          <li class="flex gap-2.5">${icon('clock', 'w-4 h-4 mt-0.5 shrink-0 text-pink-400')}Mon–Sun, 9 AM – 7 PM</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-pink-100 dark:border-white/10 py-5 text-center text-xs font-semibold text-[#8B86A3]">
      © ${new Date().getFullYear()} CakeBloom Studio. All rights reserved. Made with love for little moments.
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
  const setMenuOpen = (open) => {
    mobileMenu.classList.toggle('hidden', !open);
    menuBtn.innerHTML = icon(open ? 'x' : 'menu', 'w-5 h-5');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    cbRefreshIcons();
  };
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => setMenuOpen(mobileMenu.classList.contains('hidden')));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenuOpen(false)));
    // Leaving the mobile breakpoint should not strand an open panel behind the desktop bar.
    window.matchMedia('(min-width: 1280px)').addEventListener('change', e => {
      if (e.matches) setMenuOpen(false);
    });
  }

  /* Icon-only preference buttons in the mobile panel mirror the desktop toggles. */
  cbBindPanelToggles();

  // Collapsible groups inside the mobile panel: one open at a time.
  document.querySelectorAll('#mobile-menu [data-acc]').forEach(acc => {
    const trigger = acc.querySelector('[data-acc-trigger]');
    trigger.addEventListener('click', () => {
      const open = acc.classList.contains('open');
      document.querySelectorAll('#mobile-menu [data-acc]').forEach(other => {
        other.classList.remove('open');
        other.querySelector('[data-acc-trigger]').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        acc.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
      setMenuOpen(true);
    });
  });

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

