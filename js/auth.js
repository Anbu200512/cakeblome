/* CakeBloom — authentication demo (localStorage) */
(function () {
  'use strict';

  function getUsers() { return cbRead(CB_KEYS.users, []); }
  function saveUsers(u) { cbWrite(CB_KEYS.users, u); }

  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function validMobile(m) { return /^[6-9]\d{9}$/.test(m); }

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
      if (!validEmail(idVal) && !validMobile(idVal)) { setErr(id, 'Enter a valid email or 10-digit mobile'); ok = false; } else setErr(id, '');
      if (pw.value.length < 6) { setErr(pw, 'Password must be at least 6 characters'); ok = false; } else setErr(pw, '');
      if (!ok) return;

      const users = getUsers();
      const found = users.find(u => (u.email.toLowerCase() === idVal.toLowerCase() || u.mobile === idVal) && u.password === pw.value);
      if (!found) { cbToast('Invalid credentials. Try the demo accounts below.', 'error'); return; }

      cbWrite(CB_KEYS.user, { id: found.id, name: found.name, email: found.email, role: found.role });
      cbToast('Welcome back, ' + found.name.split(' ')[0] + '!');
      setTimeout(() => { location.href = found.role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html'; }, 800);
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

  // Redirect if already logged in
  if (document.body.getAttribute('data-auth') === 'guest-only' && cbUser()) {
    location.href = cbUser().role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';
  }
})();
