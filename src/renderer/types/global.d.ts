import type { AppInfo } from '../../preload/preload';
import type { HtmlExportPayload, HtmlExportResult } from '../../shared/export';
import type { PortfolioDocument } from '../../shared/portfolio';
import type {
  PortfolioLoadResult,
  PortfolioSaveResult
} from '../../shared/persistence';

declare global {
  interface Window {
    desktopApp: {
      getAppInfo: () => AppInfo;
      savePortfolio: (portfolio: PortfolioDocument) => Promise<PortfolioSaveResult>;
      loadPortfolio: () => Promise<PortfolioLoadResult>;
      exportHtml: (payload: HtmlExportPayload) => Promise<HtmlExportResult>;
    };
  }
}

export {};
