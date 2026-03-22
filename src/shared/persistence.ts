import type { PortfolioDocument } from './portfolio';

export interface PortfolioSaveResult {
  canceled: boolean;
  filePath?: string;
}

export interface PortfolioLoadResult {
  canceled: boolean;
  filePath?: string;
  portfolio?: PortfolioDocument;
}
