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
  function todayISO2() { return iso(new Date()); }

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
      { id: 'bk-1', userId: 'u-parent', packageId: 'pkg-1', themeId: 'th-1', date: iso(addDays(6)), time: '10:30 AM', status: 'confirmed', notes: 'Aarav loves pink and sparkles!', createdAt: iso(addDays(-10)) },
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

  /* ---------------- Seed upgrade: richer admin demo data ---------------- */
  const upgradeFlag = 'cakebloom_seed_v2';
  function upgradeSeed() {
    if (localStorage.getItem(upgradeFlag)) return;

    const addUnique = (key, rows) => {
      const cur = read(key, []);
      const ids = new Set(cur.map(r => r.id));
      const fresh = rows.filter(r => !ids.has(r.id));
      if (fresh.length) write(key, cur.concat(fresh));
    };

    addUnique(K.users, [
      { id: 'u-2', name: 'Rohan Mehta', email: 'rohan@cakebloom.com', mobile: '9811122233', password: 'parent123', role: 'parent', childName: 'Vivaan Mehta', childDob: iso(addDays(-360)), createdAt: iso(addDays(-52)) },
      { id: 'u-3', name: 'Priya Nair', email: 'priya@cakebloom.com', mobile: '9822233445', password: 'parent123', role: 'parent', childName: 'Aarav Nair', childDob: iso(addDays(-375)), createdAt: iso(addDays(-41)) },
      { id: 'u-4', name: 'Karthik Reddy', email: 'karthik@cakebloom.com', mobile: '9833344556', password: 'parent123', role: 'parent', childName: 'Diya Reddy', childDob: iso(addDays(-340)), createdAt: iso(addDays(-33)) },
      { id: 'u-5', name: 'Sneha Kulkarni', email: 'sneha@cakebloom.com', mobile: '9844455667', password: 'parent123', role: 'parent', childName: 'Ishaan Kulkarni', childDob: iso(addDays(-365)), createdAt: iso(addDays(-27)) },
      { id: 'u-6', name: 'Farhan Ali', email: 'farhan@cakebloom.com', mobile: '9855566778', password: 'parent123', role: 'parent', childName: 'Zara Ali', childDob: iso(addDays(-352)), createdAt: iso(addDays(-19)) },
      { id: 'u-7', name: 'Divya Raman', email: 'divya@cakebloom.com', mobile: '9866677889', password: 'parent123', role: 'parent', childName: 'Kavya Raman', childDob: iso(addDays(-330)), createdAt: iso(addDays(-12)) },
      { id: 'u-8', name: 'Arjun Pillai', email: 'arjun@cakebloom.com', mobile: '9877788990', password: 'parent123', role: 'parent', childName: 'Reyansh Pillai', childDob: iso(addDays(-368)), createdAt: iso(addDays(-6)) },
    ]);

    const extraBookings = [
      { id: 'bk-2', userId: 'u-2', packageId: 'pkg-2', themeId: 'th-2', date: iso(addDays(-28)), time: '10:30 AM', status: 'completed', notes: 'Superhero — cape fitting approved.', createdAt: iso(addDays(-42)) },
      { id: 'bk-3', userId: 'u-3', packageId: 'pkg-4', themeId: 'th-4', date: iso(addDays(-24)), time: '12:00 PM', status: 'completed', notes: 'Space theme, prefers rocket launch frames.', createdAt: iso(addDays(-38)) },
      { id: 'bk-4', userId: 'u-4', packageId: 'pkg-1', themeId: 'th-1', date: iso(addDays(-21)), time: '09:00 AM', status: 'completed', notes: '', createdAt: iso(addDays(-34)) },
      { id: 'bk-5', userId: 'u-5', packageId: 'pkg-6', themeId: 'th-6', date: iso(addDays(-18)), time: '04:00 PM', status: 'completed', notes: 'Dinosaur rawr theme.', createdAt: iso(addDays(-30)) },
      { id: 'bk-6', userId: 'u-6', packageId: 'pkg-3', themeId: 'th-3', date: iso(addDays(-15)), time: '02:30 PM', status: 'completed', notes: '', createdAt: iso(addDays(-26)) },
      { id: 'bk-7', userId: 'u-7', packageId: 'pkg-5', themeId: 'th-5', date: iso(addDays(-11)), time: '11:00 AM', status: 'completed', notes: 'Rainbow arch, no glitter.', createdAt: iso(addDays(-22)) },
      { id: 'bk-8', userId: 'u-8', packageId: 'pkg-7', themeId: 'th-7', date: iso(addDays(-8)), time: '05:30 PM', status: 'completed', notes: '', createdAt: iso(addDays(-19)) },
      { id: 'bk-9', userId: 'u-2', packageId: 'pkg-10', themeId: 'th-10', date: iso(addDays(-4)), time: '10:30 AM', status: 'cancelled', notes: 'Family travel conflict.', createdAt: iso(addDays(-14)) },
      { id: 'bk-10', userId: 'u-3', packageId: 'pkg-2', themeId: 'th-2', date: iso(addDays(2)), time: '10:30 AM', status: 'confirmed', notes: 'Returning family, superhero again.', createdAt: iso(addDays(-9)) },
      { id: 'bk-11', userId: 'u-4', packageId: 'pkg-4', themeId: 'th-4', date: iso(addDays(3)), time: '12:00 PM', status: 'confirmed', notes: '', createdAt: iso(addDays(-7)) },
      { id: 'bk-12', userId: 'u-5', packageId: 'pkg-1', themeId: 'th-1', date: iso(addDays(4)), time: '09:00 AM', status: 'pending', notes: 'Awaiting 50% advance.', createdAt: iso(addDays(-5)) },
      { id: 'bk-13', userId: 'u-6', packageId: 'pkg-6', themeId: 'th-6', date: iso(addDays(9)), time: '04:00 PM', status: 'confirmed', notes: '', createdAt: iso(addDays(-4)) },
      { id: 'bk-14', userId: 'u-7', packageId: 'pkg-3', themeId: 'th-3', date: iso(addDays(12)), time: '02:30 PM', status: 'confirmed', notes: 'Jungle safari set.', createdAt: iso(addDays(-3)) },
      { id: 'bk-15', userId: 'u-8', packageId: 'pkg-5', themeId: 'th-5', date: iso(addDays(15)), time: '11:00 AM', status: 'pending', notes: 'Wants an earlier slot if possible.', createdAt: iso(addDays(-2)) },
      { id: 'bk-16', userId: 'u-2', packageId: 'pkg-7', themeId: 'th-7', date: iso(addDays(18)), time: '05:30 PM', status: 'confirmed', notes: '', createdAt: iso(addDays(-1)) },
    ];

    addUnique(K.bookings, extraBookings);

    const amountFor = { 'bk-2': 7499, 'bk-3': 8499, 'bk-4': 7999, 'bk-5': 7499, 'bk-6': 6999, 'bk-7': 6499, 'bk-8': 5999, 'bk-9': 11999, 'bk-10': 7499, 'bk-11': 8499, 'bk-12': 7999, 'bk-13': 7499, 'bk-14': 6999, 'bk-15': 6499, 'bk-16': 5999 };
    const methods = ['UPI', 'Card', 'Net Banking', 'UPI', 'Cash'];
    addUnique(K.payments, extraBookings.filter(b => b.status !== 'cancelled').map((b, i) => {
      const total = amountFor[b.id] || 7999;
      const advance = Math.round(total * 0.5);
      const rest = total - advance;
      const paid = b.status === 'completed' || b.status === 'confirmed';
      return [
        { id: 'pay-a-' + b.id, bookingId: b.id, userId: b.userId, amount: advance, date: b.createdAt, method: methods[i % methods.length], status: paid ? 'Paid' : 'Unpaid', txnId: 'CB' + (2100 + i * 7) + 'A' },
        { id: 'pay-b-' + b.id, bookingId: b.id, userId: b.userId, amount: rest, date: b.date, method: methods[(i + 2) % methods.length], status: b.status === 'completed' ? 'Paid' : 'Unpaid', txnId: 'CB' + (2100 + i * 7) + 'B' },
      ];
    }).flat());

    addUnique(K.prints, [
      { id: 'po-1', userId: 'u-2', type: 'Photo Album', size: '8x10 hardcover, 30 pages', qty: 1, price: 5499, status: 'Delivered', createdAt: iso(addDays(-24)) },
      { id: 'po-2', userId: 'u-3', type: 'Canvas Print', size: '24x36 inch stretched', qty: 2, price: 8999, status: 'Processing', createdAt: iso(addDays(-5)) },
      { id: 'po-3', userId: 'u-4', type: 'Framed Print', size: '12x18 inch oak frame', qty: 1, price: 3499, status: 'In Progress', createdAt: iso(addDays(-3)) },
      { id: 'po-4', userId: 'u-5', type: 'Photo Box', size: '10x10 inch, 20 prints', qty: 1, price: 4299, status: 'Processing', createdAt: iso(addDays(-2)) },
      { id: 'po-5', userId: 'u-6', type: 'Calendar', size: 'A4 wall calendar 2026', qty: 3, price: 1899, status: 'Delivered', createdAt: iso(addDays(-9)) },
      { id: 'po-6', userId: 'u-7', type: 'Photo Album', size: '8x10 hardcover, 30 pages', qty: 1, price: 5499, status: 'In Progress', createdAt: iso(addDays(-1)) },
      { id: 'po-7', userId: 'u-8', type: 'Framed Print', size: '16x24 inch black frame', qty: 1, price: 3999, status: 'Processing', createdAt: todayISO2() },
    ]);

    addUnique(K.enquiries, [
      { id: 'enq-1', name: 'Nikhil Bose', email: 'nikhil@example.com', phone: '9900111222', message: 'Do you offer outdoor sessions? Planning a garden birthday in November.', date: iso(addDays(-2)), status: 'New' },
      { id: 'enq-2', name: 'Meera Joshi', email: 'meera.j@example.com', phone: '9900222333', message: 'My daughter is 14 months — is she still in the ideal age window for a cake smash?', date: iso(addDays(-4)), status: 'New' },
      { id: 'enq-3', name: 'Sameer Gupta', email: 'sameer.g@example.com', phone: '9900333444', message: 'Can we book the Superhero theme plus an extra family portrait set on the same day?', date: iso(addDays(-6)), status: 'Resolved' },
      { id: 'enq-4', name: 'Lakshmi Iyer', email: 'lakshmi.i@example.com', phone: '9900444555', message: 'What is the difference between the Teddy Bear and Minimalist packages?', date: iso(addDays(-9)), status: 'Resolved' },
      { id: 'enq-5', name: 'Vikram Shetty', email: 'vikram.s@example.com', phone: '9900555666', message: 'Looking for a corporate-style bulk order of 15 album covers — do you handle that?', date: iso(addDays(-1)), status: 'New' },
    ]);

    /* Historical paid sessions so charts and revenue views have depth */
    const pastBookings = [];
    const pastPayments = [];
    const monthShift = (m, day) => {
      const d = new Date();
      d.setMonth(d.getMonth() - m);
      d.setDate(Math.min(day, 28));
      return iso(d);
    };
    const pastSpec = [
      [5, 'u-3', 'pkg-1', 'th-1', 7999, '12:00 PM', 'completed'],
      [5, 'u-5', 'pkg-4', 'th-4', 8499, '10:30 AM', 'completed'],
      [4, 'u-2', 'pkg-2', 'th-2', 7499, '02:30 PM', 'completed'],
      [4, 'u-7', 'pkg-6', 'th-6', 7499, '09:00 AM', 'completed'],
      [3, 'u-4', 'pkg-5', 'th-5', 6499, '11:00 AM', 'completed'],
      [3, 'u-8', 'pkg-3', 'th-3', 6999, '04:00 PM', 'completed'],
      [2, 'u-6', 'pkg-1', 'th-1', 7999, '10:30 AM', 'completed'],
      [2, 'u-3', 'pkg-10', 'th-10', 11999, '12:00 PM', 'completed'],
      [1, 'u-5', 'pkg-2', 'th-2', 7499, '05:30 PM', 'completed'],
      [1, 'u-2', 'pkg-4', 'th-4', 8499, '09:00 AM', 'completed'],
      [0, 'u-7', 'pkg-1', 'th-1', 7999, '11:00 AM', 'completed'],
      [0, 'u-4', 'pkg-6', 'th-6', 7499, '02:30 PM', 'confirmed'],
    ];
    pastSpec.forEach(([m, userId, packageId, themeId, price, time, status], i) => {
      const id = 'bk-p' + m + '-' + i;
      const date = monthShift(m, 6 + (i % 18));
      pastBookings.push({ id, userId, packageId, themeId, date, time, status, notes: '', createdAt: monthShift(m, 1 + (i % 18)) });
      const advance = Math.round(price * 0.5);
      if (status === 'completed') {
        pastPayments.push({ id: 'pay-p' + m + '-' + i + '-a', bookingId: id, userId, amount: advance, date: monthShift(m, 1 + (i % 18)), method: ['UPI', 'Card', 'Net Banking', 'Cash'][i % 4], status: 'Paid', txnId: 'CB' + (1700 + m * 40 + i * 5) + 'A' });
        pastPayments.push({ id: 'pay-p' + m + '-' + i + '-b', bookingId: id, userId, amount: price - advance, date, method: ['UPI', 'UPI', 'Card'][i % 3], status: 'Paid', txnId: 'CB' + (1700 + m * 40 + i * 5) + 'B' });
      } else {
        pastPayments.push({ id: 'pay-p' + m + '-' + i + '-a', bookingId: id, userId, amount: advance, date: monthShift(m, 1 + (i % 18)), method: 'UPI', status: 'Paid', txnId: 'CB' + (1700 + m * 40 + i * 5) + 'A' });
      }
    });
    addUnique(K.bookings, pastBookings);
    addUnique(K.payments, pastPayments);

    /* A couple of sessions on today's date so the daily schedule is populated */
    const todayD = new Date();
    const todayStr = iso(todayD);
    addUnique(K.bookings, [
      { id: 'bk-t-1', userId: 'u-3', packageId: 'pkg-4', themeId: 'th-4', date: todayStr, time: '10:30 AM', status: 'confirmed', notes: 'Rocket launch frame as the finale.', createdAt: iso(addDays(-6)) },
      { id: 'bk-t-2', userId: 'u-6', packageId: 'pkg-1', themeId: 'th-1', date: todayStr, time: '12:00 PM', status: 'confirmed', notes: '', createdAt: iso(addDays(-5)) },
      { id: 'bk-t-3', userId: 'u-8', packageId: 'pkg-7', themeId: 'th-7', date: todayStr, time: '02:30 PM', status: 'pending', notes: 'Advance received this morning.', createdAt: iso(addDays(-4)) },
    ]);
    const proofPhotos = [
      'assets/images/photos/gal-smash-1.jpg', 'assets/images/photos/gal-smash-2.jpg',
      'assets/images/photos/gal-smash-3.jpg', 'assets/images/photos/gal-smash-4.jpg',
      'assets/images/photos/gal-birthday-1.jpg', 'assets/images/photos/proof-2.jpg',
      'assets/images/photos/proof-4.jpg', 'assets/images/photos/featured-3-kids-cake.jpg',
    ];
    const captions = ['First look at the cake', 'The big splash', 'Curious fingers', 'Frosting everywhere',
      'Giggles with daddy', 'Cake champion', 'Blowing the candle', 'Messy mitts', 'Family frame', 'Nap-time close-up'];
    const done = extraBookings.filter(b => b.status === 'completed');
    const newProofs = [];
    done.forEach((b, bi) => {
      const count = 3 + (bi % 3);
      for (let i = 0; i < count; i++) {
        newProofs.push({
          id: 'pr-x-' + b.id + '-' + i,
          bookingId: b.id,
          image: proofPhotos[(bi * 2 + i) % proofPhotos.length],
          caption: captions[(bi * 3 + i) % captions.length],
          favorite: i === 1,
          selected: i < 2,
          edited: i === 2,
        });
      }
    });
    addUnique(K.proofs, newProofs);

    localStorage.setItem(upgradeFlag, '1');
  }
  window.cbUpgradeSeed = upgradeSeed;

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

  /* ---------------- Theme & direction toggles (shared across pages) ---------------- */
  /* Icon-only theme/direction buttons. Any markup using [data-panel-theme] or
     [data-panel-dir] gets wired, so panels injected later can opt in by calling
     cbBindPanelToggles() again. */
  window.cbBindPanelToggles = function (root) {
    const scope = root || document;
    const dark = document.documentElement.classList.contains('dark');
    const rtl = document.documentElement.getAttribute('dir') === 'rtl';

    scope.querySelectorAll('[data-panel-theme]').forEach(btn => {
      const iconEl = btn.querySelector('[data-theme-icon]');
      if (iconEl) iconEl.innerHTML = '<i data-lucide="' + (dark ? 'sun' : 'moon') + '" class="w-[18px] h-[18px]"></i>';
      btn.classList.toggle('on', dark);
      const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
      btn.title = label;
      btn.setAttribute('aria-label', label);
      btn.setAttribute('aria-pressed', String(dark));
      if (!btn.dataset.bound) {
        btn.dataset.bound = '1';
        btn.addEventListener('click', () => {
          const next = !document.documentElement.classList.contains('dark');
          cbApplyTheme(next ? 'dark' : 'light');
          cbBindPanelToggles();
          cbRefreshIcons();
          cbToast(next ? 'Dark mode on' : 'Light mode on', 'info');
        });
      }
    });

    scope.querySelectorAll('[data-panel-dir]').forEach(btn => {
      const iconEl = btn.querySelector('[data-dir-icon]');
      if (iconEl) iconEl.innerHTML = '<i data-lucide="arrow-left-right" class="w-[18px] h-[18px]"></i>';
      btn.classList.toggle('on', rtl);
      const label = rtl ? 'Switch to left-to-right (LTR)' : 'Switch to right-to-left (RTL)';
      btn.title = label;
      btn.setAttribute('aria-label', label);
      btn.setAttribute('aria-pressed', String(rtl));
      if (!btn.dataset.bound) {
        btn.dataset.bound = '1';
        btn.addEventListener('click', () => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          cbApplyDirection(isRtl ? 'ltr' : 'rtl');
          cbBindPanelToggles();
          cbRefreshIcons();
          cbToast(isRtl ? 'Direction: LTR' : 'Direction: RTL', 'info');
        });
      }
    });

    cbRefreshIcons();
  };

  document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-toggle');
    const syncThemeIcon = () => {
      if (!themeBtn) return;
      const dark = document.documentElement.classList.contains('dark');
      themeBtn.innerHTML = '<i data-lucide="' + (dark ? 'sun' : 'moon') + '" class="w-[18px] h-[18px]"></i>';
      themeBtn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    };
    if (themeBtn) {
      syncThemeIcon();
      themeBtn.addEventListener('click', () => {
        const dark = !document.documentElement.classList.contains('dark');
        cbApplyTheme(dark ? 'dark' : 'light');
        syncThemeIcon();
        cbBindPanelToggles();
        cbRefreshIcons();
        cbToast(dark ? 'Dark mode on' : 'Light mode on', 'info');
      });
    }

    const dirBtn = document.getElementById('dir-toggle');
    const syncDirIcon = () => {
      if (!dirBtn) return;
      const rtl = document.documentElement.getAttribute('dir') === 'rtl';
      dirBtn.innerHTML = '<i data-lucide="arrow-left-right" class="w-[18px] h-[18px]"></i>';
      const label = rtl ? 'Switch to left-to-right (LTR)' : 'Switch to right-to-left (RTL)';
      dirBtn.title = label;
      dirBtn.setAttribute('aria-label', label);
      dirBtn.setAttribute('aria-pressed', String(rtl));
    };
    if (dirBtn) {
      syncDirIcon();
      dirBtn.addEventListener('click', () => {
        const rtl = document.documentElement.getAttribute('dir') === 'rtl';
        cbApplyDirection(rtl ? 'ltr' : 'rtl');
        syncDirIcon();
        cbBindPanelToggles();
        cbRefreshIcons();
        cbToast(rtl ? 'Direction: LTR' : 'Direction: RTL', 'info');
      });
    }

    cbBindPanelToggles();
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

    upgradeSeed();
    document.addEventListener('DOMContentLoaded', () => {
      cbRefreshIcons();
      cbObserveReveals();
    });
})();
