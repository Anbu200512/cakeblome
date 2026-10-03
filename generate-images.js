const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, 'assets', 'images');
fs.mkdirSync(out, { recursive: true });

// seeded random
function rng(seed) { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

const PALETTES = {
  pink:     ['#FDF2F8', '#FCE7F3', '#F9A8D4', '#F472B6', '#DB2777'],
  lavender: ['#F5F3FF', '#EDE9FE', '#C4B5FD', '#A78BFA', '#7C3AED'],
  sky:      ['#F0F9FF', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#0EA5E9'],
  yellow:   ['#FEFCE8', '#FEF9C3', '#FEF08A', '#FDE047', '#EAB308'],
  mint:     ['#ECFDF5', '#D1FAE5', '#A7F3D0', '#6EE7B7', '#10B981'],
  peach:    ['#FFF7ED', '#FFEDD5', '#FED7AA', '#FDBA74', '#F97316'],
  cream:    ['#FFFBEB', '#FEF3C7', '#FDE68A', '#FCD34D', '#B45309'],
  rose:     ['#FFF1F2', '#FFE4E6', '#FECDD3', '#FDA4AF', '#E11D48'],
};

function bokeh(rand, c1, c2, n = 10) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = rand() * 800, y = rand() * 600, r = 8 + rand() * 30;
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${rand() > .5 ? c1 : c2}" opacity="${0.12 + rand() * 0.2}"/>`;
  }
  return s;
}
function bunting(rand, colors, y = 40) {
  let s = `<path d="M0 ${y} Q 400 ${y + 70} 800 ${y}" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.8"/>`;
  for (let i = 0; i <= 10; i++) {
    const t = i / 10, x = 800 * t;
    const yy = y + (1 - Math.pow(2 * t - 1, 2)) * 52;
    const c = colors[i % colors.length];
    s += `<path d="M${x - 14} ${yy} L${x + 14} ${yy} L${x} ${yy + 30} Z" fill="${c}"/>`;
  }
  return s;
}
function stars(rand, color, n = 8) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = 40 + rand() * 720, y = 30 + rand() * 200, r = 5 + rand() * 9;
    s += `<path d="M${x} ${y - r} L${x + r * .3} ${y - r * .3} L${x + r} ${y} L${x + r * .3} ${y + r * .3} L${x} ${y + r} L${x - r * .3} ${y + r * .3} L${x - r} ${y} L${x - r * .3} ${y - r * .3} Z" fill="${color}" opacity="${0.5 + rand() * 0.5}"/>`;
  }
  return s;
}
function balloons(rand, colors, x, y, n = 4) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const bx = x + (i - (n - 1) / 2) * 55 + rand() * 12, by = y + rand() * 20;
    const c = colors[i % colors.length];
    s += `<line x1="${bx}" y1="${by + 34}" x2="${bx + 8}" y2="${by + 110}" stroke="#00000022" stroke-width="2"/>
    <ellipse cx="${bx}" cy="${by}" rx="26" ry="32" fill="${c}"/>
    <ellipse cx="${bx - 8}" cy="${by - 10}" rx="7" ry="10" fill="#ffffff" opacity="0.45"/>
    <path d="M${bx - 5} ${by + 32} L${bx + 5} ${by + 32} L${bx} ${by + 42} Z" fill="${c}"/>`;
  }
  return s;
}
function cake(rand, x, y, c1, c2, c3) {
  // cake with drip frosting on a table
  return `
  <ellipse cx="${x}" cy="${y + 118}" rx="150" ry="16" fill="#00000018"/>
  <rect x="${x - 130}" y="${y + 60}" width="260" height="58" rx="10" fill="${c1}"/>
  <rect x="${x - 130}" y="${y + 60}" width="260" height="16" rx="8" fill="#ffffff" opacity="0.5"/>
  <path d="M${x - 130} ${y + 76} q 12 26 24 0 q 12 26 24 0 q 12 26 24 0 q 12 26 24 0 q 12 26 24 0 q 12 26 24 0 q 12 26 24 0 q 12 26 24 0 q 12 26 24 0 q 12 26 24 0 q 12 26 24 0 q 12 26 24 0 L${x + 130} ${y + 76} L${x + 130} ${y + 60} L${x - 130} ${y + 60} Z" fill="${c2}"/>
  <rect x="${x - 100}" y="${y + 6}" width="200" height="58" rx="10" fill="${c3}"/>
  <rect x="${x - 100}" y="${y + 6}" width="200" height="14" rx="7" fill="#ffffff" opacity="0.55"/>
  <path d="M${x - 100} ${y + 20} q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 L${x + 100} ${y + 20} L${x + 100} ${y + 6} L${x - 100} ${y + 6} Z" fill="${c2}"/>
  <rect x="${x - 66}" y="${y - 34}" width="132" height="42" rx="9" fill="${c1}"/>
  <rect x="${x - 66}" y="${y - 34}" width="132" height="12" rx="6" fill="#ffffff" opacity="0.5"/>
  <line x1="${x}" y1="${y - 34}" x2="${x}" y2="${y - 58}" stroke="#B45309" stroke-width="4"/>
  <ellipse cx="${x}" cy="${y - 62}" rx="7" ry="10" fill="#F472B6"/>
  <circle cx="${x}" cy="${y - 66}" r="4" fill="#FDE047"/>`;
}
function sprinkles(rand, colors, n = 26) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = 120 + rand() * 560, y = 380 + rand() * 160, c = colors[Math.floor(rand() * colors.length)];
    s += `<rect x="${x}" y="${y}" width="10" height="3.5" rx="1.75" fill="${c}" transform="rotate(${rand() * 180} ${x} ${y})"/>`;
  }
  return s;
}
function splash(rand, x, y, color) {
  let s = `<circle cx="${x}" cy="${y}" r="26" fill="${color}"/>`;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, d = 34 + rand() * 22;
    s += `<circle cx="${x + Math.cos(a) * d}" cy="${y + Math.sin(a) * d}" r="${5 + rand() * 7}" fill="${color}"/>`;
  }
  return s;
}
function arch(rand, x, y, w, h, c1, c2) {
  return `<path d="M${x - w / 2} ${y + h} L${x - w / 2} ${y + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${y + w / 2} L${x + w / 2} ${y + h} Z" fill="${c1}"/>
  <path d="M${x - w / 2 + 18} ${y + h} L${x - w / 2 + 18} ${y + w / 2} A ${w / 2 - 18} ${w / 2 - 18} 0 0 1 ${x + w / 2 - 18} ${y + w / 2} L${x + w / 2 - 18} ${y + h} Z" fill="${c2}"/>`;
}
function figure(rand, x, y, s, c, hair) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <circle cx="0" cy="-52" r="26" fill="#FBD9B8"/>
  <path d="M-26 -52 a26 26 0 0 1 52 0 l0 -8 a26 20 0 0 0 -52 0 Z" fill="${hair}"/>
  <circle cx="-9" cy="-54" r="3" fill="#3B3654"/><circle cx="9" cy="-54" r="3" fill="#3B3654"/>
  <path d="M-7 -42 q7 7 14 0" stroke="#3B3654" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M-30 30 q0 -58 30 -58 q30 0 30 58 Z" fill="${c}"/>
  <circle cx="-34" cy="6" r="10" fill="#FBD9B8"/><circle cx="34" cy="6" r="10" fill="#FBD9B8"/>
  </g>`;
}
function cameraIcon(x, y, s, c) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}">
  <rect x="-46" y="-26" width="92" height="60" rx="12"/>
  <circle cx="0" cy="4" r="17" fill="#fff" opacity="0.85"/><circle cx="0" cy="4" r="9" fill="${c}"/>
  <rect x="-20" y="-38" width="34" height="14" rx="5"/>
  <circle cx="28" cy="-14" r="5" fill="#fff" opacity="0.85"/></g>`;
}
function softbox(x, y, s, c) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <line x1="0" y1="0" x2="0" y2="120" stroke="#3B3654" stroke-width="6"/>
  <path d="M-34 0 L34 0 L22 -58 L-22 -58 Z" fill="${c}"/>
  <path d="M-22 -58 L22 -58 L14 -70 L-14 -70 Z" fill="#3B3654"/>
  <ellipse cx="0" cy="122" rx="34" ry="7" fill="#00000022"/></g>`;
}
function label(text, sub) {
  return `<g>
  <rect x="24" y="528" width="${Math.max(180, text.length * 13 + (sub ? 60 : 30))}" height="52" rx="26" fill="#ffffff" opacity="0.92"/>
  <text x="44" y="560" font-family="Poppins, Arial" font-size="22" font-weight="700" fill="#3B3654">${text}</text>
  ${sub ? `<text x="44" y="576" font-family="Arial" font-size="12" fill="#8B86A3">${sub}</text>` : ''}
  </g>`;
}
function svgWrap(inner, p, seed = 7) {
  const rand = rng(seed * 97 + 13);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient>
  <linearGradient id="f" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[2]}"/></linearGradient></defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <rect y="470" width="800" height="130" fill="url(#f)" opacity="0.55"/>
  ${bokeh(rand, p[2], '#ffffff')}
  ${inner}</svg>`;
}

const scenes = {
  smash: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`${bunting(rand, [p[2], p[3], '#FDE047', '#A7F3D0'])}
    ${cake(rand, 400, 300, p[2], p[3], p[4])}
    ${splash(rand, 210, 420, p[3])}${splash(rand, 590, 430, p[2])}
    ${sprinkles(rand, [p[3], p[4], '#FDE047', '#ffffff'])}
    ${balloons(rand, [p[2], p[3], '#FDE047'], 120, 120, 3)}
    ${label(labelText, sub)}`, p, seed);
  },
  birthday: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`${bunting(rand, [p[2], '#FDE047', p[3], '#A7F3D0'])}
    ${arch(rand, 400, 480, 300, 300, p[2], p[1])}
    ${figure(rand, 400, 400, 1.15, p[3], p[4])}
    ${cake(rand, 560, 430, p[2], p[3], p[4])}
    ${stars(rand, p[4])}
    ${label(labelText, sub)}`, p, seed);
  },
  portrait: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`${arch(rand, 400, 490, 340, 340, p[2], p[1])}
    ${figure(rand, 400, 420, 1.35, p[3], p[4])}
    ${bokeh(rand, '#ffffff', p[3], 14)}
    ${label(labelText, sub)}`, p, seed);
  },
  family: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`${arch(rand, 400, 490, 420, 300, p[2], p[1])}
    ${figure(rand, 280, 430, 1.25, p[3], p[4])}
    ${figure(rand, 420, 440, 1.1, p[4], '#3B3654')}
    ${figure(rand, 540, 450, 0.8, '#FDE047', p[4])}
    ${label(labelText, sub)}`, p, seed);
  },
  theme: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`${bunting(rand, [p[2], p[3], '#FDE047'])}
    ${arch(rand, 400, 480, 320, 320, p[2], p[1])}
    ${stars(rand, p[4], 10)}
    ${balloons(rand, [p[2], p[3], '#FDE047'], 620, 140, 3)}
    ${cake(rand, 250, 440, p[2], p[3], p[4])}
    ${label(labelText, sub)}`, p, seed);
  },
  bts: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`${softbox(rand, 180, 180, 1.1, p[2])}
    ${cameraIcon(520, 300, 1.6, p[4])}
    <circle cx="520" cy="300" r="120" fill="none" stroke="${p[3]}" stroke-width="3" stroke-dasharray="8 10" opacity="0.6"/>
    ${arch(rand, 400, 500, 260, 240, p[2], p[1])}
    ${label(labelText, sub)}`, p, seed);
  },
  studio: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`${softbox(rand, 170, 170, 1.15, p[2])}
    ${softbox(rand, 640, 180, 0.9, p[3])}
    ${arch(rand, 400, 500, 300, 280, p[2], p[1])}
    <rect x="330" y="470" width="140" height="14" rx="7" fill="${p[4]}" opacity="0.5"/>
    ${label(labelText, sub)}`, p, seed);
  },
  props: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`
    <g transform="translate(220 260)"><circle r="52" fill="${p[2]}"/><circle r="34" fill="${p[1]}"/><rect x="-70" y="40" width="140" height="18" rx="9" fill="${p[3]}"/></g>
    <g transform="translate(430 240)"><rect x="-58" y="-34" width="116" height="80" rx="14" fill="none" stroke="${p[4]}" stroke-width="10"/><rect x="-30" y="-60" width="60" height="30" rx="8" fill="${p[3]}"/></g>
    <g transform="translate(590 330) rotate(18)"><path d="M0 -44 L12 -12 L46 -12 L18 10 L28 42 L0 22 L-28 42 L-18 10 L-46 -12 L-12 -12 Z" fill="#FDE047"/></g>
    <g transform="translate(300 420)"><path d="M-40 0 Q0 -46 40 0 L34 26 Q0 12 -34 26 Z" fill="${p[3]}"/><rect x="-6" y="24" width="12" height="34" rx="6" fill="${p[4]}"/></g>
    <g transform="translate(520 450) rotate(-14)"><rect x="-46" y="-20" width="92" height="40" rx="20" fill="${p[2]}"/><circle cx="-22" cy="0" r="12" fill="${p[1]}"/><circle cx="22" cy="0" r="12" fill="${p[1]}"/><rect x="-6" y="-6" width="12" height="12" fill="${p[1]}"/></g>
    ${label(labelText, sub)}`, p, seed);
  },
  waiting: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`
    <g transform="translate(400 380)"><rect x="-150" y="-60" width="300" height="90" rx="26" fill="${p[2]}"/><rect x="-150" y="-96" width="300" height="50" rx="24" fill="${p[3]}"/><rect x="-166" y="-40" width="34" height="110" rx="16" fill="${p[3]}"/><rect x="132" y="-40" width="34" height="110" rx="16" fill="${p[3]}"/><rect x="-120" y="-30" width="100" height="34" rx="14" fill="#ffffff" opacity="0.6"/><rect x="20" y="-30" width="100" height="34" rx="14" fill="#ffffff" opacity="0.6"/></g>
    <g transform="translate(640 420)"><path d="M0 0 q-6 -70 -34 -96 q40 6 48 62 q10 -40 40 -52 q-4 44 -26 66 q30 -6 44 6 q-30 26 -72 14 Z" fill="${p[4]}"/><path d="M-6 0 h12 l-4 60 h-4 Z" fill="${p[3]}"/></g>
    ${label(labelText, sub)}`, p, seed);
  },
  changing: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`
    <rect x="180" y="90" width="440" height="400" rx="20" fill="${p[1]}"/>
    <path d="M180 130 h440 v360 h-440 Z" fill="none" stroke="${p[2]}" stroke-width="10"/>
    <path d="M400 90 v400" stroke="${p[2]}" stroke-width="8"/>
    <path d="M210 130 q30 120 0 240 M270 130 q-24 120 0 240 M560 130 q24 120 0 240 M620 130 q-30 120 0 240" stroke="${p[3]}" stroke-width="6" fill="none" opacity="0.7"/>
    <g transform="translate(400 300)"><ellipse rx="52" ry="66" fill="#E0F2FE" stroke="${p[4]}" stroke-width="8"/><path d="M-20 -10 l30 30 M-5 5 l22 22" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/></g>
    ${label(labelText, sub)}`, p, seed);
  },
  lighting: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`
    ${softbox(rand, 200, 160, 1.3, p[2])}
    ${softbox(rand, 620, 170, 1, p[3])}
    <path d="M230 190 L380 420 L420 420 L290 160 Z" fill="#FDE047" opacity="0.35"/>
    <path d="M600 200 L460 420 L500 420 L640 180 Z" fill="#FDE047" opacity="0.3"/>
    ${arch(rand, 400, 500, 240, 220, p[2], p[1])}
    ${label(labelText, sub)}`, p, seed);
  },
  safety: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`
    <g transform="translate(400 280)"><path d="M0 -110 L95 -75 V10 Q95 95 0 130 Q-95 95 -95 10 V-75 Z" fill="${p[2]}"/><path d="M0 -88 L73 -60 V8 Q73 74 0 102 Q-73 74 -73 8 V-60 Z" fill="${p[1]}"/><path d="M-38 6 l26 26 l-12 12 l-38 -38 l12 -12 l12 12 l26 -26 Z" fill="${p[4]}" transform="translate(14 18) scale(0.9)"/></g>
    ${stars(rand, p[3], 10)}
    ${label(labelText, sub)}`, p, seed);
  },
  entrance: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`
    <rect x="140" y="120" width="520" height="380" rx="24" fill="${p[1]}"/>
    <rect x="180" y="160" width="440" height="300" rx="16" fill="${p[2]}"/>
    <rect x="330" y="240" width="140" height="220" rx="10" fill="${p[3]}"/>
    <circle cx="440" cy="350" r="6" fill="#FDE047"/>
    <g transform="translate(400 210)"><rect x="-90" y="-30" width="180" height="60" rx="30" fill="#ffffff" opacity="0.9"/><text x="0" y="8" text-anchor="middle" font-family="Poppins, Arial" font-size="24" font-weight="700" fill="${p[4]}">CakeBloom</text></g>
    ${balloons(rand, [p[3], p[4], '#FDE047'], 180, 180, 3)}
    ${balloons(rand, [p[3], p[4], '#FDE047'], 620, 180, 3)}
    ${label(labelText, sub)}`, p, seed);
  },
  backdrops: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`
    <rect x="120" y="110" width="560" height="360" rx="18" fill="${p[2]}"/>
    <rect x="120" y="110" width="560" height="360" rx="18" fill="none" stroke="${p[3]}" stroke-width="8"/>
    <path d="M120 470 h560" stroke="${p[4]}" stroke-width="10" stroke-linecap="round"/>
    ${arch(rand, 400, 470, 260, 240, p[3], p[1])}
    ${stars(rand, p[4], 8)}
    ${label(labelText, sub)}`, p, seed);
  },
  prints: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`
    <g transform="translate(330 320) rotate(-8)"><rect x="-110" y="-140" width="220" height="280" rx="8" fill="#fff"/><rect x="-92" y="-122" width="184" height="200" fill="${p[2]}"/><circle cx="-30" cy="-60" r="26" fill="${p[3]}"/><path d="M-92 78 L-20 0 L40 60 L92 -20 L92 78 Z" fill="${p[4]}"/></g>
    <g transform="translate(470 330) rotate(6)"><rect x="-110" y="-140" width="220" height="280" rx="8" fill="#fff"/><rect x="-92" y="-122" width="184" height="200" fill="${p[1]}"/><circle cx="20" cy="-50" r="30" fill="${p[3]}"/><path d="M-92 78 L-30 10 L30 50 L92 -30 L92 78 Z" fill="${p[2]}"/></g>
    ${label(labelText, sub)}`, p, seed);
  },
  album: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`
    <g transform="translate(400 330)"><path d="M0 0 L-160 -20 V140 L0 160 Z" fill="${p[3]}"/><path d="M0 0 L160 -20 V140 L0 160 Z" fill="${p[2]}"/><rect x="-146" y="-6" width="132" height="130" rx="6" fill="#fff"/><rect x="14" y="-6" width="132" height="130" rx="6" fill="#fff"/><rect x="-134" y="6" width="108" height="106" fill="${p[1]}"/><rect x="26" y="6" width="108" height="106" fill="${p[4]}"/></g>
    ${label(labelText, sub)}`, p, seed);
  },
  canvas: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`
    <rect x="200" y="120" width="400" height="300" rx="10" fill="${p[2]}" stroke="${p[4]}" stroke-width="12"/>
    <rect x="224" y="144" width="352" height="252" fill="${p[1]}"/>
    <circle cx="320" cy="230" r="40" fill="${p[3]}"/>
    <path d="M224 396 L330 280 L420 360 L480 300 L576 380 L576 396 Z" fill="${p[4]}"/>
    <path d="M180 120 h440" stroke="${p[3]}" stroke-width="6" stroke-linecap="round"/>
    ${label(labelText, sub)}`, p, seed);
  },
  digital: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`
    <g transform="translate(400 260)"><path d="M-110 40 a60 60 0 0 1 20 -115 a75 75 0 0 1 145 -20 a62 62 0 0 1 95 55 a55 55 0 0 1 -30 110 h-210 a55 55 0 0 1 -20 -30 Z" fill="${p[2]}"/><path d="M-20 30 l0 55 M-48 58 l28 30 l28 -30" stroke="${p[4]}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
    ${stars(rand, p[3], 8)}
    ${label(labelText, sub)}`, p, seed);
  },
  balloons: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`${balloons(rand, [p[2], p[3], p[4], '#FDE047'], 250, 200, 5)}
    ${balloons(rand, [p[3], p[2], '#A7F3D0'], 560, 240, 4)}
    ${bunting(rand, [p[2], p[3], '#FDE047'])}
    ${label(labelText, sub)}`, p, seed);
  },
  hero: (p, seed, labelText, sub) => {
    const rand = rng(seed);
    return svgWrap(`${bunting(rand, [p[2], p[3], '#FDE047', '#A7F3D0', '#ffffff'])}
    ${cake(rand, 400, 290, p[2], p[3], p[4])}
    ${splash(rand, 180, 430, p[3])}${splash(rand, 620, 440, p[2])}${splash(rand, 400, 480, p[4])}
    ${sprinkles(rand, [p[3], p[4], '#FDE047', '#ffffff', '#A7F3D0'], 34)}
    ${balloons(rand, [p[2], p[3], '#FDE047'], 110, 130, 3)}
    ${balloons(rand, [p[3], p[2], '#A7F3D0'], 690, 140, 3)}
    ${stars(rand, '#ffffff', 6)}
    ${label(labelText, sub)}`, p, seed);
  },
};

const jobs = [
  // Home 1
  ['hero-main.svg', 'hero', PALETTES.pink, 11, 'Cake Smash Session', '1st birthday photography'],
  ['home-featured-1.svg', 'smash', PALETTES.pink, 21, 'Strawberry Smash', 'Cake smash'],
  ['home-featured-2.svg', 'smash', PALETTES.lavender, 22, 'Lavender Dreams', 'Cake smash'],
  ['home-featured-3.svg', 'smash', PALETTES.sky, 23, 'Berry Blue', 'Cake smash'],
  ['home-featured-4.svg', 'smash', PALETTES.mint, 24, 'Minty Fresh', 'Cake smash'],
  ['theme-princess.svg', 'theme', PALETTES.pink, 31, 'Princess Theme', 'Popular themes'],
  ['theme-superhero.svg', 'theme', PALETTES.sky, 32, 'Superhero Theme', 'Popular themes'],
  ['theme-jungle.svg', 'theme', PALETTES.mint, 33, 'Jungle Theme', 'Popular themes'],
  ['theme-space.svg', 'theme', PALETTES.lavender, 34, 'Space Theme', 'Popular themes'],
  ['home-studio.svg', 'studio', PALETTES.cream, 35, 'Our Studio', 'Studio highlight'],
  
  // Packages
  ['pkg-princess.svg', 'theme', PALETTES.pink, 51, 'Princess Package', 'Cake smash'],
  ['pkg-superhero.svg', 'theme', PALETTES.sky, 52, 'Superhero Package', 'Cake smash'],
  ['pkg-jungle.svg', 'theme', PALETTES.mint, 53, 'Jungle Package', 'Cake smash'],
  ['pkg-space.svg', 'theme', PALETTES.lavender, 54, 'Space Package', 'Cake smash'],
  ['pkg-rainbow.svg', 'theme', PALETTES.rose, 55, 'Rainbow Package', 'Cake smash'],
  ['pkg-dinosaur.svg', 'theme', PALETTES.peach, 56, 'Dinosaur Package', 'Cake smash'],
  ['pkg-teddy.svg', 'theme', PALETTES.cream, 57, 'Teddy Bear Package', 'Cake smash'],
  ['pkg-floral.svg', 'theme', PALETTES.rose, 58, 'Floral Package', 'Cake smash'],
  ['pkg-minimalist.svg', 'theme', PALETTES.cream, 59, 'Minimalist Package', 'Cake smash'],
  ['pkg-custom.svg', 'theme', PALETTES.lavender, 60, 'Custom Package', 'Cake smash'],
  // Studio tour
  ['studio-entrance.svg', 'entrance', PALETTES.pink, 61, 'Studio Entrance', 'Studio tour'],
  ['studio-smash-area.svg', 'smash', PALETTES.yellow, 62, 'Cake Smash Area', 'Studio tour'],
  ['studio-backdrops.svg', 'backdrops', PALETTES.lavender, 63, 'Themed Backdrops', 'Studio tour'],
  ['studio-props.svg', 'props', PALETTES.mint, 64, 'Props Collection', 'Studio tour'],
  ['studio-waiting.svg', 'waiting', PALETTES.peach, 65, 'Parent Waiting Area', 'Studio tour'],
  ['studio-changing.svg', 'changing', PALETTES.sky, 66, 'Changing Area', 'Studio tour'],
  ['studio-lighting.svg', 'lighting', PALETTES.cream, 67, 'Lighting Setup', 'Studio tour'],
  ['studio-safety.svg', 'safety', PALETTES.mint, 68, 'Safety & Cleanliness', 'Studio tour'],
  // Gallery
  ['gal-smash-1.svg', 'smash', PALETTES.pink, 71, 'Pink Perfection', 'Cake Smash'],
  ['gal-smash-2.svg', 'smash', PALETTES.sky, 72, 'Blueberry Bash', 'Cake Smash'],
  ['gal-smash-3.svg', 'smash', PALETTES.lavender, 73, 'Purple Haze', 'Cake Smash'],
  ['gal-smash-4.svg', 'smash', PALETTES.mint, 74, 'Mint Condition', 'Cake Smash'],
  ['gal-birthday-1.svg', 'birthday', PALETTES.yellow, 75, 'One & Fun', 'First Birthday'],
  ['gal-birthday-2.svg', 'birthday', PALETTES.rose, 76, 'Candle Blower', 'First Birthday'],
  ['gal-birthday-3.svg', 'birthday', PALETTES.peach, 77, 'Tiny Celebrator', 'First Birthday'],
  ['gal-portrait-1.svg', 'portrait', PALETTES.cream, 78, 'Sleepy Angel', 'Baby Portraits'],
  ['gal-portrait-2.svg', 'portrait', PALETTES.pink, 79, 'Rosy Cheeks', 'Baby Portraits'],
  ['gal-portrait-3.svg', 'portrait', PALETTES.sky, 80, 'Dreamy Eyes', 'Baby Portraits'],
  ['gal-family-1.svg', 'family', PALETTES.mint, 81, 'Together', 'Family'],
  ['gal-family-2.svg', 'family', PALETTES.yellow, 82, 'Four of Us', 'Family'],
  ['gal-family-3.svg', 'family', PALETTES.lavender, 83, 'New Arrival', 'Family'],
  ['gal-theme-1.svg', 'theme', PALETTES.peach, 84, 'Dino Roar', 'Theme Sessions'],
  ['gal-theme-2.svg', 'theme', PALETTES.sky, 85, 'Blast Off', 'Theme Sessions'],
  ['gal-theme-3.svg', 'theme', PALETTES.rose, 86, 'Enchanted', 'Theme Sessions'],
  ['gal-bts-1.svg', 'bts', PALETTES.lavender, 87, 'Setting Up', 'Behind the Scenes'],
  ['gal-bts-2.svg', 'bts', PALETTES.cream, 88, 'Test Shots', 'Behind the Scenes'],
  ['gal-bts-3.svg', 'bts', PALETTES.pink, 89, 'Prop Styling', 'Behind the Scenes'],
  // Dashboard proofs
  ['proof-1.svg', 'portrait', PALETTES.pink, 91, 'Proof 1', 'Proof gallery'],
  ['proof-2.svg', 'smash', PALETTES.sky, 92, 'Proof 2', 'Proof gallery'],
  ['proof-3.svg', 'portrait', PALETTES.lavender, 93, 'Proof 3', 'Proof gallery'],
  ['proof-4.svg', 'smash', PALETTES.mint, 94, 'Proof 4', 'Proof gallery'],
  ['proof-5.svg', 'portrait', PALETTES.peach, 95, 'Proof 5', 'Proof gallery'],
  ['proof-6.svg', 'smash', PALETTES.rose, 96, 'Proof 6', 'Proof gallery'],
  // Print products
  ['print-standard.svg', 'prints', PALETTES.sky, 101, 'Standard Prints', 'Print orders'],
  ['print-enlargement.svg', 'canvas', PALETTES.lavender, 102, 'Enlargements', 'Print orders'],
  ['print-album.svg', 'album', PALETTES.pink, 103, 'Photo Albums', 'Print orders'],
  ['print-canvas.svg', 'canvas', PALETTES.cream, 104, 'Canvas Prints', 'Print orders'],
  ['print-digital.svg', 'digital', PALETTES.mint, 105, 'Digital Package', 'Print orders'],
];

for (const [file, scene, palette, seed, text, sub] of jobs) {
  fs.writeFileSync(path.join(out, file), scenes[scene](palette, seed, text, sub));
}
console.log(`Generated ${jobs.length} images in ${out}`);
