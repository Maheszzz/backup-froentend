#!/usr/bin/env bash
# One-time setup on each EC2 node: systemd unit for Next standalone.
set -e

APP_DIR="${APP_DIR:-/var/www/react-app}"
UNIT_NAME=makemystay-next.service
NODE_BIN="$(command -v node || true)"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash $0"
  exit 1
fi

if [[ -z "$NODE_BIN" ]]; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
  NODE_BIN="$(command -v node)"
fi

echo "Node: $($NODE_BIN -v)"

cat > "/etc/systemd/system/$UNIT_NAME" << UNIT
[Unit]
Description=MakeMyStay Next.js (standalone)
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=$NODE_BIN $APP_DIR/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable "$UNIT_NAME"
systemctl restart "$UNIT_NAME"
systemctl --no-pager status "$UNIT_NAME" || true

echo "✅ $UNIT_NAME installed (PORT=3000, app=$APP_DIR)"
