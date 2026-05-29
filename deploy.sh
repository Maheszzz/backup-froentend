#!/usr/bin/env bash

set -e

# -----------------------------
# ENVIRONMENT SELECTION
# -----------------------------
ENV=${1:-production}
ENV_FILE=".env.$ENV"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ Environment file $ENV_FILE not found"
  exit 1
fi

# Load env file
export $(grep -v '^#' "$ENV_FILE" | xargs)

# -----------------------------
# DEFAULTS
# -----------------------------
DEPLOY_USER=${DEPLOY_USER:-ubuntu}
DEPLOY_GROUP=${DEPLOY_GROUP:-$DEPLOY_USER}
PEM_KEY=${PEM_KEY:-"$HOME/.ssh/mmsr_deploy_key.pem"}
# Sync built static assets only (nginx root). Set DEPLOY_SOURCE=. to rsync the whole repo (legacy).
DEPLOY_SOURCE=${DEPLOY_SOURCE:-dist}
# If true, run sudo mkdir + chown on DEPLOY_PATH before rsync so ubuntu can replace root-owned files.
REMOTE_PREP_OWNERSHIP=${REMOTE_PREP_OWNERSHIP:-true}
DRY_RUN=${DRY_RUN:-false}

# -----------------------------
# VALIDATION
# -----------------------------
if [[ -z "$DEPLOY_HOST" || -z "$DEPLOY_PATH" ]]; then
  echo "❌ Missing required variables (DEPLOY_HOST / DEPLOY_PATH)"
  exit 1
fi

if [[ ! -f "$PEM_KEY" ]]; then
  # It might be an absolute path or relative to home. Let's strictly check.
  # The original script does this so we'll keep it.
  echo "❌ PEM key not found: $PEM_KEY"
  exit 1
fi

# -----------------------------
# FLAGS
# -----------------------------
RSYNC_FLAGS="-avz --delete"
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=60"

if [[ "$DRY_RUN" == true ]]; then
  echo "🧪 DRY RUN MODE"
  RSYNC_FLAGS="$RSYNC_FLAGS --dry-run"
fi

# -----------------------------
# INFO
# -----------------------------
echo "🚀 Deploying to $ENV"
echo "Hosts: $DEPLOY_HOST"
echo "Path: $DEPLOY_PATH"

# -----------------------------
# BUILD STEP
# -----------------------------
echo "📦 Building..."

# Example (uncomment if needed)
npm ci
npm run build

# -----------------------------
# UPLOAD
# -----------------------------
if [[ "$DEPLOY_SOURCE" != "." && ! -d "$DEPLOY_SOURCE" ]]; then
  echo "❌ Build output not found: $DEPLOY_SOURCE (run npm run build first)"
  exit 1
fi

if [[ "$DEPLOY_SOURCE" != "." ]]; then
  for hero_asset in hero-sunset.avif hero-sunset-mobile.avif; do
    if [[ ! -f "${DEPLOY_SOURCE}/public/images/blog/${hero_asset}" ]]; then
      echo "❌ Missing ${DEPLOY_SOURCE}/public/images/blog/${hero_asset}"
      echo "   Run: npm run build  (includes optimize:hero)"
      exit 1
    fi
  done
  echo "✅ Optimized hero assets found in ${DEPLOY_SOURCE}/public"
fi

RSYNC_FROM="./"
if [[ "$DEPLOY_SOURCE" != "." ]]; then
  RSYNC_FROM="${DEPLOY_SOURCE}/"
fi

# Split hosts by comma
IFS=',' read -ra HOSTS <<< "$DEPLOY_HOST"

for HOST in "${HOSTS[@]}"; do
  HOST=$(echo "$HOST" | xargs) # trim whitespace
  
  echo "🔍 Checking SSH connectivity to $HOST..."
  if ! ssh -o ConnectTimeout=5 -o BatchMode=yes -o StrictHostKeyChecking=no -i "$PEM_KEY" "$DEPLOY_USER@$HOST" exit 2>/dev/null; then
    echo "⚠️  Skipping unreachable host: $HOST"
    continue
  fi

  echo "📤 Syncing files to $HOST (${RSYNC_FROM} → $DEPLOY_PATH)..."

  if [[ "$REMOTE_PREP_OWNERSHIP" == true && "$DRY_RUN" != true ]]; then
    echo "🔐 Ensuring deploy user can write $DEPLOY_PATH (sudo on server)..."
    ssh $SSH_OPTS -i "$PEM_KEY" "$DEPLOY_USER@$HOST" \
      "sudo mkdir -p '$DEPLOY_PATH' && sudo chown -R $DEPLOY_USER:$DEPLOY_GROUP '$DEPLOY_PATH'"
  fi

  RSYNC_EXTRA=(--exclude '.git')
  # Standalone dist/ must include its traced node_modules; only skip repo-root node_modules.
  if [[ "$DEPLOY_SOURCE" == "." ]]; then
    RSYNC_EXTRA+=(--exclude 'node_modules')
  fi

  rsync $RSYNC_FLAGS \
    -e "ssh $SSH_OPTS -i $PEM_KEY" \
    "${RSYNC_EXTRA[@]}" \
    "$RSYNC_FROM" "$DEPLOY_USER@$HOST:$DEPLOY_PATH"

  # -----------------------------
  # REMOTE EXECUTION
  # -----------------------------
  echo "⚙️ Running remote commands on $HOST..."

  ssh $SSH_OPTS -i "$PEM_KEY" "$DEPLOY_USER@$HOST" << EOF
    set -e

    cd $DEPLOY_PATH

    echo "🔁 Restarting Next.js app..."
    if systemctl list-unit-files makemystay-next.service >/dev/null 2>&1; then
      sudo systemctl restart makemystay-next
      sudo systemctl is-active makemystay-next
    elif [ -f server.js ]; then
      echo "⚠️  makemystay-next.service missing — restarting node server.js (install once: deploy/install-next-on-ec2.sh)"
      pkill -f "${DEPLOY_PATH}/server.js" 2>/dev/null || true
      sleep 1
      nohup env NODE_ENV=production PORT=3000 node server.js >> /tmp/makemystay-next.log 2>&1 &
      sleep 2
      curl -sf -o /dev/null http://127.0.0.1:3000/health.json && echo "Next.js responding on :3000" || echo "⚠️  health check failed — see /tmp/makemystay-next.log"
    else
      echo "❌ server.js not found in $DEPLOY_PATH"
      exit 1
    fi

    if command -v nginx >/dev/null 2>&1; then
      sudo nginx -t && sudo systemctl reload nginx
    fi

    echo "✅ Server updated"
EOF

done

echo "🎉 Deployment SUCCESS"
