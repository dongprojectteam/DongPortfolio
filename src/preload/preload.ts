import { contextBridge, ipcRenderer } from 'electron';
import type { HtmlExportPayload, HtmlExportResult } from '../shared/export';
import type { PortfolioDocument } from '../shared/portfolio';
import type {
  PortfolioLoadResult,
  PortfolioSaveResult
} from '../shared/persistence';

export type AppInfo = {
  name: string;
  version: string;
};

const appInfo: AppInfo = {
  name: 'Dong Portfolio',
  version: '0.1.0'
};

contextBridge.exposeInMainWorld('desktopApp', {
  getAppInfo: (): AppInfo => appInfo,
  savePortfolio: (portfolio: PortfolioDocument): Promise<PortfolioSaveResult> =>
    ipcRenderer.invoke('save-portfolio', portfolio),
  loadPortfolio: (): Promise<PortfolioLoadResult> =>
    ipcRenderer.invoke('load-portfolio'),
  exportHtml: (payload: HtmlExportPayload): Promise<HtmlExportResult> =>
    ipcRenderer.invoke('export:html', payload)
});
