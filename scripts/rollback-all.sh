#!/bin/bash
# Staff-Level Atomic Rollback Script for React Frontend
# Reverts the /var/www/react-app symlink to the previous timestamped folder

set -e

PEM_KEY="${DEPLOY_PEM}"
REMOTE_USER="ubuntu"
BASE_DIR="/var/www"
REMOTE_DIR="$BASE_DIR/react-app"
RELEASES_DIR="$BASE_DIR/releases"

IPS_STR="${DEPLOY_HOSTS:-43.205.233.181,13.201.61.117}"
IFS=',' read -ra ADDR <<< "$IPS_STR"

if [ -z "$PEM_KEY" ] || [ ! -f "$PEM_KEY" ]; then
    echo "❌ Error: DEPLOY_PEM environment variable must point to a valid .pem file."
    exit 1
fi

echo "🔄 Starting Atomic Rollback..."

for IP in "${ADDR[@]}"; do
    echo "----------------------------------------"
    echo "📦 Rolling back Node: $IP"
    
    ssh -o StrictHostKeyChecking=no -i "$PEM_KEY" "$REMOTE_USER@$IP" << ENDSSH
        set -e
        # Find the second-most-recent release folder
        PREV_RELEASE=\$(ls -1tr $RELEASES_DIR | tail -n 2 | head -n 1)
        
        if [ -z "\$PREV_RELEASE" ] || [ "\$PREV_RELEASE" == "\$(readlink $REMOTE_DIR | xargs basename)" ]; then
            echo "❌ No previous release found to rollback to on $IP."
            exit 1
        fi
        
        echo "  -> Reverting to: $RELEASES_DIR/\$PREV_RELEASE"
        sudo ln -sfn "$RELEASES_DIR/\$PREV_RELEASE" "$REMOTE_DIR"
        sudo chown -h www-data:www-data "$REMOTE_DIR"
        
        # Verify and reload Nginx
        sudo nginx -t && sudo systemctl reload nginx
        echo "  ✅ Node $IP rolled back successfully."
ENDSSH
done

echo "----------------------------------------"
echo "✅ Rollback complete to all nodes!"
