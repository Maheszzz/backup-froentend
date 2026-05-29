#!/usr/bin/env bash
# Install makemystay-next.service on all production hosts from .env.production
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE=".env.production"
[[ -f "$ENV_FILE" ]] || { echo "Missing $ENV_FILE"; exit 1; }
export $(grep -v '^#' "$ENV_FILE" | xargs)

PEM_KEY="${PEM_KEY:?Set PEM_KEY in .env.production}"
DEPLOY_HOST="${DEPLOY_HOST:?Set DEPLOY_HOST in .env.production}"
DEPLOY_USER="${DEPLOY_USER:-ubuntu}"
APP_DIR="${DEPLOY_PATH:-/var/www/react-app}"

IFS=',' read -ra HOSTS <<< "$DEPLOY_HOST"
for HOST in "${HOSTS[@]}"; do
  HOST=$(echo "$HOST" | xargs)
  echo "📦 Installing systemd on $HOST..."
  ssh -o StrictHostKeyChecking=no -i "$PEM_KEY" "$DEPLOY_USER@$HOST" \
    "sudo APP_DIR='$APP_DIR' bash -s" < "$ROOT/deploy/install-next-on-ec2.sh"
done

echo "✅ Done on all hosts"
