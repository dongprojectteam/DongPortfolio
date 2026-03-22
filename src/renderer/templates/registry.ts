import { GridTemplate } from './GridTemplate';
import { HeroTemplate } from './HeroTemplate';
import { SplitTemplate } from './SplitTemplate';
import type { TemplateDefinition, TemplateId } from './types';

export const templateRegistry: Record<TemplateId, TemplateDefinition> = {
  hero: {
    id: 'hero',
    label: 'Hero Layout',
    description: 'Single-image presentation with prominent copy.',
    minImages: 1,
    maxImages: 1,
    component: HeroTemplate
  },
  split: {
    id: 'split',
    label: 'Split Layout',
    description: 'Balanced two-image layout with content header.',
    minImages: 2,
    maxImages: 2,
    component: SplitTemplate
  },
  grid: {
    id: 'grid',
    label: 'Grid Collage',
    description: 'Three or more images arranged as a gallery collage.',
    minImages: 3,
    maxImages: null,
    component: GridTemplate
  }
};

export const templateList = Object.values(templateRegistry);
