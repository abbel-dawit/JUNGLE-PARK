const C='jp-v76';const T='jp-tiles-v1';const PRE=['./','index.html','manifest.webmanifest','icon192.png','icon512.png','icon180.png','favicon-16.png','favicon-32.png','favicon-48.png','favicon.ico'];
// install: fetch fresh copies (never from the browser's HTTP cache), then take over right away
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(PRE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==T).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting()});
// map tiles: served from cache first so the run map appears instantly; at most ~600 tiles are kept
let trimT=0;function trimTiles(){clearTimeout(trimT);trimT=setTimeout(()=>caches.open(T).then(c=>c.keys().then(k=>{if(k.length>600)return Promise.all(k.slice(0,k.length-600).map(r=>c.delete(r)))})),3000)}
function tileFetch(req){return caches.open(T).then(c=>c.match(req).then(hit=>{if(hit)return hit;return fetch(req).then(res=>{if(res&&res.ok){c.put(req,res.clone());trimTiles()}return res})}))}
// network first (fresh when online, the saved copy offline or when the network is too slow)
function netFirst(req,key,wait){return new Promise(resolve=>{let done=false;const fromCache=()=>caches.match(key||req).then(r=>r||caches.match('index.html')).then(r=>{if(!done&&r){done=true;resolve(r)}});
  const t=wait?setTimeout(fromCache,wait):0;
  fetch(req,{cache:'no-cache'}).then(res=>{clearTimeout(t);if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(key||req,cp))}if(!done){done=true;resolve(res)}})
    .catch(()=>{clearTimeout(t);caches.match(key||req).then(r=>r||caches.match('index.html')).then(r=>{if(!done){done=true;resolve(r||Response.error())}})})})}
// the app page: the saved copy opens instantly (no waiting on a slow network); a fresh copy is fetched in the background
// and, if it changed, saved and announced so the open app reloads into it when the member is not busy.
function appPage(req,e){return caches.match('index.html').then(hit=>{const old=hit?hit.clone():null;
  const net=fetch(req,{cache:'no-cache'}).then(async res=>{if(res&&res.ok&&res.type==='basic'){const cp=res.clone();try{const c=await caches.open(C);const nw=await cp.clone().text();const was=old?await old.text():'';await c.put('index.html',cp);
      if(old&&was&&nw!==was){const cl=await self.clients.matchAll({type:'window'});cl.forEach(w=>w.postMessage({t:'jp-updated'}))}}catch(x){}}return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  return net.then(r=>r||caches.match('index.html')).then(r=>r||Response.error())})}
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET'||req.url.includes('formsubmit.co'))return;const url=new URL(req.url);
  if(url.hostname.includes('tile.openstreetmap.org')){e.respondWith(tileFetch(req));return}
  // the app page itself: always the newest version when online, so an update shows the next time the app opens
  if(req.mode==='navigate'||(url.origin===location.origin&&/\/(index\.html)?$/.test(url.pathname))){e.respondWith(appPage(req,e));return}
  // the public list of gyms and coaches: network first so edits on GitHub show up, the cache is the offline fallback
  if(url.pathname.includes('/directory/')){e.respondWith(netFirst(req));return}
  e.respondWith(caches.match(req).then(r=>{const f=fetch(req).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(req,cp))}return res}).catch(()=>r);return r||f}))});
