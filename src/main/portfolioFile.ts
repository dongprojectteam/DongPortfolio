import { dialog, ipcMain } from 'electron';
import fs from 'node:fs/promises';
import { createEmptyPortfolio, isPortfolioDocument } from '../shared/portfolio';
import type { PortfolioLoadResult, PortfolioSaveResult } from '../shared/persistence';
import type { PortfolioDocument } from '../shared/portfolio';

const ensurePortfolioHasPages = (portfolio: PortfolioDocument): PortfolioDocument => {
  if (portfolio.pages.length > 0) {
    return portfolio;
  }

  return createEmptyPortfolio();
};

export const registerPortfolioFileIpc = (): void => {
  const handleSavePortfolio = async (
    _event: Electron.IpcMainInvokeEvent,
    portfolio: PortfolioDocument
  ): Promise<PortfolioSaveResult> => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save Portfolio',
      defaultPath: 'portfolio.json',
      filters: [{ name: 'JSON Files', extensions: ['json'] }]
    });

    if (canceled || !filePath) {
      return { canceled: true };
    }

    await fs.writeFile(filePath, JSON.stringify(portfolio, null, 2), 'utf8');

    return {
      canceled: false,
      filePath
    };
  };

  const handleLoadPortfolio = async (): Promise<PortfolioLoadResult> => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Load Portfolio',
      properties: ['openFile'],
      filters: [{ name: 'JSON Files', extensions: ['json'] }]
    });

    if (canceled || filePaths.length === 0) {
      return { canceled: true };
    }

    const [filePath] = filePaths;
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;

    if (!isPortfolioDocument(parsed)) {
      throw new Error('Selected file is not a valid portfolio document.');
    }

    return {
      canceled: false,
      filePath,
      portfolio: ensurePortfolioHasPages(parsed)
    };
  };

  ipcMain.handle('save-portfolio', handleSavePortfolio);
  ipcMain.handle('load-portfolio', handleLoadPortfolio);

  ipcMain.handle('portfolio:save', handleSavePortfolio);
  ipcMain.handle('portfolio:load', handleLoadPortfolio);
};
