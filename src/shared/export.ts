import type { FontId, ThemeId } from '../renderer/theme/types';
import type { PortfolioPage } from '../renderer/templates/types';

export interface HtmlExportPayload {
  documentTitle: string;
  themeId: ThemeId;
  fontId: FontId;
  pages: PortfolioPage[];
}

export interface HtmlExportResult {
  canceled: boolean;
  filePath?: string;
}
