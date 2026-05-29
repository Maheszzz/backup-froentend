#!/usr/bin/env bash
# Run from laptop: ./scripts/diagnose-makemystay-504.sh
# On EC2 (nginx origin):   sudo ./scripts/diagnose-makemystay-504.sh --origin
#
# See nginx_frontend_and_api.conf and deploy/prerender-hosts.md.

set -euo pipefail

HOST="${HOST:-makemystay.ai}"
BASE="https://${HOST}/"

run_local() {
  echo "=== DNS ==="
  host "$HOST" 2>/dev/null || true
  echo ""
  echo "=== curl default UA (max 15s) ==="
  curl --max-time 15 -sS -D - -o /dev/null "$BASE" 2>&1 || true
  echo ""
  echo "=== curl Googlebot UA (max 15s) ==="
  curl --max-time 15 -sS -D - -o /dev/null \
    -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
    "$BASE" 2>&1 || true
  echo ""
  echo "Interpretation:"
  echo "  - If both time out with 0 bytes: edge (ALB/Cloudflare) likely cannot get a timely response from origin."
  echo "  - Check: target group health, security groups, nginx running, correct listener port, disk full."
  echo "  - If only Googlebot fails: Prerender.io path — verify X-Prerender-Token and nginx proxy_read_timeout."
  echo "  - Response headers: cf-ray => Cloudflare; Server: nginx => reached origin nginx."
}

run_origin() {
  echo "=== nginx -t ==="
  sudo nginx -t
  echo ""
  echo "=== prerender token snippet ==="
  if sudo test -s /etc/nginx/snippets/prerender_token.conf; then
    echo "present: /etc/nginx/snippets/prerender_token.conf"
  else
    echo "missing/empty: /etc/nginx/snippets/prerender_token.conf"
  fi
  echo ""
  echo "=== nginx error.log (last 80) ==="
  sudo tail -n 80 /var/log/nginx/error.log 2>&1 || true
  echo ""
  echo "=== static index (common roots) ==="
  for p in /var/www/react-app/index.html /var/www/makemystay/index.html; do
    if [[ -f "$p" ]]; then ls -la "$p"; else echo "missing: $p"; fi
  done
  echo ""
  echo "=== curl loopback HTTP (Host: $HOST) ==="
  curl --max-time 8 -sS -D - -o /dev/null -H "Host: ${HOST}" http://127.0.0.1/ 2>&1 || true
  echo ""
  echo "=== backend /health (if uvicorn on 8000) ==="
  curl --max-time 5 -sS -D - -o /dev/null http://127.0.0.1:8000/health 2>&1 || true
}

if [[ "${1:-}" == "--origin" ]]; then
  run_origin
else
  run_local
fi
