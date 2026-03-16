import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE_URL = 'https://solvia-flexkapg.lovable.app';
const LANGS = ['en', 'de', 'fr', 'es', 'ru'];

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/vacancies', priority: '0.9', changefreq: 'daily' },
  { path: '/homologation', priority: '0.9', changefreq: 'monthly' },
  { path: '/employers', priority: '0.9', changefreq: 'weekly' },
  { path: '/learning', priority: '0.8', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/visa-info', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/professionals', priority: '0.7', changefreq: 'weekly' },
  { path: '/community', priority: '0.7', changefreq: 'daily' },
  { path: '/signup', priority: '0.6', changefreq: 'monthly' },
  { path: '/login', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/impressum', priority: '0.3', changefreq: 'yearly' },
];

function hreflangBlock(path: string): string {
  return LANGS.map(lang =>
    `    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}${path}${path.includes('?') ? '&' : '?'}lang=${lang}"/>`
  ).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${path}"/>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch published blog posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, language, updated_at, post_group_id')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // Static pages
    for (const page of STATIC_PAGES) {
      xml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${hreflangBlock(page.path)}
  </url>\n`;
    }

    // Blog posts
    if (posts && posts.length > 0) {
      // Group posts by post_group_id for hreflang linking
      const groupMap = new Map<string, typeof posts>();
      for (const post of posts) {
        if (post.post_group_id) {
          if (!groupMap.has(post.post_group_id)) groupMap.set(post.post_group_id, []);
          groupMap.get(post.post_group_id)!.push(post);
        }
      }

      for (const post of posts) {
        const lastmod = post.updated_at ? post.updated_at.split('T')[0] : today;
        const postPath = `/blog/${post.slug}`;

        xml += `  <url>
    <loc>${BASE_URL}${postPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>\n`;

        // Add hreflang links for translations
        if (post.post_group_id && groupMap.has(post.post_group_id)) {
          const siblings = groupMap.get(post.post_group_id)!;
          for (const sibling of siblings) {
            xml += `    <xhtml:link rel="alternate" hreflang="${sibling.language}" href="${BASE_URL}/blog/${sibling.slug}"/>\n`;
          }
        }

        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new Response('Error generating sitemap', { status: 500, headers: corsHeaders });
  }
});
