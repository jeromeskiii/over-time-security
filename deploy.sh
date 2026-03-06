#!/bin/bash

echo "Pulling latest code..."
git pull origin main

echo "Installing deps..."
npm install

echo "Building site..."
npm run build

echo "Restarting server..."
pm2 restart ecosystem.config.cjs

if [ -n "$CLOUDFLARE_ZONE_ID" ] && [ -n "$CLOUDFLARE_API_TOKEN" ]; then
  echo "Purging Cloudflare cache..."
  curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}'
  echo
fi

echo "Deploy complete."
