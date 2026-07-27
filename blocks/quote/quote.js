/**
 * quote — on-air testimonial band: duotone photo ground + quote, as a
 * carousel when several slides are authored, with a content/background
 * parallax like the source site's band.
 *
 * Authoring (two shapes tolerated):
 *  - legacy single slide: row 0 = picture, row 1 = quote, row 2 = attribution
 *  - carousel: one row per slide, cells [picture][quote (+attribution <p>)]
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function slidesFrom(block) {
  const rows = [...block.children];
  const twoCellRows = rows.filter((r) => r.children.length >= 2 && r.querySelector('picture, img'));
  if (twoCellRows.length >= 1 && rows.every((r) => r.children.length >= 2 || !r.textContent.trim())) {
    return twoCellRows.map((row) => {
      const [mediaCell, textCell] = row.children;
      const texts = [...textCell.querySelectorAll('p')].map((p) => p.textContent.trim()).filter(Boolean);
      return {
        media: mediaCell.querySelector('picture, img'),
        quote: texts[0] || textCell.textContent.trim(),
        attribution: texts[1] || null,
      };
    });
  }
  // legacy stacked shape
  const media = block.querySelector('picture, img');
  const texts = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
  return [{
    media,
    quote: texts[0] ? texts[0].textContent.trim() : block.textContent.trim(),
    attribution: texts[1] ? texts[1].textContent.trim() : null,
  }];
}

function buildSlide({ media, quote, attribution }, i) {
  const slide = document.createElement('div');
  slide.className = 'quote-slide';
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');
  slide.setAttribute('aria-label', `${i + 1}`);
  if (media) {
    const bg = document.createElement('div');
    bg.className = 'quote-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.append(media);
    slide.append(bg);
  }
  const scrim = document.createElement('div');
  scrim.className = 'quote-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  slide.append(scrim);
  const wrap = document.createElement('div');
  wrap.className = 'quote-wrap';
  const bq = document.createElement('blockquote');
  bq.textContent = quote;
  wrap.append(bq);
  if (attribution) {
    const cite = document.createElement('p');
    cite.className = 'quote-cite';
    cite.textContent = attribution;
    wrap.append(cite);
  }
  slide.append(wrap);
  return slide;
}

export default function decorate(block) {
  const slides = slidesFrom(block).filter((s) => s.quote);
  block.replaceChildren();
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', 'Attendee testimonials');

  const track = document.createElement('div');
  track.className = 'quote-track';
  const els = slides.map((s, i) => buildSlide(s, i));
  els.forEach((el) => track.append(el));
  block.append(track);

  let current = 0;
  let timer;
  const stop = () => clearInterval(timer);
  const show = (n) => {
    current = (n + els.length) % els.length;
    els.forEach((el, i) => {
      el.classList.toggle('active', i === current);
      el.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });
    [...block.querySelectorAll('.quote-dot')].forEach((d, i) => {
      d.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  };
  const start = () => {
    if (prefersReducedMotion.matches || els.length < 2) return;
    stop();
    timer = setInterval(() => show(current + 1), 7000);
  };
  const restart = () => { stop(); start(); };

  if (els.length > 1) {
    const dots = document.createElement('div');
    dots.className = 'quote-dots';
    els.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'quote-dot';
      dot.setAttribute('aria-label', `Show testimonial ${i + 1} of ${els.length}`);
      dot.addEventListener('click', () => { show(i); restart(); });
      dots.append(dot);
    });
    block.append(dots);

    ['prev', 'next'].forEach((dir) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `quote-arrow quote-${dir}`;
      btn.setAttribute('aria-label', dir === 'prev' ? 'Previous testimonial' : 'Next testimonial');
      btn.innerHTML = '<span aria-hidden="true"></span>';
      btn.addEventListener('click', () => { show(current + (dir === 'next' ? 1 : -1)); restart(); });
      block.append(btn);
    });

    block.addEventListener('mouseenter', stop);
    block.addEventListener('mouseleave', start);
    block.addEventListener('focusin', stop);
    block.addEventListener('focusout', start);
    start();
  }
  show(0);

  // content/background parallax — the photo drifts slower than the scroll
  if (!prefersReducedMotion.matches) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = block.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const shift = Math.round(progress * -60);
      block.querySelectorAll('.quote-bg img').forEach((img) => {
        img.style.transform = `translateY(${shift}px) scale(1.18)`;
      });
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
}
