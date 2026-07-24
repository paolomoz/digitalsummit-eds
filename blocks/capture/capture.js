/**
 * capture — newsletter signup card (interactive; form rendered by block JS —
 * authored content never carries forms/scripts, D15).
 * Schema: stardust/eds-schema/index.json § newsletter.
 * Authoring rows: (0) heading (h2/h3); (1) optional link = form target.
 */
const CONFETTI = `<svg class="capture-confetti" viewBox="0 0 92 92" aria-hidden="true">
  <path d="M0 46 A46 46 0 0 1 46 0 L46 46 Z" fill="#189ac6"/>
  <path d="M52 0 L92 0 L52 40 Z" fill="#ec008c"/>
  <rect x="52" y="52" width="40" height="9" fill="#0e0477"/>
  <rect x="52" y="67" width="40" height="9" fill="#efac1f"/>
  <path d="M0 52 L40 52 L40 92 Z" fill="#9d2ca2"/>
</svg>`;

export default function decorate(block) {
  const heading = block.querySelector('h2, h3');
  const target = block.querySelector('a[href]');
  const action = target ? target.href : '#';

  const card = document.createElement('div');
  card.className = 'capture-card';
  card.insertAdjacentHTML('beforeend', CONFETTI);
  if (heading) card.append(heading);

  const form = document.createElement('form');
  form.className = 'capture-form';
  form.setAttribute('action', action);
  form.setAttribute('method', 'get');
  form.innerHTML = `
    <label class="sr-only" for="cap-email">Email</label>
    <input id="cap-email" type="email" name="email" placeholder="Email*" required>
    <label class="sr-only" for="cap-first">First name</label>
    <input id="cap-first" type="text" name="firstname" placeholder="First Name">
    <label class="sr-only" for="cap-last">Last name</label>
    <input id="cap-last" type="text" name="lastname" placeholder="Last Name">
    <button class="button" type="submit">Sign Me Up</button>`;
  form.addEventListener('submit', (e) => {
    const email = form.querySelector('#cap-email');
    if (!email.value || !email.checkValidity()) {
      e.preventDefault();
      email.reportValidity();
    }
  });
  card.append(form);
  block.replaceChildren(card);
}
