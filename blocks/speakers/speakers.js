/**
 * speakers — circular portraits + broadcast lower-third lockups.
 * Schema: stardust/eds-schema/index.json § speakers.
 * Authoring: one row per speaker: [picture] [name as <a href>] [org text <p>].
 * Tolerates the flattened single-cell shape by segmenting on media boundaries (#52).
 */
export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'speaker-grid';
  const rows = [...block.children];
  rows.forEach((row) => {
    const link = row.querySelector('a[href]');
    const media = row.querySelector('picture, img');
    if (!link && !media) return;
    const name = link ? link.textContent.trim() : '';
    const texts = [...row.querySelectorAll('p')].map((p) => p.textContent.trim()).filter((t) => t && t !== name);
    // pipeline may unwrap the <p> (#79): fall back to cell textContent minus the name
    let org = texts[0];
    if (!org) {
      const cells = [...row.querySelectorAll(':scope > div')];
      const t = cells.map((c) => c.textContent.trim()).filter((x) => x && x !== name && !/^https?:/.test(x));
      org = t.find((x) => x !== name);
    }
    const card = document.createElement('a');
    card.className = 'speaker';
    if (link) card.href = link.href;
    if (media) card.append(media);
    const lt = document.createElement('span');
    lt.className = 'lower-third';
    lt.innerHTML = `<span class="lt-name">${name}</span>${org ? `<span class="lt-org">${org}</span>` : ''}`;
    card.append(lt);
    grid.append(card);
  });
  block.replaceChildren(grid);
}
