(() => {
  if(document.body.dataset.page==='home'&&location.hash==='#wear'){location.replace('clothing.html');return;}
  const translations=window.maisonTranslations;
  const header=document.querySelector('.site-header'),menu=document.querySelector('#mobile-nav'),toggle=document.querySelector('.menu-toggle');
  const video=document.querySelector('.hero-video'),videoToggle=document.querySelector('.video-toggle');
  let language='en';
  try{const saved=localStorage.getItem('maison-language');if(['en','cn','ja'].includes(saved))language=saved;}catch{}
  const t=(en,cn,ja)=>({en,cn,ja})[language];
  function updateLabels(){
    toggle.setAttribute('aria-label',menu.hidden?t('Open menu','打开菜单','メニューを開く'):t('Close menu','关闭菜单','メニューを閉じる'));
    if(videoToggle)videoToggle.setAttribute('aria-label',video.paused?t('Play background video','播放背景视频','背景動画を再生'):t('Pause background video','暂停背景视频','背景動画を一時停止'));
  }
  function setLanguage(next){
    language=['en','cn','ja'].includes(next)?next:'en';document.documentElement.lang={en:'en',cn:'zh-CN',ja:'ja'}[language];
    document.querySelectorAll('[data-i18n]').forEach(element=>{const entry=translations[element.dataset.i18n];if(entry)element.textContent=entry[language];});
    document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===language)));
    const story=document.querySelector('#story-paragraphs');if(story){story.replaceChildren();
    window.maisonStory[language].forEach(text=>{const p=document.createElement('p');p.textContent=text;if(text.startsWith('The brand\'s identity')||text.startsWith('品牌的独特气质')||text.startsWith('"Instinct')||text.startsWith('「Instinct'))p.className='story-emphasis';story.append(p);});}
    const season=new URLSearchParams(location.search).get('season');
    const seasonEntry=translations['season-'+season]||translations['season-2027-ss'];
    const seasonHeading=document.querySelector('[data-season-heading]');if(seasonHeading)seasonHeading.textContent=seasonEntry[language];
    document.title=document.body.dataset.page==='clothing'?t('Store — Maison Lila','商店 — Maison Lila','ストア — Maison Lila'):'Maison Lila — Instinct for Endless Journeys.';
    if(document.body.dataset.page==='collection')document.title=seasonEntry[language]+' — Maison Lila';
    document.querySelector('meta[name="description"]').content=t('Maison Lila is a lifestyle brand rooted in design and culture, based in Meguro, Tokyo.','Maison Lila 是一个以东京目黑为据点、融合设计与文化的生活方式品牌。','東京・目黒を拠点とする、デザインとカルチャーを軸にしたライフスタイルブランド、Maison Lila。');
    window.maisonCommerce.setLocale(language);updateLabels();
    try{localStorage.setItem('maison-language',language);}catch{}
  }
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
  function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');header.classList.remove('menu-open');updateLabels();}
  toggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden));header.classList.toggle('menu-open',!menu.hidden);updateLabels();});
  menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){closeMenu();toggle.focus();}});
  matchMedia('(min-width:761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
  function updateHeader(){header.classList.toggle('scrolled',['collection','product'].includes(document.body.dataset.page)||scrollY>(document.body.dataset.page==='clothing'?380:470));}
  addEventListener('scroll',updateHeader,{passive:true});updateHeader();
  if(video&&matchMedia('(prefers-reduced-motion: reduce)').matches){video.autoplay=false;video.pause();}
  videoToggle?.addEventListener('click',()=>{if(video.paused)video.play().catch(updateLabels);else video.pause();});
  function updateVideoState(){if(!video||!videoToggle)return;videoToggle.textContent=video.paused?'▷':'Ⅱ';updateLabels();}
  video?.addEventListener('play',updateVideoState);video?.addEventListener('pause',updateVideoState);video?.addEventListener('error',()=>videoToggle.hidden=true);
  async function refreshHeroVideo(){
    const source=video?.querySelector('source[src]');if(!source)return;
    const url=new URL(source.src,location.href);if(url.origin!==location.origin)return;
    try{
      const response=await fetch(url.pathname,{method:'HEAD',cache:'no-store'});if(!response.ok)return;
      const modified=Date.parse(response.headers.get('Last-Modified')),length=response.headers.get('Content-Length');
      if(!Number.isFinite(modified)||!length)return;
      const version=Math.floor(modified/1000)+'-'+length;if(url.searchParams.get('v')===version)return;
      const resume=!video.paused||(video.autoplay&&!matchMedia('(prefers-reduced-motion: reduce)').matches);
      url.searchParams.set('v',version);source.src=url.href;video.load();
      if(resume)video.play().catch(updateLabels);
    }catch{}
  }
  refreshHeroVideo();
  document.addEventListener('click',event=>document.querySelectorAll('.collection-dropdown[open]').forEach(details=>{if(!details.contains(event.target))details.open=false;}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.collection-dropdown[open]').forEach(details=>{details.open=false;details.querySelector('summary').focus();});});
  document.querySelector('#year').textContent=new Intl.DateTimeFormat('en',{year:'numeric',timeZone:'Asia/Tokyo'}).format(new Date());
  setLanguage(language);updateVideoState();
})();
