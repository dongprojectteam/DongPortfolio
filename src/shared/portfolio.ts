import type { PortfolioPage } from '../renderer/templates/types';

export interface PortfolioDocument {
  pages: PortfolioPage[];
}

export const createPageId = (): string =>
  `page-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createImageId = (): string =>
  `image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createEmptyPage = (): PortfolioPage => ({
  id: createPageId(),
  date: new Date().toISOString().slice(0, 10),
  title: '',
  content: '',
  images: [],
  selectedTemplate: 'hero'
});

export const createEmptyPortfolio = (): PortfolioDocument => ({
  pages: [createEmptyPage()]
});

export const isPortfolioDocument = (value: unknown): value is PortfolioDocument => {
  if (!value || typeof value !== 'object' || !('pages' in value)) {
    return false;
  }

  const pages = (value as { pages: unknown }).pages;

  if (!Array.isArray(pages)) {
    return false;
  }

  return pages.every((page) => {
    if (!page || typeof page !== 'object') {
      return false;
    }

    const candidate = page as Record<string, unknown>;

    return (
      typeof candidate.id === 'string' &&
      typeof candidate.date === 'string' &&
      typeof candidate.title === 'string' &&
      typeof candidate.content === 'string' &&
      Array.isArray(candidate.images) &&
      typeof candidate.selectedTemplate === 'string'
    );
  });
};
