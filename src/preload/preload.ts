import { contextBridge, ipcRenderer } from 'electron';
import type { HtmlExportPayload, HtmlExportResult } from '../shared/export';

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
  exportHtml: (payload: HtmlExportPayload): Promise<HtmlExportResult> =>
    ipcRenderer.invoke('export:html', payload)
});
