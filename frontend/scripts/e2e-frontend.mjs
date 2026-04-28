import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendDir = resolve(__dirname, '..');

const frontendUrl = new URL(process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5173');
const backendUrl = process.env.PLAYWRIGHT_BACKEND_URL || 'http://127.0.0.1:5000';

const host = frontendUrl.hostname || '127.0.0.1';
const port = frontendUrl.port || '5173';

const env = {
  ...process.env,
  VITE_API_URL: process.env.VITE_API_URL || `${backendUrl}/api`,
};

const viteBin = resolve(frontendDir, 'node_modules', 'vite', 'bin', 'vite.js');

console.log(`Starting Vite frontend on ${frontendUrl.origin}`);
console.log(`Using backend API URL ${env.VITE_API_URL}`);

const frontend = spawn(process.execPath, [viteBin, '--host', host, '--port', port], {
  cwd: frontendDir,
  env,
  stdio: 'inherit',
});

const shutdown = () => {
  if (!frontend.killed) {
    frontend.kill('SIGTERM');
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);

frontend.on('exit', (code) => {
  process.exit(code ?? 0);
});
