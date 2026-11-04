// Reviewer annotations are compared with the captured original support pages.
document.addEventListener('DOMContentLoaded', () => {
  const changes = {
    'can-i-share-teaching-channel-library-videos.html': {
      kind: 'updated', title: 'How Do I Share a Video?',
      note: 'Renamed “Can I Share Teaching Channel Library Videos?” and replaced the longer explanation with three sharing steps. The opening sentence now explicitly requires both users to belong to the same cohort. The existing sharing screenshot is retained.'
    },
    'how-do-i-create-a-playlist.html': {
      kind: 'updated', title: 'How Do I Create a Playlist?',
      note: 'Changed the instructions to start from a video: Add To → Add to Playlist → Create New Playlist. Previously, they started from Playlists → See All → Create Playlist. Retained the Add To and Create Playlist screenshots; removed screenshots for the old navigation route. Added the three-video minimum for sharing.'
    },
    'how-do-i-share-a-playlist-with-everyone.html': {
      kind: 'added', title: 'How Do I Share a Playlist with Everyone in the Account?',
      note: 'New article with six steps for choosing the school/district cohort, selecting the whole cohort, and sharing the playlist. Includes the PDF’s screenshots and the three-video sharing requirement.'
    },
    'reflect-share-submit.html': {
      kind: 'added', title: 'What’s the Difference Between Reflect, Share, and Submit?',
      note: 'New comparison article explaining private reflection, collaborative sharing, and formal submission, with the workflow screenshot from the PDF.'
    },
    'how-do-i-access-learning-center-courses.html': {
      kind: 'added', title: 'How Do I Access Learning Center Courses?',
      note: 'New article covering course access, enrollment, and opening a course in Canvas. Uses the PDF and its linked access guide; retains a link to that illustrated guide.'
    },
    'track-professional-learning-and-course-completion.html': {
      kind: 'added', title: 'How Can I Track Professional Learning and Course Completion?',
      note: 'New article covering My Course History, completion letters, and administrator access to Student Progress. Includes the PDF’s screenshots and the linked administrator guide.'
    }
  };
  const removedNews = ['New Platform Login Experience', 'Teaching Channel is Excited to Introduce a New Experience!', 'Welcome to the New Teaching Channel Video Library!'];
  const file = decodeURIComponent(location.pathname.split('/').pop()) || 'index.html';
  const categoryNote = 'Added Learning Center Courses to the homepage and left category menu, with a category description and two articles. Its homepage tile sits in the left column.';
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
  summary.append(element('p','faq-review-baseline','Compared with the original support pages captured for this mockup. Later edits to the live knowledge base are not part of this comparison.'));
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
    Object.entries(changes).forEach(([href,change])=>note(list,change.kind,change.note,href,change.title));
    document.querySelectorAll('.hs-kb-home-list__category').forEach(tile=>{
      const target=filename(tile.querySelector('a'));
      if(target==='learning-center-courses.html') mark(tile,'added');
      if(target==='news-and-updates.html') mark(tile,'removed','3 article links removed');
      if(target==='video-libraries.html') mark(tile,'updated','2 articles updated · 1 added');
      if(target==='video-activites.html') mark(tile,'updated','1 article added');
    });
  } else if (changes[file]) {
    const change=changes[file];
    note(list,change.kind,change.note,null,change.title);
    const body=document.getElementById('hs_cos_wrapper_kb-article-module-5_');
    if(change.kind==='added') {
      mark(document.querySelector('h1')?.parentElement,'added','New article');
      mark(body,'added','New article content and screenshots');
    } else {
      if(file==='can-i-share-teaching-channel-library-videos.html') mark(document.querySelector('h1')?.parentElement,'updated','Article title updated');
      mark(document.getElementById('hs_cos_wrapper_kb-article-module-4'),'updated','Introduction updated');
      body?.querySelectorAll(':scope > p').forEach(p=>{
        if(p.querySelector('img') || !p.textContent.trim()) return;
        const added=p.textContent.includes('at least three videos');
        mark(p,added?'added':'updated',added?'Added sharing requirement':'Updated instructions');
      });
    }
  } else if(file==='news-and-updates.html') {
    note(list,'removed',newsNote,null,'Article links removed; section retained');
    mark(document.querySelector('.hs-kb-category-listing'),'removed','3 article links removed');
  } else if(file==='learning-center-courses.html') {
    note(list,'added',categoryNote,null,'New category');
    mark(document.querySelector('.hs-kb-category-listing'),'added','New category and article listing');
  } else if(file==='video-libraries.html' || file==='video-activites.html') {
    const relevant=file==='video-libraries.html'?Object.keys(changes).slice(0,3):['reflect-share-submit.html'];
    relevant.forEach(href=>note(list,changes[href].kind,changes[href].note,href,changes[href].title));
  } else {
    summary.querySelector('h2').textContent='Review notes';
    const text=file==='search.html'?'Search results link to the new and updated articles.':'No article content was changed on this page. The new Learning Center Courses navigation link is highlighted.';
    summary.append(element('p','',text));
  }
  document.querySelectorAll('.hs-kb-category_accordion_nav_list a').forEach(a=>{
    if(filename(a)==='learning-center-courses.html') mark(a.parentElement,'added','New category');
  });
  document.querySelectorAll('.hs-kb-category-listing .hs-kb-category-article-list a').forEach(a=>{
    const change=changes[filename(a)];
    if(change) mark(a.parentElement,change.kind);
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
  for(const kind of ['added','updated','removed']) {
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
