import type React from 'react';

export type TemplateId = 'hero' | 'split' | 'grid';

export interface PortfolioImage {
  id: string;
  src: string;
  alt: string;
  fileName?: string;
}

export interface PortfolioPage {
  id: string;
  date: string;
  title: string;
  content: string;
  images: PortfolioImage[];
  selectedTemplate: TemplateId;
}

export interface TemplateComponentProps {
  page: PortfolioPage;
}

export interface TemplateDefinition {
  id: TemplateId;
  label: string;
  description: string;
  minImages: number;
  maxImages: number | null;
  component: React.ComponentType<TemplateComponentProps>;
}
