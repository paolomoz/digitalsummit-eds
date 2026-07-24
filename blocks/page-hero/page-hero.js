/**
 * page-hero — interior on-air band: chip + h1/h2 + lede + CTAs + contour.
 * Variants: (default) hero band; "cta" = centered registration band.
 * Authoring rows (flat, query-decoded): optional chip <p>, heading, lede <p>, CTA <p>s.
 */
const CONTOUR = `<svg class="contour" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0 52 C 90 44, 150 50, 210 40 S 320 18, 380 30 460 12, 520 26 640 8, 700 22 810 14, 870 28 980 10, 1040 24 1160 16, 1220 30 1370 20, 1440 34" fill="none" stroke="#189ac6" stroke-width="1.4"/>
  <path d="M0 58 C 110 52, 180 56, 250 48 S 360 30, 430 40 520 24, 590 36 700 20, 770 32 880 26, 950 38 1060 22, 1130 34 1250 28, 1320 40 1400 32, 1440 42" fill="none" stroke="#189ac6" stroke-width="1.1" opacity="0.55"/>
</svg>`;

export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const ps = [...block.querySelectorAll('p')].filter((p) => p.textContent.trim());
  const ctas = ps.filter((p) => p.querySelector('a'));
  const texts = ps.filter((p) => !p.querySelector('a'));
  const hText = heading ? heading.textContent : '';
  const chip = texts.find((t) => t.textContent.trim().length < 40 && t.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING);
  const lede = texts.find((t) => t !== chip);

  const wrap = document.createElement('div');
  wrap.className = 'ph-wrap';
  if (chip) { const c = document.createElement('p'); c.innerHTML = `<span class="chip">${chip.textContent.trim()}</span>`; wrap.append(c); }
  if (heading) wrap.append(heading);
  if (lede) { lede.className = 'ph-lede'; wrap.append(lede); }
  if (ctas.length) { const a = document.createElement('div'); a.className = 'ph-actions'; a.append(...ctas); wrap.append(a); }
  block.replaceChildren(wrap);
  block.insertAdjacentHTML('beforeend', CONTOUR);
}
