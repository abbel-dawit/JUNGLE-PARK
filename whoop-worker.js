// JUNGLE PARK · WHOOP connector (Cloudflare Worker, free plan is enough)
//
// WHOOP's official API (developer.whoop.com) uses OAuth 2.0 with a client secret. A secret must never ship inside a web
// page, so this small worker holds it, swaps the login code for tokens, refreshes them and forwards API calls with CORS.
// The app keeps each user's tokens on their own device; this worker stores nothing.
//
// Setup (once):
//  1. developer.whoop.com → Create app. Scopes: offline, read:recovery, read:cycles, read:sleep, read:workout, read:profile.
//     Redirect URL: the exact address of your app, e.g. https://yourname.github.io/jungle-park/index.html
//  2. dash.cloudflare.com → Workers → Create → paste this file → Deploy.
//  3. Worker → Settings → Variables:
//       WHOOP_CLIENT_ID      (from the WHOOP dashboard)
//       WHOOP_CLIENT_SECRET  (from the WHOOP dashboard, add it as an encrypted Secret)
//       ALLOWED_ORIGIN       https://yourname.github.io            (where the app is hosted)
//       ALLOWED_REDIRECTS    https://yourname.github.io/jungle-park/index.html   (comma-separated, must match step 1)
//  4. In the app: Health → Connect WHOOP → paste the worker address (https://….workers.dev) → Sign in with WHOOP.

const AUTH = 'https://api.prod.whoop.com/oauth/oauth2/auth';
const TOKEN = 'https://api.prod.whoop.com/oauth/oauth2/token';
const API = 'https://api.prod.whoop.com';
const SCOPES = 'offline read:recovery read:cycles read:sleep read:workout read:profile';

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const allow = env.ALLOWED_ORIGIN || '*';
    const cors = {
      'Access-Control-Allow-Origin': allow,
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Vary': 'Origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    const tokenCall = async (params) => {
      const r = await fetch(TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ ...params, client_id: env.WHOOP_CLIENT_ID, client_secret: env.WHOOP_CLIENT_SECRET }),
      });
      return new Response(await r.text(), { status: r.status, headers: { ...cors, 'Content-Type': 'application/json' } });
    };

    // 1. send the user to WHOOP's login page
    if (url.pathname === '/authorize') {
      const redirect = url.searchParams.get('redirect_uri') || '';
      if (!okRedirect(redirect, env)) return new Response('redirect_uri is not allowed', { status: 400 });
      const a = new URL(AUTH);
      a.search = new URLSearchParams({ response_type: 'code', client_id: env.WHOOP_CLIENT_ID, redirect_uri: redirect, scope: SCOPES, state: url.searchParams.get('state') || '' });
      return Response.redirect(a.toString(), 302);
    }
    // 2. swap the code WHOOP sent back for tokens
    if (url.pathname === '/token' && req.method === 'POST') {
      const b = await req.json().catch(() => ({}));
      if (!b.code || !okRedirect(b.redirect_uri, env)) return json({ error: 'bad_request' }, 400);
      return tokenCall({ grant_type: 'authorization_code', code: b.code, redirect_uri: b.redirect_uri });
    }
    // 3. refresh an expired access token
    if (url.pathname === '/refresh' && req.method === 'POST') {
      const b = await req.json().catch(() => ({}));
      if (!b.refresh_token) return json({ error: 'bad_request' }, 400);
      return tokenCall({ grant_type: 'refresh_token', refresh_token: b.refresh_token, scope: 'offline' });
    }
    // 4. read-only API calls: /api/developer/v2/... → https://api.prod.whoop.com/developer/v2/...
    if (url.pathname.startsWith('/api/developer/') && req.method === 'GET') {
      const r = await fetch(API + url.pathname.slice(4) + url.search, { headers: { Authorization: req.headers.get('Authorization') || '' } });
      return new Response(r.body, { status: r.status, headers: { ...cors, 'Content-Type': r.headers.get('Content-Type') || 'application/json' } });
    }
    return new Response('JUNGLE PARK WHOOP connector is running.', { headers: cors });
  },
};

function okRedirect(uri, env) {
  if (!uri || !/^https:\/\//.test(uri)) return false;
  const list = (env.ALLOWED_REDIRECTS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return list.length ? list.includes(uri) : true;
}
