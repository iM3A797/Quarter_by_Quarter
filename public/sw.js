// Network-first for the page, cache fallback so the plan opens offline.
const C='qbq-v4';
const CORE=['/','/manifest.webmanifest','/icons/icon-192.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(CORE.map(x=>new Request(x,{cache:'reload'})))));});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url); if(u.origin===location.origin&&u.pathname.startsWith('/__/'))return;
  if(u.origin===location.origin||u.host.endsWith('fonts.googleapis.com')||u.host.endsWith('fonts.gstatic.com')||u.pathname.startsWith('/firebasejs/')){
    e.respondWith((u.origin===location.origin?fetch(r.url,{cache:'no-cache',credentials:'same-origin'}):fetch(r)).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})
      .catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('/'):undefined))));
  }
});
