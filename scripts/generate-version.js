import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const distPath = path.resolve(process.cwd(), 'dist');
const versionFilePath = path.join(distPath, 'version.json');

try {
  const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
  const buildTime = new Date().toISOString();
  
  const versionData = {
    version: commitHash,
    buildTime: buildTime,
    environment: 'production'
  };

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));
  console.log(`✅ version.json generated: ${commitHash} at ${buildTime}`);
} catch (error) {
  console.warn('⚠️  Could not generate version.json (git hash missing?):', error.message);
  // Fallback to timestamp only
  fs.writeFileSync(versionFilePath, JSON.stringify({
    version: 'dev-' + Date.now(),
    buildTime: new Date().toISOString()
  }, null, 2));
}
