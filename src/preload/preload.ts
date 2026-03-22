import { contextBridge } from 'electron';

export type AppInfo = {
  name: string;
  version: string;
};

const appInfo: AppInfo = {
  name: 'Dong Portfolio',
  version: '0.1.0'
};

contextBridge.exposeInMainWorld('desktopApp', {
  getAppInfo: (): AppInfo => appInfo
});
