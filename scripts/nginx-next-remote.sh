#!/usr/bin/env bash
# Push Next.js nginx config to all hosts in .env.production
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export $(grep -v '^#' .env.production | xargs)
PEM_KEY="${PEM_KEY:?}"
IFS=',' read -ra HOSTS <<< "${DEPLOY_HOST:?}"
CONF="$ROOT/deploy/nginx-makemystay-all.conf"

for HOST in "${HOSTS[@]}"; do
  HOST=$(echo "$HOST" | xargs)
  echo "📡 $HOST"
  scp -o StrictHostKeyChecking=no -i "$PEM_KEY" "$CONF" "ubuntu@$HOST:/tmp/makemystay_all.conf"
  ssh -o StrictHostKeyChecking=no -i "$PEM_KEY" "ubuntu@$HOST" \
    'sudo cp /tmp/makemystay_all.conf /etc/nginx/sites-available/makemystay_all && \
     sudo ln -sf /etc/nginx/sites-available/makemystay_all /etc/nginx/sites-enabled/makemystay_all && \
     sudo nginx -t && sudo systemctl reload nginx'
done
echo "✅ nginx → proxy_pass :3000 on all hosts"
