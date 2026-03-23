# Solvia Cloudflare Worker — Deployment Guide

## Architecture

```
User/Bot request → Cloudflare DNS (proxied)
                       │
                       ▼
              Cloudflare Worker
                    │         │
            Bot detected?     Human?
                    │         │
                    ▼         ▼
              R2 Bucket    Lovable Origin
           (static HTML)   (SPA at 185.158.133.1)
```

- **Bots** (Googlebot, GPTBot, etc.) receive fully rendered static HTML from R2
- **Humans** get proxied to the Lovable SPA as normal
- **www.thesolvia.com** → **thesolvia.com** 301 redirect for all requests

---

## Step 1: Add Domain to Cloudflare

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **"Add a Site"** → enter `thesolvia.com`
3. Select the **Free** plan (sufficient for Workers + R2)
4. Cloudflare assigns two nameservers (e.g., `ann.ns.cloudflare.com`, `bob.ns.cloudflare.com`)

### Add DNS Records BEFORE Switching Nameservers

In the Cloudflare DNS dashboard, add:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `185.158.133.1` | ✅ Proxied (orange cloud) |
| A | `www` | `185.158.133.1` | ✅ Proxied (orange cloud) |
| TXT | `_lovable` | `lovable_verify=YOUR_VALUE` | DNS only |

> **Find your `_lovable` TXT value**: Check your current DNS provider or Lovable project settings → Domains.

### Set SSL Mode

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full** (not Full Strict, since Lovable's origin may not have a matching cert for your domain)

### Switch Nameservers

1. Go to your domain registrar (e.g., Namecheap, GoDaddy, Google Domains)
2. Replace nameservers with the two Cloudflare assigned ones
3. Wait for propagation (usually 1–24 hours)

### Verify

```bash
dig thesolvia.com NS
# Should show Cloudflare nameservers

dig thesolvia.com A
# Should show Cloudflare proxy IPs (not 185.158.133.1 directly)

curl -sI https://thesolvia.com | grep server
# Should show: server: cloudflare
```

---

## Step 2: Create R2 Bucket

```bash
# Install wrangler if not already installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create the R2 bucket
wrangler r2 bucket create solvia-static-pages
```

---

## Step 3: Upload Static Files

Clone your Lovable repo locally, then run:

```bash
cd /path/to/your-lovable-repo
bash cloudflare-worker/upload-to-r2.sh
```

This uploads:
- `public/home/index.html` → homepage for bots
- `public/blog/index.html` → blog listing
- `public/blog/*/index.html` → all blog articles (100+)
- `public/{about,contact,...}/index.html` → section pages
- `public/sitemap.xml` → XML sitemap
- `public/robots.txt` → robots directives
- `public/llms.txt`, `public/llms-full.txt` → AI model feeds

### Verify Upload

```bash
# List objects in bucket
wrangler r2 object list solvia-static-pages --prefix blog/ | head -20

# Check a specific object
wrangler r2 object get solvia-static-pages/blog/doctor-salary-germany-2026/index.html | head -5
```

---

## Step 4: Deploy the Worker

```bash
cd cloudflare-worker
wrangler deploy
```

### Add Route Triggers

In the Cloudflare Dashboard:

1. Go to **Workers & Pages** → **solvia-bot-router**
2. Click **Settings** → **Triggers** → **Routes**
3. Add two routes:
   - `thesolvia.com/*` → `solvia-bot-router`
   - `www.thesolvia.com/*` → `solvia-bot-router`

> **Important**: Both routes must be added. The Worker handles the www redirect.

---

## Step 5: Verify Everything

### Test www redirect
```bash
curl -sI https://www.thesolvia.com/ | head -5
# Should show: HTTP/2 301
# location: https://thesolvia.com/
```

### Test bot gets static HTML
```bash
# Homepage
curl -s -A "Googlebot" https://thesolvia.com/ | grep '<title>'
# Expected: <title>Solvia – Medical License Recognition in Europe | Work as a Doctor Abroad</title>

# Blog listing
curl -s -A "Googlebot" https://thesolvia.com/blog | grep '<title>'
# Expected: a blog-specific title (NOT the generic SPA title)

# Blog article
curl -s -A "Googlebot" https://thesolvia.com/blog/doctor-salary-germany-2026 | grep '<title>'
# Expected: article-specific title

# Check the X-Served-By header
curl -sI -A "Googlebot" https://thesolvia.com/blog | grep x-served-by
# Expected: x-served-by: cloudflare-worker-static
```

### Test human gets SPA
```bash
curl -sI -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" https://thesolvia.com/blog | grep x-served-by
# Expected: x-served-by: cloudflare-worker-origin-fallback
# (or no x-served-by header if the origin doesn't set one)
```

### Test AI crawlers
```bash
curl -s -A "GPTBot/1.0" https://thesolvia.com/blog/doctor-salary-germany-2026 | head -20
# Should return full article HTML

curl -s -A "ClaudeBot" https://thesolvia.com/ | grep '<h1>'
# Should return: <h1>Medical License Recognition in Europe</h1>
```

### Test sitemap
```bash
curl -s -A "Googlebot" https://thesolvia.com/sitemap.xml | head -10
# Should return valid XML sitemap
```

---

## Automated Sync (GitHub Actions)

To automatically sync static files to R2 on every Lovable deploy:

### 1. Copy the workflow file

```bash
mkdir -p .github/workflows
cp cloudflare-worker/sync-r2.yml .github/workflows/sync-r2.yml
```

### 2. Add GitHub Secrets

In your GitHub repo → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Value | Where to find it |
|--------|-------|-------------------|
| `CLOUDFLARE_API_TOKEN` | API token | Cloudflare Dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template + add R2 permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID | Cloudflare Dashboard → right sidebar → Account ID |

### 3. Required API Token Permissions

Create a custom API token with:
- **Account** → **Workers R2 Storage** → **Edit**
- **Zone** → **Workers Routes** → **Edit** (optional, for future route updates)

### 4. Test

Push any change to a file in `public/blog/` and check the Actions tab — the workflow should trigger and upload to R2.

---

## Cache Management

### Cache Timing
- **Browser cache**: 1 hour (`max-age=3600`)
- **Cloudflare edge cache**: 24 hours (`s-maxage=86400`)

### Purge Cache After Content Updates

If you need changes visible immediately:

```bash
# Purge everything (nuclear option)
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Purge specific URLs
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://thesolvia.com/blog/doctor-salary-germany-2026"]}'
```

---

## Troubleshooting

### Worker not intercepting requests
- Verify routes are set in Workers → Triggers
- Make sure DNS is proxied (orange cloud, not grey)
- Check SSL is set to "Full"

### Static file not found (origin fallback)
- Verify the file exists in R2: `wrangler r2 object head solvia-static-pages/blog/slug/index.html`
- Check the R2 key mapping matches (see `pathnameToR2Key` in worker.js)

### www redirect not working
- Ensure `www.thesolvia.com/*` route is added to the Worker
- Ensure the `www` A record exists and is proxied

### Old Wix site showing on www
- The www redirect in the Worker handles this — once the Worker route is active, www will 301 to non-www before reaching any origin
