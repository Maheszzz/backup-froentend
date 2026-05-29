#!/bin/bash
# Staff-Level Rolling Deployment Script for React Frontend
# Usage: DEPLOY_PEM=~/key.pem DEPLOY_HOSTS=node1,node2 ./scripts/deploy-all.sh

set -e

# Configuration (mandates env vars for security)
PEM_KEY="${DEPLOY_PEM}"
REMOTE_USER="ubuntu"
BASE_DIR="/var/www"
REMOTE_DIR="$BASE_DIR/react-app"
RELEASES_DIR="$BASE_DIR/releases"
BUILD_DIR="dist"

# Default inventory if not provided
IPS_STR="${DEPLOY_HOSTS:-13.201.61.117,13.203.198.175,13.234.34.152}"
IFS=',' read -ra ADDR <<< "$IPS_STR"

# Security check
if [ -z "$PEM_KEY" ] || [ ! -f "$PEM_KEY" ]; then
    echo "❌ Error: DEPLOY_PEM environment variable must point to a valid .pem file."
    exit 1
fi

echo "🚀 Starting Staff-Level Rolling Deployment..."
echo "📍 Target Nodes: ${IPS_STR}"

if [ ! -d "$BUILD_DIR" ]; then
    echo "🔨 Building project first..."
    npm run build
fi

TIMESTAMP=$(date +%Y%m%d%H%M%S)
RELEASE_FOLDER="$RELEASES_DIR/release-$TIMESTAMP"

for IP in "${ADDR[@]}"; do
    echo "----------------------------------------"
    echo "📦 Node: $IP"
    
    echo "  -> Preparing release folder: $RELEASE_FOLDER"
    ssh -o StrictHostKeyChecking=no -i "$PEM_KEY" "$REMOTE_USER@$IP" "sudo mkdir -p $RELEASES_DIR && sudo mkdir -p $RELEASE_FOLDER && sudo chown -R $REMOTE_USER:$REMOTE_USER $RELEASES_DIR"
    
    echo "  -> Syncing build to node..."
    rsync -az --delete \
        -e "ssh -o StrictHostKeyChecking=no -i \"$PEM_KEY\"" \
        "$BUILD_DIR/" "$REMOTE_USER@$IP:$RELEASE_FOLDER/"

    echo "  -> Activating release (Symlink Switch)..."
    ssh -o StrictHostKeyChecking=no -i "$PEM_KEY" "$REMOTE_USER@$IP" << ENDSSH
        set -e
        # Switch symlink atomically
        sudo ln -sfn "$RELEASE_FOLDER" "$REMOTE_DIR"
        sudo chown -h www-data:www-data "$REMOTE_DIR"
        
        # Keep only last 5 releases to save disk
        cd $RELEASES_DIR && ls -1tr | head -n -5 | xargs -r sudo rm -rf
        
        if systemctl list-unit-files makemystay-next.service >/dev/null 2>&1; then
            sudo systemctl restart makemystay-next
        elif [ -f "$REMOTE_DIR/server.js" ]; then
            pkill -f "$REMOTE_DIR/server.js" 2>/dev/null || true
            sleep 1
            cd "$REMOTE_DIR" && nohup env NODE_ENV=production PORT=3000 node server.js >> /tmp/makemystay-next.log 2>&1 &
        fi

        sudo nginx -t && sudo systemctl reload nginx
ENDSSH

    echo "  -> Node Health Validation..."
    # Local verification via HTTP (bypasses ALB to check specific node)
    HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: makemystay.ai" "http://$IP/health.json")
    if [ "$HEALTH_CHECK" != "200" ]; then
        echo "❌ Node Health Check FAILED (HTTP $HEALTH_CHECK). ABORTING ROLLOUT."
        echo "⚠️  CRITICAL: Deployment paused. Node $IP is in a potentially bad state."
        # Automatic rollback for this node? (Future implementation could add this)
        exit 1
    fi
    
    echo "  ✅ Node $IP is HEALTHY. Moving to next target..."
done

echo "----------------------------------------"
echo "✅ Rolling deployment complete to all nodes!"
