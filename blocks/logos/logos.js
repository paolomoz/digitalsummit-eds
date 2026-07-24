/**
 * logos — partner logo wall (static, no carousel) + optional CTA row.
 * Schema: stardust/eds-schema/index.json § partners.
 * Authoring: one row per logo [picture with alt]; final row may be a CTA
 * paragraph (<strong><a>) — cloned, never manufactured.
 */
export default function decorate(block) {
  const wall = document.createElement('div');
  wall.className = 'logo-wall';
  let ctaRow = null;
  [...block.children].forEach((row) => {
    const media = row.querySelector('picture, img');
    if (media) {
      const tile = document.createElement('div');
      tile.className = 'logo-tile';
      tile.append(media);
      wall.append(tile);
    } else if (row.querySelector('a')) {
      ctaRow = row;
    }
  });
  const out = [wall];
  if (ctaRow) {
    const actions = document.createElement('p');
    actions.className = 'logos-cta';
    [...ctaRow.querySelectorAll('p, a')].filter((n) => n.tagName === 'P' || !n.closest('p'))
      .forEach((n) => actions.append(n));
    out.push(actions);
  }
  block.replaceChildren(...out);
}
