/**
 * Solvia Bot Router — Cloudflare Worker
 * 
 * Routes bot/crawler traffic to pre-rendered static HTML in R2.
 * Routes human traffic to the Lovable SPA origin.
 * Redirects www.thesolvia.com → thesolvia.com.
 */

// The Lovable SPA origin — fetch human traffic here to avoid Cloudflare O2O routing
// that would otherwise bypass this Worker when the DNS A record points to Lovable's CF IP.
const LOVABLE_ORIGIN = 'https://solvia-flexkapg.lovable.app';
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
  const directFiles = ['sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt', '.well-known/llms.txt'];
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
      // Human user → proxy to Lovable origin explicitly.
      // Using LOVABLE_ORIGIN instead of fetch(request) avoids Cloudflare's O2O
      // fast-path which would route around this Worker when the zone's A record
      // points to another Cloudflare-hosted zone.
      const originUrl = new URL(LOVABLE_ORIGIN);
      originUrl.pathname = url.pathname;
      originUrl.search = url.search;
      // Fetch from Lovable origin with minimal headers to avoid redirect loop.
      // Lovable redirects to thesolvia.com if it sees the custom domain Host header.
      const proxyResponse = await fetch(originUrl.toString(), {
        method: request.method,
        headers: {
          'Accept': request.headers.get('Accept') || '*/*',
          'Accept-Language': request.headers.get('Accept-Language') || 'en',
          'User-Agent': userAgent,
        },
        redirect: 'follow',
      });
      // Return response with original headers but rewrite any Location headers
      return new Response(proxyResponse.body, proxyResponse);
    }

    // --- Step 2.5: Noindex for ?lang= duplicates on non-blog pages ---
    // Blog posts have proper language-specific slugs. Main pages use ?lang= which
    // creates duplicate content. Tell bots not to index these.
    if (url.searchParams.has('lang') && !url.pathname.startsWith('/blog/')) {
      const originResponse = await fetch(request);
      const response = new Response(originResponse.body, originResponse);
      response.headers.set('X-Robots-Tag', 'noindex, follow');
      response.headers.set('X-Served-By', 'cloudflare-worker-noindex');
      return response;
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

    // --- Step 4: No R2 match — fall through to Lovable origin ---
    // This handles routes without static mirrors (e.g., /auth, /dashboard)
    const fallbackUrl = new URL(LOVABLE_ORIGIN);
    fallbackUrl.pathname = url.pathname;
    fallbackUrl.search = url.search;
    const originResponse = await fetch(fallbackUrl.toString(), {
      method: request.method,
      headers: {
        'Accept': request.headers.get('Accept') || '*/*',
        'Accept-Language': request.headers.get('Accept-Language') || 'en',
        'User-Agent': request.headers.get('User-Agent') || '',
      },
      redirect: 'follow',
    });

    // Add header so we can debug which path was taken
    const response = new Response(originResponse.body, originResponse);
    response.headers.set('X-Served-By', 'cloudflare-worker-origin-fallback');
    return response;
  },
};
