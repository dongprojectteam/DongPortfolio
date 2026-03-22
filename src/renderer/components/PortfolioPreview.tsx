import { useDeferredValue, useMemo, useState } from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { templateRegistry } from '../templates/registry';
import type { PortfolioPage } from '../templates/types';

type PreviewMode = 'page' | 'document';

export interface PortfolioPreviewProps {
  pages: PortfolioPage[];
  selectedPageId: string;
}

interface PreviewPageModel {
  id: string;
  page: PortfolioPage;
  templateLabel: string;
}

const buildPreviewPages = (pages: PortfolioPage[]): PreviewPageModel[] =>
  pages.map((page) => ({
    id: page.id,
    page,
    templateLabel: templateRegistry[page.selectedTemplate].label
  }));

export const PortfolioPreview = ({
  pages,
  selectedPageId
}: PortfolioPreviewProps): React.JSX.Element => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('page');
  const deferredPages = useDeferredValue(pages);

  const previewPages = useMemo(
    () => buildPreviewPages(deferredPages),
    [deferredPages]
  );

  const selectedPreviewPage =
    previewPages.find((page) => page.id === selectedPageId) ?? previewPages[0];

  const renderedPages =
    previewMode === 'document' ? previewPages : selectedPreviewPage ? [selectedPreviewPage] : [];

  return (
    <>
      <header className="preview-header">
        <div>
          <p className="eyebrow">Live Preview</p>
          <h2>
            {previewMode === 'document'
              ? `Document Preview (${previewPages.length} pages)`
              : selectedPreviewPage?.templateLabel ?? 'Preview'}
          </h2>
        </div>
        <div className="preview-actions">
          <p className="preview-meta">
            {previewMode === 'document'
              ? 'Rendering all pages from deferred project state'
              : 'Rendering the selected page from deferred project state'}
          </p>
          <div className="preview-toggle" role="tablist" aria-label="Preview mode">
            <button
              className={previewMode === 'page' ? 'is-active' : ''}
              onClick={() => setPreviewMode('page')}
              type="button"
            >
              Page
            </button>
            <button
              className={previewMode === 'document' ? 'is-active' : ''}
              onClick={() => setPreviewMode('document')}
              type="button"
            >
              Document
            </button>
          </div>
        </div>
      </header>
      <div className="preview-surface">
        <div className="preview-page-stack">
          {renderedPages.map(({ id, page, templateLabel }, index) => (
            <section key={id} className="preview-page-shell">
              <div className="preview-page-chrome">
                <span>Page {index + 1}</span>
                <span>{templateLabel}</span>
              </div>
              <TemplateRenderer page={page} />
            </section>
          ))}
        </div>
      </div>
    </>
  );
};
