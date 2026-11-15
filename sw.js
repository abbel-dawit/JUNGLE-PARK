const C='jp-v67';const T='jp-tiles-v1';const PRE=['./','index.html','manifest.webmanifest','icon192.png','icon512.png','icon180.png','favicon-16.png','favicon-32.png','favicon-48.png','favicon.ico'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==T).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// map tiles: served from cache first so the run map appears instantly; at most ~600 tiles are kept
let trimT=0;function trimTiles(){clearTimeout(trimT);trimT=setTimeout(()=>caches.open(T).then(c=>c.keys().then(k=>{if(k.length>600)return Promise.all(k.slice(0,k.length-600).map(r=>c.delete(r)))})),3000)}
function tileFetch(req){return caches.open(T).then(c=>c.match(req).then(hit=>{if(hit)return hit;return fetch(req).then(res=>{if(res&&res.ok){c.put(req,res.clone());trimTiles()}return res})}))}
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||e.request.url.includes('formsubmit.co'))return;
  if(e.request.url.includes('tile.openstreetmap.org')){e.respondWith(tileFetch(e.request));return}
  // the public list of gyms and coaches: always ask the network first so edits on GitHub show up, the cache is the offline fallback
  if(e.request.url.includes('/directory/')){e.respondWith(fetch(e.request).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}return res}).catch(()=>caches.match(e.request)));return}
  e.respondWith(caches.match(e.request).then(r=>{const f=fetch(e.request).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}return res}).catch(()=>r);return r||f}))});
