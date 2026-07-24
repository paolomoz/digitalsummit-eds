/**
 * quote — on-air testimonial band (template-slotted): duotone photo ground + quote.
 * Schema: stardust/eds-schema/index.json § testimonial.
 * Authoring rows: (0) picture = band ground; (1) quote text; (2) optional attribution.
 */
export default function decorate(block) {
  const media = block.querySelector('picture, img');
  const texts = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
  const quoteText = texts[0] ? texts[0].textContent.trim() : block.textContent.trim();
  const attribution = texts[1] ? texts[1].textContent.trim() : null;

  block.replaceChildren();
  if (media) {
    const bg = document.createElement('div');
    bg.className = 'quote-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.append(media);
    block.append(bg);
  }
  const scrim = document.createElement('div');
  scrim.className = 'quote-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  block.append(scrim);
  const wrap = document.createElement('div');
  wrap.className = 'quote-wrap';
  const bq = document.createElement('blockquote');
  bq.textContent = quoteText;
  wrap.append(bq);
  if (attribution) {
    const cite = document.createElement('p');
    cite.className = 'quote-cite';
    cite.textContent = attribution;
    wrap.append(cite);
  }
  block.append(wrap);
}
