/**
 * panel — mist inset panel. Variants: quote (big indigo quote + photo),
 * stat (oversized numeral + caption + photo), plain (eyebrow + heading + prose).
 * Authoring rows (flat): texts + optional picture; classification by content.
 */
const DIAMOND = '<svg viewBox="0 0 28 28" aria-hidden="true" class="pan-tick"><rect x="6" y="6" width="16" height="16" transform="rotate(45 14 14)" fill="#efac1f"/></svg>';

export default function decorate(block) {
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2, h3');
  const ps = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
  const card = document.createElement('div');
  card.className = 'panel-card';
  const copy = document.createElement('div');
  copy.className = 'panel-copy';
  if (block.classList.contains('stat')) {
    const num = ps.find((p) => /^\d+%?$/.test(p.textContent.trim())) || heading;
    if (num) { const n = document.createElement('p'); n.className = 'panel-num'; n.innerHTML = `${DIAMOND}${num.textContent.trim()}`; copy.append(n); if (num !== heading) num.remove(); }
    ps.filter((p) => p !== num).forEach((p) => { p.className = 'panel-cap'; copy.append(p); });
  } else if (block.classList.contains('quote')) {
    ps.forEach((p) => { p.className = 'panel-quote'; copy.append(p); });
  } else {
    if (heading) copy.append(heading);
    ps.forEach((p) => copy.append(p));
  }
  card.append(copy);
  if (media) { const m = document.createElement('div'); m.className = 'panel-media'; m.append(media); card.append(m); }
  block.replaceChildren(card);
}
