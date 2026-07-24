/**
 * hero — Digital Summit home hero (template-slotted, stardust canon).
 * Schema: stardust/eds-schema/index.json § hero.
 * Authoring (one cell, flat): eyebrow <p>, <h1>, lede <p>, CTA <p><strong><a>,
 * <picture> (right-bleed photo). Decode is query-based (#42), never row-indexed.
 */
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
        && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        if (n.textContent.trim()) { const p = document.createElement('p'); p.textContent = n.textContent.trim(); return p; }
        return null;
      }).filter(Boolean);
    }
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) { const p = document.createElement('p'); p.textContent = cell.textContent.trim(); out.push(p); }
  });
  return out.length ? out : [...block.children];
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  const headingSrc = nodes.find((n) => n.matches('h1, h2') || n.querySelector('h1, h2'));
  const heading = headingSrc && (headingSrc.matches('h1, h2') ? headingSrc : headingSrc.querySelector('h1, h2'));
  const media = nodes.map((n) => (n.matches('picture, img') ? n : n.querySelector('picture, img'))).find(Boolean);
  const texts = nodes.filter((n) => n.tagName === 'P' && !n.querySelector('a, picture, img') && n.textContent.trim());
  const ctaP = nodes.find((n) => n.querySelector && n.querySelector('a'));
  const hIdx = nodes.indexOf(headingSrc);
  const eyebrow = texts.find((t) => nodes.indexOf(t) < hIdx);
  const lede = texts.find((t) => nodes.indexOf(t) > hIdx);

  const copy = document.createElement('div');
  copy.className = 'hero-copy';
  if (eyebrow) {
    const e = document.createElement('p');
    e.className = 'hero-eyebrow';
    e.innerHTML = '<svg viewBox="0 0 12 12" aria-hidden="true" class="tick"><rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill="#efac1f"/></svg>';
    e.append(eyebrow.textContent.trim());
    copy.append(e);
  }
  if (heading) {
    const h1 = document.createElement('h1');
    h1.append(...heading.childNodes);
    copy.append(h1);
  }
  if (lede) { lede.className = 'hero-lede'; copy.append(lede); }
  if (ctaP) { const actions = document.createElement('div'); actions.className = 'hero-actions'; actions.append(ctaP); copy.append(actions); }

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'hero-media';
  if (media) {
    const img = media.matches('img') ? media : media.querySelector('img');
    if (img) { img.setAttribute('loading', 'eager'); img.setAttribute('fetchpriority', 'high'); }
    mediaWrap.append(media);
  }

  const grid = document.createElement('div');
  grid.className = 'hero-grid';
  grid.append(copy, mediaWrap);
  block.replaceChildren(grid);
}
