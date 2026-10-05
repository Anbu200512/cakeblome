/* CakeBloom — authentication demo (localStorage) */
(function () {
  'use strict';

  function getUsers() { return cbRead(CB_KEYS.users, []); }
  function saveUsers(u) { cbWrite(CB_KEYS.users, u); }

  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function validMobile(m) { return /^[6-9]\d{9}$/.test(m); }

  function displayNameFrom(idVal) {
    const raw = validEmail(idVal) ? idVal.split('@')[0] : 'guest' + idVal.slice(-4);
    return raw.replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function startSession(user, msg) {
    cbWrite(CB_KEYS.user, { id: user.id, name: user.name, email: user.email || '', role: user.role || 'parent' });
    cbToast(msg || 'Welcome back, ' + String(user.name).split(' ')[0] + '!');
    setTimeout(() => { location.href = user.role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html'; }, 800);
  }

  function setErr(input, msg) {
    const err = input.closest('div')?.nextElementSibling;
    if (err && err.classList.contains('field-error')) { err.textContent = msg; err.classList.toggle('hidden', !msg); }
    input.classList.toggle('!border-rose-400', !!msg);
  }

  /* ---------------- Login ---------------- */
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('login-id');
      const pw = document.getElementById('login-password');
      let ok = true;
      const idVal = id.value.trim();
      if (!idVal) { setErr(id, 'Enter your email or mobile'); ok = false; } else setErr(id, '');
      if (!pw.value) { setErr(pw, 'Enter your password'); ok = false; } else setErr(pw, '');
      if (!ok) return;

      const users = getUsers();
      let found = users.find(u => (u.email.toLowerCase() === idVal.toLowerCase() || u.mobile === idVal) && u.password === pw.value);
      if (!found) {
        found = users.find(u => u.email.toLowerCase() === idVal.toLowerCase() || u.mobile === idVal);
        if (!found) {
          found = {
            id: cbUid('u'), name: displayNameFrom(idVal), email: validEmail(idVal) ? idVal : '',
            mobile: validMobile(idVal) ? idVal : '', password: pw.value, role: 'parent',
            createdAt: new Date().toISOString(),
          };
          users.push(found); saveUsers(users);
        }
      }

      startSession(found);
    });

    const forgot = document.getElementById('forgot-link');
    if (forgot) forgot.addEventListener('click', (e) => {
      e.preventDefault();
      const email = prompt('Enter your registered email or mobile:');
      if (!email) return;
      const found = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase() || u.mobile === email.trim());
      cbToast(found ? 'Password reset link sent to your email (demo).' : 'No account found with that email/mobile.', found ? 'info' : 'error');
    });
  }

  /* ---------------- Signup ---------------- */
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('su-name');
      const email = document.getElementById('su-email');
      const mobile = document.getElementById('su-mobile');
      const pw = document.getElementById('su-password');
      const cpw = document.getElementById('su-confirm');
      const child = document.getElementById('su-child');
      const dob = document.getElementById('su-dob');
      let ok = true;

      if (name.value.trim().length < 2) { setErr(name, 'Enter the parent\'s full name'); ok = false; } else setErr(name, '');
      if (!validEmail(email.value.trim())) { setErr(email, 'Enter a valid email address'); ok = false; } else setErr(email, '');
      if (!validMobile(mobile.value.trim())) { setErr(mobile, 'Enter a valid 10-digit mobile number'); ok = false; } else setErr(mobile, '');
      if (pw.value.length < 6) { setErr(pw, 'Minimum 6 characters required'); ok = false; } else setErr(pw, '');
      if (cpw.value !== pw.value || !cpw.value) { setErr(cpw, 'Passwords do not match'); ok = false; } else setErr(cpw, '');
      if (child.value.trim().length < 2) { setErr(child, 'Enter your child\'s name'); ok = false; } else setErr(child, '');
      if (!dob.value) { setErr(dob, 'Select child\'s date of birth'); ok = false; } else setErr(dob, '');
      if (!ok) return;

      const users = getUsers();
      if (users.some(u => u.email.toLowerCase() === email.value.trim().toLowerCase())) {
        setErr(email, 'An account with this email already exists'); return;
      }
      const newUser = {
        id: cbUid('u'), name: name.value.trim(), email: email.value.trim(),
        mobile: mobile.value.trim(), password: pw.value, role: 'parent',
        childName: child.value.trim(), childDob: dob.value, createdAt: new Date().toISOString(),
      };
      users.push(newUser); saveUsers(users);
      cbWrite(CB_KEYS.user, { id: newUser.id, name: newUser.name, email: newUser.email, role: 'parent' });
      cbToast('Account created. Welcome to CakeBloom, ' + newUser.name.split(' ')[0] + '!');
      setTimeout(() => { location.href = 'dashboard.html'; }, 900);
    });
  }

  /* ---------------- Social login (demo) ---------------- */
  document.querySelectorAll('[data-social]').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-social');
      const users = getUsers();
      const email = (provider + '.demo@cakebloom.in').toLowerCase();
      let user = users.find(u => u.email.toLowerCase() === email);
      if (!user) {
        user = {
          id: cbUid('u'), name: provider + ' Parent', email: email,
          mobile: '', password: 'demo1234', role: 'parent', provider: provider.toLowerCase(),
          createdAt: new Date().toISOString(),
        };
        users.push(user); saveUsers(users);
      }
      startSession(user, 'Signed in with ' + provider + '. Welcome!');
    });
  });

  // Redirect if already logged in
  if (document.body.getAttribute('data-auth') === 'guest-only' && cbUser()) {
    location.href = cbUser().role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';
  }
})();
