#!/usr/bin/env bash
#
# upload-to-r2.sh — Upload all static HTML files to Cloudflare R2
#
# Usage:
#   cd /path/to/lovable-repo
#   bash cloudflare-worker/upload-to-r2.sh
#
# Prerequisites:
#   - wrangler CLI installed: npm install -g wrangler
#   - Authenticated: wrangler login
#   - R2 bucket created: wrangler r2 bucket create solvia-static-pages
#

set -euo pipefail

BUCKET="solvia-static-pages"
UPLOADED=0
FAILED=0

echo "=== Solvia R2 Upload Script ==="
echo ""

# --- 1. Upload homepage ---
if [ -f "public/home/index.html" ]; then
  echo "Uploading: home/index.html"
  wrangler r2 object put "$BUCKET/home/index.html" \
    --file "public/home/index.html" \
    --content-type "text/html; charset=utf-8" && UPLOADED=$((UPLOADED + 1)) || FAILED=$((FAILED + 1))
fi

# --- 2. Upload blog index ---
if [ -f "public/blog/index.html" ]; then
  echo "Uploading: blog/index.html"
  wrangler r2 object put "$BUCKET/blog/index.html" \
    --file "public/blog/index.html" \
    --content-type "text/html; charset=utf-8" && UPLOADED=$((UPLOADED + 1)) || FAILED=$((FAILED + 1))
fi

# --- 3. Upload all blog articles ---
for file in public/blog/*/index.html; do
  [ -f "$file" ] || continue
  # Extract R2 key: public/blog/doctor-salary/index.html → blog/doctor-salary/index.html
  r2key="${file#public/}"
  echo "Uploading: $r2key"
  wrangler r2 object put "$BUCKET/$r2key" \
    --file "$file" \
    --content-type "text/html; charset=utf-8" && UPLOADED=$((UPLOADED + 1)) || FAILED=$((FAILED + 1))
done

# --- 4. Upload main section pages ---
for dir in about contact employers homologation learning vacancies visa-info; do
  file="public/$dir/index.html"
  if [ -f "$file" ]; then
    r2key="$dir/index.html"
    echo "Uploading: $r2key"
    wrangler r2 object put "$BUCKET/$r2key" \
      --file "$file" \
      --content-type "text/html; charset=utf-8" && UPLOADED=$((UPLOADED + 1)) || FAILED=$((FAILED + 1))
  fi
done

# --- 5. Upload sitemap, robots.txt, llms.txt ---
for file in sitemap.xml robots.txt llms.txt llms-full.txt; do
  if [ -f "public/$file" ]; then
    # Determine content type
    ct="text/plain; charset=utf-8"
    case "$file" in
      *.xml) ct="application/xml; charset=utf-8" ;;
      *.html) ct="text/html; charset=utf-8" ;;
    esac
    echo "Uploading: $file"
    wrangler r2 object put "$BUCKET/$file" \
      --file "public/$file" \
      --content-type "$ct" && UPLOADED=$((UPLOADED + 1)) || FAILED=$((FAILED + 1))
  fi
done

echo ""
echo "=== Upload Complete ==="
echo "  Uploaded: $UPLOADED files"
echo "  Failed:   $FAILED files"
echo ""

if [ "$FAILED" -gt 0 ]; then
  echo "⚠️  Some uploads failed. Check the output above."
  exit 1
else
  echo "✅ All files uploaded successfully."
fi
