/*
 * Embed block — renders a third-party resource (video, map, form) from a
 * plain authored link. Usually auto-blocked (see buildEmbedAutoBlocks in
 * scripts.js); the iframe is created on intersection to keep it off the
 * critical path.
 */

function kindOf(url) {
  if (/(^|\.)youtube(-nocookie)?\.com$/.test(url.hostname) || url.hostname === 'youtu.be') return 'video';
  if (/(^|\.)google\.com$/.test(url.hostname) && url.pathname.startsWith('/maps/')) return 'map';
  if (url.hostname.endsWith('hsforms.net')) return 'form';
  return 'generic';
}

function embedUrlFor(url, kind) {
  if (kind === 'video') {
    let id = url.searchParams.get('v');
    if (!id && url.hostname === 'youtu.be') [, id] = url.pathname.split('/');
    if (!id && url.pathname.startsWith('/embed/')) [, , id] = url.pathname.split('/');
    if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
  }
  return url.href;
}

export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) return;
  let url;
  try {
    url = new URL(link.href);
  } catch (e) {
    return;
  }
  const kind = kindOf(url);
  const src = embedUrlFor(url, kind);
  const title = { video: 'Video', map: 'Map', form: 'Form' }[kind] || 'Embedded content';
  block.classList.add(`embed-${kind}`);
  block.textContent = '';

  const load = () => {
    if (block.dataset.embedLoaded) return;
    block.dataset.embedLoaded = 'true';
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = title;
    iframe.loading = 'lazy';
    iframe.setAttribute('allowfullscreen', '');
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    block.append(iframe);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      load();
    }
  }, { rootMargin: '200px' });
  observer.observe(block);
}
