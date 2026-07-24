/**
 * next-event — on-air event band: featured event + upcoming event cards + contour.
 * Schema: stardust/eds-schema/index.json § next-event.
 * Authoring rows: (0) optional picture-only row = band background;
 * (1) featured: h2 + date <p> + body <p> + CTAs + picture;
 * (2..N) one row per city card: h3 + date <p> + CTAs + picture.
 * Per-ROW segmentation with per-row field classification (#48/#63).
 */
const CONTOUR = `<svg class="contour" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0 52 C 90 44, 150 50, 210 40 S 320 18, 380 30 460 12, 520 26 640 8, 700 22 810 14, 870 28 980 10, 1040 24 1160 16, 1220 30 1370 20, 1440 34" fill="none" stroke="#189ac6" stroke-width="1.4"/>
  <path d="M0 58 C 110 52, 180 56, 250 48 S 360 30, 430 40 520 24, 590 36 700 20, 770 32 880 26, 950 38 1060 22, 1130 34 1250 28, 1320 40 1400 32, 1440 42" fill="none" stroke="#189ac6" stroke-width="1.1" opacity="0.55"/>
</svg>`;

function fields(row) {
  const heading = row.querySelector('h2, h3');
  const media = row.querySelector('picture, img');
  const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const date = ps.find((p) => !p.querySelector('a') && /\d/.test(p.textContent) && p.textContent.length < 60);
  const body = ps.find((p) => !p.querySelector('a') && p !== date);
  const ctas = ps.filter((p) => p.querySelector('a'));
  return { heading, media, date, body, ctas };
}

export default function decorate(block) {
  const rows = [...block.children];
  let bg = null;
  const groups = [];
  const bandCtas = [];
  rows.forEach((row) => {
    const f = fields(row);
    if (!f.heading && f.media && !f.date && !f.ctas.length) { bg = f.media; return; }
    if (!f.heading && f.ctas.length) { bandCtas.push(...f.ctas); return; }
    if (f.heading) groups.push(f);
  });
  const featured = groups.find((g) => g.heading.tagName === 'H2') || groups[0];
  const cards = groups.filter((g) => g !== featured);

  const wrap = document.createElement('div');
  wrap.className = 'ne-wrap';

  if (bg) {
    const bgWrap = document.createElement('div');
    bgWrap.className = 'ne-bg';
    bgWrap.setAttribute('aria-hidden', 'true');
    bgWrap.append(bg);
    block.replaceChildren(bgWrap);
  } else {
    block.replaceChildren();
  }
  const scrim = document.createElement('div');
  scrim.className = 'ne-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  block.append(scrim);

  if (featured) {
    const feat = document.createElement('div');
    feat.className = 'ne-featured';
    const photo = document.createElement('div');
    photo.className = 'ne-photo';
    if (featured.media) photo.append(featured.media);
    const copy = document.createElement('div');
    const chip = document.createElement('p');
    chip.innerHTML = '<span class="chip">Next Event</span>';
    copy.append(chip);
    copy.append(featured.heading);
    if (featured.date) { const d = featured.date.textContent.trim(); featured.date.innerHTML = ''; featured.date.insertAdjacentHTML('beforeend', `<span class="chip chip--date">${d}</span>`); copy.append(featured.date); }
    if (featured.body) copy.append(featured.body);
    if (featured.ctas.length) { const a = document.createElement('div'); a.className = 'ne-actions'; a.append(...featured.ctas); copy.append(a); }
    feat.append(photo, copy);
    wrap.append(feat);
  }

  if (cards.length) {
    const grid = document.createElement('div');
    grid.className = 'ne-cards';
    cards.forEach((c) => {
      const card = document.createElement('article');
      card.className = 'ne-card';
      if (c.media) { const m = document.createElement('div'); m.className = 'ne-card-media'; m.append(c.media); card.append(m); }
      const body = document.createElement('div');
      body.className = 'ne-card-body';
      body.append(c.heading);
      if (c.date) { const d = c.date.textContent.trim(); c.date.innerHTML = ''; c.date.insertAdjacentHTML('beforeend', `<span class="chip chip--date">${d}</span>`); body.append(c.date); }
      if (c.ctas.length) { const a = document.createElement('div'); a.className = 'ne-actions'; a.append(...c.ctas); body.append(a); }
      card.append(body);
      grid.append(card);
    });
    wrap.append(grid);
  }

  if (bandCtas.length) {
    const more = document.createElement('p');
    more.className = 'ne-more';
    bandCtas.forEach((c) => more.append(...c.childNodes));
    wrap.append(more);
  }
  block.append(wrap);
  block.insertAdjacentHTML('beforeend', CONTOUR);
}
