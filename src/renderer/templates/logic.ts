import { templateRegistry } from './registry';
import type { PortfolioPage, TemplateId } from './types';

export const getTemplateForImageCount = (imageCount: number): TemplateId => {
  if (imageCount <= 1) {
    return 'hero';
  }

  if (imageCount === 2) {
    return 'split';
  }

  return 'grid';
};

export const getAllowedTemplates = (imageCount: number) =>
  Object.values(templateRegistry).filter((template) => {
    const meetsMin = imageCount >= template.minImages;
    const meetsMax =
      template.maxImages === null || imageCount <= template.maxImages;

    return meetsMin && meetsMax;
  });

export const resolveTemplateForPage = (page: PortfolioPage): TemplateId => {
  const allowed = getAllowedTemplates(page.images.length);

  if (allowed.some((template) => template.id === page.selectedTemplate)) {
    return page.selectedTemplate;
  }

  return getTemplateForImageCount(page.images.length);
};
