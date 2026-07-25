/**
 * pricing — tier comparison matrix.
 * Authoring: row 1 = tier header (empty lead cell, then tier name + price
 * per cell, price led by <strong>); feature rows = [feature name +
 * description] then one cell per tier: "✓" (included), text (detail), or
 * empty (not included). A tier cell may carry <em>Most popular</em> in the
 * header to flag the highlighted column.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const table = document.createElement('div');
  table.className = 'pricing-table';

  const [head, ...features] = rows;
  const headCells = [...head.children];
  const tierCount = headCells.length - 1;
  let popularCol = -1;

  const headRow = document.createElement('div');
  headRow.className = 'pricing-row pricing-head';
  headCells.forEach((cell, i) => {
    const el = document.createElement('div');
    el.className = i === 0 ? 'pricing-lead' : 'pricing-tier';
    if (i > 0) {
      const em = cell.querySelector('em');
      if (em) { popularCol = i; em.remove(); el.classList.add('popular'); el.dataset.popular = 'Most popular'; }
      el.append(...cell.childNodes);
    }
    headRow.append(el);
  });
  table.append(headRow);

  features.forEach((row) => {
    const cells = [...row.children];
    const tr = document.createElement('div');
    tr.className = 'pricing-row';
    const lead = document.createElement('div');
    lead.className = 'pricing-lead';
    lead.append(...(cells[0] ? [...cells[0].childNodes] : []));
    tr.append(lead);
    for (let i = 1; i <= tierCount; i += 1) {
      const el = document.createElement('div');
      el.className = 'pricing-cell';
      if (i === popularCol) el.classList.add('popular');
      const text = cells[i] ? cells[i].textContent.trim() : '';
      if (text === '✓') {
        el.classList.add('included');
        el.innerHTML = '<span class="check" role="img" aria-label="Included"></span>';
      } else if (text) {
        el.append(...cells[i].childNodes);
      } else {
        el.classList.add('excluded');
        el.innerHTML = '<span aria-hidden="true">—</span><span class="visually-hidden">Not included</span>';
      }
      tr.append(el);
    }
    table.append(tr);
  });

  block.replaceChildren(table);
}
