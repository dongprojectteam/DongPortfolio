import type { AppInfo } from '../../preload/preload';
import type { HtmlExportPayload, HtmlExportResult } from '../../shared/export';

declare global {
  interface Window {
    desktopApp: {
      getAppInfo: () => AppInfo;
      exportHtml: (payload: HtmlExportPayload) => Promise<HtmlExportResult>;
    };
  }
}

export {};
