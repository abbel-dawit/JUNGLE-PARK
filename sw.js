const C='jp-v78';const T='jp-tiles-v1';const PRE=['index.html','manifest.webmanifest','icon192.png','icon512.png','icon180.png','favicon-16.png','favicon-32.png','favicon-48.png','favicon.ico'];
// install: fetch fresh copies (never from the browser's HTTP cache), then take over right away.
// (v3.4: index.html is fetched once; "./" is served from the same saved copy instead of downloading the page twice)
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(PRE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==T).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// map tiles: served from cache first so the run map appears instantly; at most ~600 tiles are kept
let trimT=0;function trimTiles(){clearTimeout(trimT);trimT=setTimeout(()=>caches.open(T).then(c=>c.keys().then(k=>{if(k.length>600)return Promise.all(k.slice(0,k.length-600).map(r=>c.delete(r)))})),3000)}
function tileFetch(req){return caches.open(T).then(c=>c.match(req).then(hit=>{if(hit)return hit;return fetch(req).then(res=>{if(res&&res.ok){c.put(req,res.clone());trimTiles()}return res})}))}
// network first (fresh when online, the saved copy offline or when the network is too slow)
function netFirst(req,key,wait){return new Promise(resolve=>{let done=false;const fromCache=()=>caches.match(key||req).then(r=>r||caches.match('index.html')).then(r=>{if(!done&&r){done=true;resolve(r)}});
  const t=wait?setTimeout(fromCache,wait):0;
  fetch(req,{cache:'no-cache'}).then(res=>{clearTimeout(t);if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(key||req,cp))}if(!done){done=true;resolve(res)}})
    .catch(()=>{clearTimeout(t);caches.match(key||req).then(r=>r||caches.match('index.html')).then(r=>{if(!done){done=true;resolve(r||Response.error())}})})})}
// Look for a new version of the page: fetch it (revalidated, so an unchanged page costs a tiny 304), and if it changed,
// save it and tell the open app, which reloads into it straight away (the new copy is already saved, so that is instant).
let checking=null;
function refreshPage(url){if(checking)return checking;checking=(async()=>{try{const c=await caches.open(C);const old=await c.match('index.html');const was=old?await old.text():'';
    const res=await fetch(url||'index.html',{cache:'no-cache'});if(!res||!res.ok||res.type!=='basic')return false;const nw=await res.clone().text();
    if(!nw||nw===was)return false;
    await c.put('index.html',new Response(nw,{headers:{'Content-Type':'text/html; charset=utf-8'}}));
    if(was){const cl=await self.clients.matchAll({type:'window'});cl.forEach(w=>w.postMessage({t:'jp-updated'}))}return true}catch(x){return false}finally{checking=null}})();return checking}
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting();else if(e.data==='jp-check'){e.waitUntil(refreshPage())}});
// the app page: the saved copy opens instantly (no waiting on a slow network); a fresh copy is checked in the background
function appPage(req,e){return caches.match('index.html').then(hit=>{if(hit){e.waitUntil(refreshPage(req.url.split('#')[0]));return hit}
  return fetch(req,{cache:'no-cache'}).then(res=>{if(res&&res.ok&&res.type==='basic'){const cp=res.clone();caches.open(C).then(c=>c.put('index.html',cp))}return res}).catch(()=>caches.match('index.html')).then(r=>r||Response.error())})}
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET'||req.url.includes('formsubmit.co'))return;const url=new URL(req.url);
  if(url.hostname.includes('tile.openstreetmap.org')){e.respondWith(tileFetch(req));return}
  // the app page itself (with or without ?demo=1 and other query strings)
  if(req.mode==='navigate'||(url.origin===location.origin&&/\/(index\.html)?$/.test(url.pathname))){e.respondWith(appPage(req,e));return}
  // the public list of gyms and coaches: network first so edits on GitHub show up, the cache is the offline fallback
  if(url.pathname.includes('/directory/')){e.respondWith(netFirst(req));return}
  // the sync relay and other servers: never cached here
  if(url.origin!==location.origin&&!/fonts\.(googleapis|gstatic)\.com|cdnjs|unpkg|jsdelivr/.test(url.hostname))return;
  e.respondWith(caches.match(req).then(r=>{const f=fetch(req).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(req,cp))}return res}).catch(()=>r);return r||f}))});
