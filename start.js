#!/usr/bin/env node
/**
 * HPPY startup script — starts backend + expo with one command.
 *
 * Usage: npm start
 *
 * Uses tunnel mode so the app works on any network (public WiFi, eduroam, etc.)
 * without needing devices to be able to reach each other directly.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('\n\x1b[35mHPPY starting up...\x1b[0m');
console.log('\x1b[90mSetting up tunnels — this may take a few seconds...\x1b[0m\n');

// ─── Spawn helpers ──────────────────────────────────────────────────────────
const processes = [];

function spawnProcess(label, color, command, args, cwd) {
  const child = spawn(command, args, {
    cwd: cwd || __dirname,
    shell: true,
    env: { ...process.env },
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().trimEnd().split('\n');
    lines.forEach(line => console.log(`${color}[${label}]\x1b[0m ${line}`));
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trimEnd().split('\n');
    lines.forEach(line => console.error(`${color}[${label}]\x1b[0m ${line}`));
  });

  child.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.log(`${color}[${label}]\x1b[0m exited with code ${code}`);
    }
  });

  processes.push(child);
  return child;
}

// ─── Graceful shutdown on Ctrl+C ─────────────────────────────────────────────
function shutdown() {
  console.log('\n\x1b[35mShutting down...\x1b[0m');
  processes.forEach(p => {
    try { process.kill(p.pid); } catch (_) {}
  });
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  // 1. Start the backend server
  spawnProcess(
    'backend',
    '\x1b[33m', // yellow
    'node',
    ['src/index.js'],
    path.join(__dirname, 'backend')
  );

  // 2. Wait for backend to start, then create a public tunnel for it
  await new Promise(resolve => setTimeout(resolve, 1500));

  let backendUrl;
  try {
    const localtunnel = require('localtunnel');
    const tunnel = await localtunnel({ port: 3000 });
    backendUrl = `${tunnel.url}/api`;
    console.log(`\x1b[33m[backend]\x1b[0m Public URL: \x1b[4m${tunnel.url}\x1b[0m`);
    tunnel.on('close', () => console.log('\x1b[33m[backend]\x1b[0m tunnel closed'));
  } catch (err) {
    console.error('\x1b[31m[error]\x1b[0m Failed to create backend tunnel:', err.message);
    console.error('\x1b[31m[error]\x1b[0m Make sure you have an internet connection');
    process.exit(1);
  }

  // 3. Start Expo with --tunnel and inject the backend URL
  const expo = spawn('npx', ['expo', 'start', '--tunnel'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, EXPO_PUBLIC_API_URL: backendUrl },
  });
  processes.push(expo);
  expo.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.log('\x1b[36m[expo]\x1b[0m exited with code', code);
    }
  });
}

main();

