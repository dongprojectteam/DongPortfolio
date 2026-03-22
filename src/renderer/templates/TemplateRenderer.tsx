import { templateRegistry } from './registry';
import { resolveTemplateForPage } from './logic';
import type { PortfolioPage } from './types';

interface TemplateRendererProps {
  page: PortfolioPage;
}

export const TemplateRenderer = ({
  page
}: TemplateRendererProps): React.JSX.Element => {
  const templateId = resolveTemplateForPage(page);
  const TemplateComponent = templateRegistry[templateId].component;

  return <TemplateComponent page={{ ...page, selectedTemplate: templateId }} />;
};
