import type { AppInfo } from '../../preload/preload';

declare global {
  interface Window {
    desktopApp: {
      getAppInfo: () => AppInfo;
    };
  }
}

export {};
