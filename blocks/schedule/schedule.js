/**
 * schedule — broadcast agenda: day headings + timed session rows.
 * Authoring: day row = single cell <h3>; session row = [time <p>] [title <a> + speakers <p> + categories <p> ("·"-delimited, #50)].
 */
export default function decorate(block) {
  const out = document.createElement('div');
  out.className = 'sched';
  let list = null;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const day = row.querySelector('h2, h3, h4');
    if (day && cells.length === 1) {
      const h = document.createElement('h3');
      h.className = 'day-head';
      h.textContent = day.textContent.trim();
      out.append(h);
      list = document.createElement('ul');
      list.className = 'session-list';
      out.append(list);
      return;
    }
    if (!list) { list = document.createElement('ul'); list.className = 'session-list'; out.append(list); }
    const time = cells[0] ? cells[0].textContent.trim() : '';
    const body = cells[1] || cells[0];
    const link = body.querySelector('a');
    const ps = [...body.querySelectorAll('p')].filter((p) => !p.querySelector('a'));
    const texts = ps.length ? ps.map((p) => p.textContent.trim()) : body.textContent.split('\n').map((t) => t.trim()).filter((t) => t && t !== time && (!link || t !== link.textContent.trim()));
    const who = texts.find((t) => /,/.test(t) && !/·/.test(t)) || texts[0];
    const cats = texts.find((t) => /·/.test(t) || (t !== who && t.length < 80 && t === t.replace(/,.*/, '')));
    const li = document.createElement('li');
    li.className = 'session';
    li.innerHTML = `<span class="time">${time}</span>`;
    const div = document.createElement('div');
    if (link) { const t = document.createElement('p'); t.className = 'title'; t.append(link); div.append(t); }
    if (who && who !== cats) { const w = document.createElement('p'); w.className = 'who'; w.textContent = who; div.append(w); }
    if (cats) { const c = document.createElement('p'); c.className = 'cats'; c.innerHTML = cats.split('·').map((x) => `<span class="cat-chip">${x.trim()}</span>`).join(''); div.append(c); }
    li.append(div);
    list.append(li);
  });
  block.replaceChildren(out);
}
