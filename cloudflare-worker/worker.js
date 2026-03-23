/**
 * Solvia Bot Router — Cloudflare Worker
 * 
 * Routes bot/crawler traffic to pre-rendered static HTML in R2.
 * Routes human traffic to the Lovable SPA origin.
 * Redirects www.thesolvia.com → thesolvia.com.
 */

const ORIGIN = 'https://thesolvia.com';
const ORIGIN_IP = '185.158.133.1';
const CANONICAL_HOST = 'thesolvia.com';

// Bot user-agent patterns (case-insensitive match)
const BOT_UA_PATTERNS = [
  // Search engines
  'googlebot', 'bingbot', 'yandexbot', 'baiduspider', 'duckduckbot',
  'slurp',         // Yahoo
  'sogou',
  'exabot',
  'ia_archiver',   // Alexa
  'mj12bot',       // Majestic
  'ahrefsbot', 'semrushbot', 'dotbot', 'rogerbot', 'screaming frog',
  
  // Social platforms
  'facebookexternalhit', 'facebot',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'pinterestbot',
  'slackbot',
  'discordbot',
  
  // AI crawlers
  'gptbot', 'chatgpt-user',
  'claudebot', 'claude-web',
  'perplexitybot',
  'ccbot',         // Common Crawl
  'bytespider',    // ByteDance
  'cohere-ai',
  'anthropic-ai',
  'google-extended',
  'amazonbot',
  
  // Dev tools & validators
  'curl/', 'wget/', 'httpie/',
  'lighthouse',
  'pagespeed',
  'w3c_validator',
  'feedfetcher',
];

function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_UA_PATTERNS.some(pattern => ua.includes(pattern));
}

/**
 * Map a URL pathname to the R2 object key.
 * Examples:
 *   /                         → home/index.html
 *   /blog                     → blog/index.html
 *   /blog/                    → blog/index.html
 *   /blog/doctor-salary       → blog/doctor-salary/index.html
 *   /blog/doctor-salary/      → blog/doctor-salary/index.html
 *   /homologation             → homologation/index.html
 *   /sitemap.xml              → sitemap.xml
 *   /robots.txt               → robots.txt
 *   /llms.txt                 → llms.txt
 */
function pathnameToR2Key(pathname) {
  // Direct file requests (sitemap.xml, robots.txt, llms.txt, etc.)
  const directFiles = ['sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt'];
  const cleanPath = pathname.replace(/^\//, '');
  if (directFiles.includes(cleanPath)) {
    return cleanPath;
  }

  // Normalize: strip trailing slash, strip leading slash
  let path = pathname.replace(/\/+$/, '').replace(/^\/+/, '');

  // Root path
  if (path === '') {
    return 'home/index.html';
  }

  return path + '/index.html';
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // --- Step 1: www → non-www redirect (all requests) ---
    if (url.hostname === 'www.' + CANONICAL_HOST) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    // --- Step 2: Check if this is a bot ---
    const userAgent = request.headers.get('user-agent') || '';
    
    if (!isBot(userAgent)) {
      // Human user → pass through to Lovable origin
      return fetch(request);
    }

    // --- Step 3: Bot detected — try to serve from R2 ---
    const r2Key = pathnameToR2Key(url.pathname);

    try {
      const object = await env.STATIC_PAGES.get(r2Key);

      if (object) {
        // Determine content type
        let contentType = 'text/html; charset=utf-8';
        if (r2Key.endsWith('.xml')) contentType = 'application/xml; charset=utf-8';
        if (r2Key.endsWith('.txt')) contentType = 'text/plain; charset=utf-8';

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
        headers.set('X-Served-By', 'cloudflare-worker-static');
        headers.set('X-R2-Key', r2Key);
        // Prevent Cloudflare from auto-minifying
        headers.set('X-Content-Type-Options', 'nosniff');

        return new Response(object.body, {
          status: 200,
          headers,
        });
      }
    } catch (err) {
      // R2 error — fall through to origin
      console.error('R2 fetch error:', err);
    }

    // --- Step 4: No R2 match — fall through to origin ---
    // This handles routes without static mirrors (e.g., /auth, /dashboard)
    const originResponse = await fetch(request);
    
    // Add header so we can debug which path was taken
    const response = new Response(originResponse.body, originResponse);
    response.headers.set('X-Served-By', 'cloudflare-worker-origin-fallback');
    return response;
  },
};
