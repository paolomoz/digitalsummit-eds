/**
 * brands — typographic brand line with confetti-diamond separators.
 * Schema: stardust/eds-schema/index.json § attendee-brands.
 * Authoring: one cell holding a <ul>, one <li> per brand name.
 */
const DIAMOND = '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill="#efac1f"/></svg>';

export default function decorate(block) {
  const items = [...block.querySelectorAll('li')].map((li) => li.textContent.trim()).filter(Boolean);
  const source = items.length ? items
    : [...block.querySelectorAll(':scope > div > div')].flatMap((c) => c.textContent.split('\u00b7')).map((t) => t.trim()).filter(Boolean);
  const line = document.createElement('p');
  line.className = 'brand-names';
  source.forEach((name, i) => {
    const span = document.createElement('span');
    span.textContent = name;
    line.append(span);
    if (i < source.length - 1) line.insertAdjacentHTML('beforeend', DIAMOND);
  });
  block.replaceChildren(line);
}
