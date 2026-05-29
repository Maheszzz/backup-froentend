#!/usr/bin/env bash

# Server Cleanup Script for makemystay.ai EC2
# Frees up disk space and optimizes server health.

echo "🧹 Starting server cleanup..."

# 1. Vacuum journal logs (keep only last 7 days)
echo "📜 Vacuuming journalctl logs..."
sudo journalctl --vacuum-time=7d

# 2. Clean up apt cache and old packages
echo "📦 Cleaning up apt packages..."
sudo apt-get autoremove -y
sudo apt-get clean

# 3. Check disk usage and list top 10 largest files/dirs in /var/log
echo "📊 Disk usage summary:"
df -h /
echo "📂 Top 10 largest log files/directories:"
sudo du -sh /var/log/* | sort -rh | head -10

# 4. Check memory and swap usage
echo "🧠 Memory and swap usage:"
free -m

echo "✅ Cleanup complete."
