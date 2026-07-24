/**
 * themes — programming-theme labels with confetti geometry markers.
 * Schema: stardust/eds-schema/index.json § programming-themes.
 * Authoring: one cell holding a <ul>, one <li> per theme label.
 */
const GLYPHS = [
  '<path d="M0 28 A28 28 0 0 1 28 0 L28 28 Z" fill="#189ac6"/>',
  '<path d="M2 26 L26 26 L2 2 Z" fill="#ec008c"/>',
  '<rect x="2" y="5" width="24" height="5" fill="#0e0477"/><rect x="2" y="13" width="24" height="5" fill="#189ac6"/><rect x="2" y="21" width="16" height="5" fill="#efac1f"/>',
  '<circle cx="14" cy="14" r="11" fill="none" stroke="#9d2ca2" stroke-width="5"/>',
  '<rect x="6" y="6" width="16" height="16" transform="rotate(45 14 14)" fill="#efac1f"/>',
];

export default function decorate(block) {
  const items = [...block.querySelectorAll('li')];
  const list = document.createElement('ul');
  list.className = 'theme-row';
  const source = items.length ? items : [...block.querySelectorAll(':scope > div > div')].filter((c) => c.textContent.trim());
  source.forEach((li, i) => {
    const item = document.createElement('li');
    item.className = 'theme';
    item.innerHTML = `<svg viewBox="0 0 28 28" aria-hidden="true">${GLYPHS[i % GLYPHS.length]}</svg>`;
    const span = document.createElement('span');
    span.textContent = li.textContent.trim();
    item.append(span);
    list.append(item);
  });
  block.replaceChildren(list);
}
