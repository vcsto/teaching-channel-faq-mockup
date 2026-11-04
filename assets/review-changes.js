// Only outstanding requests relative to the live support site checked November 4, 2026.
document.addEventListener('DOMContentLoaded', () => {
  const removedNews = ['New Platform Login Experience', 'Teaching Channel is Excited to Introduce a New Experience!', 'Welcome to the New Teaching Channel Video Library!'];
  const file = decodeURIComponent(location.pathname.split('/').pop()) || 'index.html';
  const categoryNote = 'Added a left-aligned Learning Center Courses homepage tile with its description, and added the missing sidebar links. These lead to the existing category and its two already-published course articles. Existing category links and article content are unchanged.';
  const newsNote = 'Kept the News and Updates section and removed its three article links: '+removedNews.join('; ')+'.';
  const label = kind => ({added:'Added',updated:'Updated',removed:'Removed'})[kind];
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const filename = anchor => new URL(anchor.href,location.href).pathname.split('/').pop();
  function mark(node, kind, caption=label(kind)) {
    if (!node || node.classList.contains('faq-change')) return;
    node.classList.add('faq-change');
    node.dataset.changeKind=kind;
    const badge=element('span','faq-change-label',caption);
    badge.setAttribute('aria-hidden','true');
    node.prepend(badge);
  }
  function note(parent,kind,text,href,title) {
    const row=element('li','faq-review-item');
    row.dataset.changeKind=kind;
    row.append(element('span','faq-review-badge',label(kind)));
    const copy=element('div','faq-review-copy');
    if (title) {
      const heading=element(href?'a':'strong','',title);
      if (href) heading.href=href;
      copy.append(heading);
    }
    copy.append(element('p','',text));
    row.append(copy);
    parent.append(row);
  }

  const summary=element('aside','faq-review-summary');
  summary.setAttribute('aria-label','Changes on this page');
  summary.append(element('h2','','Changes on this page'));
  summary.append(element('p','faq-review-baseline','Only changes still needed on the live support site, checked November 4, 2026. Published article updates are already complete and are not highlighted.'));
  const list=element('ul','faq-review-list');
  summary.append(list);
  const home=document.querySelector('.hs-kb-home-list');
  const content=document.querySelector('.hs-kb-content');
  if (home) {
    summary.classList.add('faq-review-summary--home');
    home.before(summary);
  } else if (content) content.prepend(summary);
  else document.querySelector('main')?.prepend(summary);

  if (file==='index.html') {
    note(list,'added',categoryNote,'learning-center-courses.html','Learning Center Courses');
    note(list,'removed',newsNote,'news-and-updates.html','News and Updates');
    document.querySelectorAll('.hs-kb-home-list__category').forEach(tile=>{
      const target=filename(tile.querySelector('a'));
      if(target==='learning-center-courses.html') mark(tile,'added');
      if(target==='news-and-updates.html') mark(tile,'removed','3 article links removed');
    });
  } else if(file==='news-and-updates.html') {
    note(list,'removed',newsNote,null,'Article links removed; section retained');
    mark(document.querySelector('.hs-kb-category-listing'),'removed','3 article links removed');
  } else if(file==='learning-center-courses.html') {
    summary.append(element('p','','This category and both articles are already published. The remaining change is to link here from the homepage and sidebars where Learning Center Courses is missing.'));
  } else {
    summary.querySelector('h2').textContent='Review notes';
    const text=file==='search.html'?'Search results use the current published articles; no article content changes remain.':'This page uses the current published content. No article content changes remain. Missing Learning Center Courses sidebar links are highlighted where added.';
    summary.append(element('p','',text));
  }
  document.querySelectorAll('.hs-kb-category_accordion_nav_list [data-pending-navigation] a').forEach(a=>{
    if(filename(a)==='learning-center-courses.html') mark(a.parentElement,'added','Navigation link added');
  });
  const controls=element('div','faq-review-controls');
  controls.setAttribute('aria-label','Mockup review controls');
  const toggle=element('button','faq-review-toggle');
  toggle.type='button';
  toggle.setAttribute('role','switch');
  toggle.setAttribute('aria-label','Show changes');
  toggle.append(element('span','','Show changes'));
  const track=element('span','faq-review-switch');
  track.setAttribute('aria-hidden','true');
  track.append(element('span','faq-review-switch-thumb'));
  toggle.append(track);
  controls.append(toggle);
  const legend=element('div','faq-review-legend');
  for(const kind of ['added','removed']) {
    const chip=element('span','faq-review-badge',label(kind));
    chip.dataset.changeKind=kind;
    legend.append(chip);
  }
  controls.append(legend);
  document.body.append(controls);

  const storageKey='tc-faq-show-changes-v1';
  let enabled=false;
  try { enabled=localStorage.getItem(storageKey)==='true'; } catch {}
  const requested=new URLSearchParams(location.search).get('changes');
  if(requested==='1' || requested==='0') enabled=requested==='1';
  const autoExpanded=new Set();
  function applyState() {
    document.body.classList.toggle('faq-review-on',enabled);
    toggle.setAttribute('aria-checked',String(enabled));
    try { localStorage.setItem(storageKey,String(enabled)); } catch {}
    const url=new URL(location.href);
    if(enabled) url.searchParams.set('changes','1'); else url.searchParams.delete('changes');
    try { history.replaceState(null,'',url); } catch {}
    document.querySelectorAll('a[href]').forEach(a=>{
      const target=new URL(a.href,location.href);
      if(target.origin!==location.origin || !/\.html$/.test(target.pathname)) return;
      if(enabled) target.searchParams.set('changes','1'); else target.searchParams.delete('changes');
      a.href=target.href;
    });
    document.querySelectorAll('.hs-kb-category-listing').forEach(section=>{
      const button=section.querySelector('.hs-kb-category-article-list__toggle');
      if(!button) return;
      if(enabled && section.querySelector('.faq-change[hidden]') && button.getAttribute('aria-expanded')==='false') {
        button.click(); autoExpanded.add(button);
      } else if(!enabled && autoExpanded.has(button)) {
        if(button.getAttribute('aria-expanded')==='true') button.click();
        autoExpanded.delete(button);
      }
    });
  }
  toggle.addEventListener('click',()=>{enabled=!enabled;applyState();});
  applyState();
});
