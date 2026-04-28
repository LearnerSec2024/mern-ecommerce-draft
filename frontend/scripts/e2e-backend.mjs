import { spawn, spawnSync } from 'node:child_process';
import net from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendDir = resolve(__dirname, '..');
const backendDir = resolve(frontendDir, '..', 'backend');

const backendPort = process.env.PLAYWRIGHT_BACKEND_PORT || process.env.PORT || '5000';
const frontendUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5173';
const mongoHost = process.env.E2E_MONGO_HOST || '127.0.0.1';
const mongoPort = Number(process.env.E2E_MONGO_PORT || 27017);
const mongoUri = process.env.E2E_MONGO_URI || `mongodb://${mongoHost}:${mongoPort}/mern_ecommerce_e2e`;

const wait = (ms) => new Promise((resolveWait) => setTimeout(resolveWait, ms));

const canConnect = (host, port) =>
  new Promise((resolveConnect) => {
    const socket = net.createConnection({ host, port, timeout: 1500 }, () => {
      socket.destroy();
      resolveConnect(true);
    });

    socket.on('error', () => resolveConnect(false));

    socket.on('timeout', () => {
      socket.destroy();
      resolveConnect(false);
    });
  });

const waitForMongo = async () => {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    if (await canConnect(mongoHost, mongoPort)) {
      return true;
    }

    await wait(1000);
  }

  return false;
};

const tryStartMongoWindowsService = () => {
  if (process.platform !== 'win32') {
    return;
  }

  console.log('MongoDB is not listening yet. Trying to start the Windows MongoDB service...');

  const command = `
    $service = Get-Service MongoDB -ErrorAction SilentlyContinue;
    if (-not $service) { throw 'MongoDB Windows service was not found'; }
    if ($service.Status -ne 'Running') { Start-Service MongoDB; }
  `;

  const result = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', command], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(
      'Could not start the MongoDB Windows service. Start MongoDB manually or install it as a Windows service.',
    );
  }
};

const main = async () => {
  console.log(`Checking MongoDB at ${mongoHost}:${mongoPort}...`);

  if (!(await canConnect(mongoHost, mongoPort))) {
    tryStartMongoWindowsService();
  }

  if (!(await waitForMongo())) {
    throw new Error(`MongoDB did not become available at ${mongoHost}:${mongoPort}.`);
  }

  const env = {
    ...process.env,
    NODE_ENV: 'test',
    PORT: backendPort,
    FRONTEND_URL: frontendUrl,
    MONGO_URI: mongoUri,
    JWT_SECRET: process.env.JWT_SECRET || 'playwright-e2e-local-secret-change-me',
  };

  console.log(`Seeding isolated E2E database: ${mongoUri}`);

  const seed = spawnSync(process.execPath, ['seed/productSeeder.js'], {
    cwd: backendDir,
    env,
    encoding: 'utf8',
  });

  if (seed.stdout) {
    console.log(seed.stdout);
  }

  if (seed.stderr) {
    console.error(seed.stderr);
  }

  if (seed.error) {
    throw seed.error;
  }

  if (seed.status !== 0) {
    throw new Error(`Database seed failed with exit code ${seed.status}.`);
  }

  console.log(`Starting backend API on http://127.0.0.1:${backendPort}`);

  const backend = spawn(process.execPath, ['server.js'], {
    cwd: backendDir,
    env,
    stdio: 'inherit',
  });

  const shutdown = () => {
    if (!backend.killed) {
      backend.kill('SIGTERM');
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('exit', shutdown);

  backend.on('exit', (code) => {
    process.exit(code ?? 0);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
