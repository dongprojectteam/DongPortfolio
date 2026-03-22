import { spawn, type ChildProcess } from 'node:child_process';
import { watch } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const electronBinary = path.join(
  projectRoot,
  'node_modules',
  'electron',
  'dist',
  process.platform === 'win32' ? 'electron.exe' : 'electron'
);

const watchTargets = [
  path.join(projectRoot, 'dist', 'main'),
  path.join(projectRoot, 'dist', 'preload')
];

let electronProcess: ChildProcess | null = null;
let restartRequested = false;
let restartTimer: NodeJS.Timeout | null = null;

const startElectron = (): void => {
  electronProcess = spawn(electronBinary, ['.'], {
    cwd: projectRoot,
    stdio: 'inherit'
  });

  electronProcess.once('exit', (code, signal) => {
    electronProcess = null;

    if (restartRequested) {
      restartRequested = false;
      startElectron();
      return;
    }

    if (signal) {
      process.exit(0);
      return;
    }

    process.exit(code ?? 0);
  });
};

const requestRestart = (): void => {
  if (restartTimer) {
    clearTimeout(restartTimer);
  }

  restartTimer = setTimeout(() => {
    restartTimer = null;

    if (!electronProcess) {
      startElectron();
      return;
    }

    restartRequested = true;
    electronProcess.kill();
  }, 150);
};

const watchers = watchTargets.map((target) =>
  watch(
    target,
    {
      recursive: true
    },
    () => {
      requestRestart();
    }
  )
);

const shutdown = (): void => {
  watchers.forEach((watcher) => watcher.close());

  if (restartTimer) {
    clearTimeout(restartTimer);
    restartTimer = null;
  }

  if (electronProcess) {
    electronProcess.kill();
  }

  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startElectron();
