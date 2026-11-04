// Local interactions use the downloaded site's existing elements and styling.
document.addEventListener('DOMContentLoaded', () => {
  const articles = window.FAQ_SEARCH_INDEX || [];
  const find = query => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return articles.map(a => ({...a, score: words.reduce((n,w) => n + (a.title.toLowerCase().includes(w) ? 5 : a.text.toLowerCase().includes(w) ? 1 : 0), 0)}))
      .filter(a => words.every(w => (a.title + ' ' + a.text).toLowerCase().includes(w)))
      .sort((a,b) => b.score-a.score);
  };
  function resultLink(article, className) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = article.href;
    link.textContent = article.title;
    if (className) link.className = className;
    li.append(link);
    return li;
  }
  document.querySelectorAll('.hs-search-field__form').forEach(form => {
    const input = form.querySelector('input[type="search"]');
    const field = form.closest('.hs-search-field');
    const suggestions = field?.querySelector('.hs-search-field__suggestions');
    if (!input || !suggestions) return;
    const close = () => { field.classList.remove('hs-search-field--open'); input.setAttribute('aria-expanded','false'); suggestions.replaceChildren(); };
    input.addEventListener('input', () => {
      suggestions.replaceChildren();
      const matches = find(input.value).slice(0,6);
      if (!input.value.trim()) { close(); return; }
      for (const article of matches) suggestions.append(resultLink(article));
      if (!matches.length) { const li=document.createElement('li'); li.textContent='No matching articles found.'; suggestions.append(li); }
      field.classList.add('hs-search-field--open');
      input.setAttribute('aria-expanded','true');
    });
    input.addEventListener('keydown', e => {
      if (e.key==='Escape') close();
      if (e.key==='ArrowDown') { suggestions.querySelector('a')?.focus(); e.preventDefault(); }
    });
    document.addEventListener('click', e => { if (!field.contains(e.target)) close(); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (input.value.trim()) location.href='search.html?q='+encodeURIComponent(input.value.trim());
    });
  });
  const results = document.getElementById('mockup-search-results');
  if (results) {
    const query = new URLSearchParams(location.search).get('q') || '';
    const input=document.querySelector('input[type="search"]');
    if (input) input.value=query;
    const matches=find(query);
    const intro=document.querySelector('.hs-kb-category-listing p');
    intro.textContent=query ? `${matches.length} ${matches.length===1?'result':'results'} for “${query}”` : 'Enter a search term above to find an article.';
    matches.forEach(a => results.append(resultLink(a,'hs-kb-category-article-list__link')));
  }
  document.querySelectorAll('.hs-kb-category-listing').forEach(section => {
    const list=section.querySelector('.hs-kb-category-article-list');
    const toggle=section.querySelector('.hs-kb-category-article-list__toggle');
    if (!list || !toggle) return;
    const rows=[...list.children];
    if(rows.length<=5){toggle.hidden=true;return;}
    let expanded=false;
    const render=()=>{
      rows.forEach((row,i)=>row.hidden=!expanded && i>=5);
      toggle.classList.remove('-hidden');
      toggle.setAttribute('aria-expanded',String(expanded));
      toggle.querySelector('.hs-kb-category-article-list__toggle-text').textContent=expanded?'See less':'See more';
    };
    toggle.addEventListener('click',()=>{expanded=!expanded;render();});
    render();
  });
  document.querySelectorAll('.ka-feedback-rating-button').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.ka-feedback-rating-button').forEach(other => {
        other.classList.toggle('mockup-feedback-selected',other===button);
        other.setAttribute('aria-pressed',String(other===button));
      });
      const message=document.getElementById('ka-feedback-post-submit-message');
      message.style.display='block';
      message.querySelector('span').textContent='Preview only — your feedback has not been submitted.';
    });
  });
});
