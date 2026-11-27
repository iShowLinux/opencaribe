
const { chromium } = require('@playwright/test');
const BASE='https://opencaribe.vercel.app';
(async()=>{
  const b=await chromium.launch({headless:true});
  const ctx=await b.newContext(); await ctx.addCookies([{name:'NEXT_LOCALE',value:'en',url:BASE}]);
  const p=await ctx.newPage();
  const seen=new Set(); const bad=[];
  for (const start of ['/','/tt','/ve','/jm','/bb','/gy','/news','/payments']) {
    await p.goto(BASE+start,{timeout:60000}); await p.waitForTimeout(800);
    const hrefs=await p.locator('a[href]').evaluateAll(as=>as.map(a=>a.getAttribute('href')));
    for (const h of hrefs) {
      if (!h || h.startsWith('#') || h.startsWith('http') || h.startsWith('mailto:')) continue;
      const norm=h.split('#')[0].split('?')[0];
      if (seen.has(norm)) continue; seen.add(norm);
      try{
        const r=await p.request.get(BASE+h,{maxRedirects:5});
        if (r.status()>=400) bad.push(`${start} -> ${h} : ${r.status()}`);
      }catch(e){ bad.push(`${start} -> ${h} : ERR`); }
    }
  }
  // fresh header check for sailship svg
  await p.goto(BASE+'/',{timeout:60000});
  const mark=await p.locator('header span[aria-hidden="true"] svg path').count();
  console.log('internal links checked:', seen.size);
  console.log('broken:', bad.length ? bad.join('\n') : 'none');
  console.log('sailship paths in header:', mark>0);
  await b.close();
})();
