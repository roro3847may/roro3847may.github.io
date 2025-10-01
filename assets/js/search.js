(function () {
  const $input = document.getElementById('search-input');
  const $box = document.getElementById('search-results');
  if (!$input || !$box) return;

  let index = null;
  let lastQuery = '';

  // search.json 불러오기
  fetch('/search.json')
    .then(r => r.json())
    .then(data => { index = data; })
    .catch(() => {});

  const htmlEscape = (s) =>
    (s || '').replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));

  const highlight = (text, terms) => {
    let t = text;
    terms.forEach(term => {
      if (!term) return;
      const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      t = t.replace(re, (m) => `<mark>${htmlEscape(m)}</mark>`);
    });
    return t;
  };

  const search = (q) => {
    if (!index || !q) return [];
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return index.filter(post => {
      const title = (post.title || '').toLowerCase();
      const content = (post.content || '').toLowerCase();
      return terms.every(t => title.includes(t) || content.includes(t));
    });
  };

  const render = (items, q) => {
    if (!items.length) {
      $box.innerHTML = `<div style="padding:.6rem .75rem;color:#888;">검색 결과가 없습니다</div>`;
      $box.style.display = 'block';
      return;
    }
    const terms = q.trim().split(/\s+/).filter(Boolean);
    $box.innerHTML = items.map(p => `
      <a href="${p.url}" style="display:block;padding:.6rem .75rem;border-bottom:1px solid #f3f3f3;">
        <span style="font-weight:700;">${highlight(htmlEscape(p.title), terms)}</span>
      </a>
    `).join('');
    $box.style.display = 'block';
  };

  const clear = () => { $box.innerHTML = ''; $box.style.display = 'none'; };

  // 입력 이벤트 (드롭다운 미리보기)
  $input.addEventListener('input', e => {
    const q = e.target.value;
    if (q === lastQuery) return;
    lastQuery = q;
    if (!q.trim()) { clear(); return; }
    const items = search(q);
    render(items, q);
  });

  // 클릭 시 검색창 외부 클릭하면 닫기
  document.addEventListener('click', e => {
    if (!e.target.closest('.site-search')) clear();
  });

  // 키보드 UX: ESC로 닫기
  $input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { clear(); return; }
  });
})();
