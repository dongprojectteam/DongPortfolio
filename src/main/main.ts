import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { registerHtmlExportIpc } from './exportHtml';
import { registerPortfolioFileIpc } from './portfolioFile';

const isDev = !app.isPackaged;

const createMainWindow = async (): Promise<BrowserWindow> => {
  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    show: false,
    backgroundColor: '#f5f1e8',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  window.once('ready-to-show', () => {
    window.show();
  });

  if (isDev) {
    await window.loadURL('http://localhost:5173');
    window.webContents.openDevTools({ mode: 'detach' });
    return window;
  }

  await window.loadFile(path.join(__dirname, '../renderer/index.html'));
  return window;
};

app.whenReady().then(async () => {
  registerPortfolioFileIpc();
  registerHtmlExportIpc();
  await createMainWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
