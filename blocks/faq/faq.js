/**
 * faq — accordion: one row per Q/A (question cell + answer cell), D5.
 */
export default function decorate(block) {
  const wrap = document.createElement('div');
  wrap.className = 'faq-list';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const q = cells[0].textContent.trim();
    if (!q) return;
    const d = document.createElement('details');
    const s = document.createElement('summary');
    s.textContent = q;
    d.append(s);
    if (cells[1]) [...cells[1].childNodes].forEach((n) => d.append(n));
    wrap.append(d);
  });
  block.replaceChildren(wrap);
}
