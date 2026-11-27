
const { chromium } = require('@playwright/test');
const BASE='https://opencaribe.vercel.app';
function log(n,ok,d=''){console.log(`${ok?'PASS':'FAIL'} ${n} ${d}`);}
(async()=>{
  const b=await chromium.launch({headless:true});
  try{
    // headlines
    const anon=await b.newContext(); await anon.addCookies([{name:'NEXT_LOCALE',value:'en',url:BASE}]);
    const h=await anon.newPage();
    await h.goto(BASE+'/headlines',{timeout:90000});
    await h.waitForTimeout(6000);
    let body=await h.textContent('body');
    const cards=await h.locator('a[href*="http"]').count();
    log('headlines populated', /New York Times|Washington Post|CBS|NPR/.test(body), `outlet mentions=${cards}`);
    // cron auth
    const c=await h.request.post(BASE+'/api/cron/headlines');
    log('cron requires secret', c.status()===401, `status=${c.status()}`);
    // payments copy
    await h.goto(BASE+'/payments',{timeout:60000});
    log('payments live badge', (await h.textContent('body')).includes('Live on testnet'));
    // chat
    const ctx=await b.newContext(); await ctx.addCookies([{name:'NEXT_LOCALE',value:'en',url:BASE}]);
    const p=await ctx.newPage();
    const stamp=Date.now();
    await p.goto(BASE+'/register',{timeout:60000}); await p.waitForTimeout(900);
    await p.fill('#name','Chat Tester'); await p.fill('#email',`chat_${stamp}@example.com`); await p.fill('#password','correct-horse-battery');
    await p.locator('form.grid button[type="submit"]').click(); await p.waitForURL(BASE+'/',{timeout:30000});
    await p.goto(BASE+'/chat',{timeout:60000}); await p.waitForTimeout(1500);
    log('chat page renders', (await p.textContent('body')).includes('visitor chat'));
    await p.fill('input[maxlength="300"]','Hello from the walkthrough');
    await p.getByRole('button',{name:/^Send$/}).click(); await p.waitForTimeout(2000);
    log('chat message posted', (await p.textContent('body')).includes('Hello from the walkthrough'));
    // whatsapp
    await p.goto(BASE+'/account',{timeout:60000}); await p.waitForTimeout(1200);
    await p.fill('input[aria-label="WhatsApp"]','+1 868 555 0123');
    await p.getByRole('button',{name:/^Save$/}).first().click(); await p.waitForTimeout(1800);
    const acc=await p.textContent('body');
    log('whatsapp saved', acc.includes('wa.me/18685550123'), '');
  }catch(e){ console.error('VERIFY FAILED:', e.message.slice(0,220)); process.exitCode=1; }
  finally{ await b.close(); }
})();
