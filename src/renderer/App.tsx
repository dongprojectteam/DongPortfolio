import { useMemo, useState } from 'react';
import { PageList } from './components/PageList';
import { PortfolioEditor } from './components/PortfolioEditor';
import { PortfolioPreview } from './components/PortfolioPreview';
import type { HtmlExportResult } from '../shared/export';
import type { PortfolioDocument } from '../shared/portfolio';
import {
  createEmptyPage,
  isPortfolioDocument
} from '../shared/portfolio';
import {
  ThemeProvider,
  fontRegistry,
  themeRegistry,
  useTheme
} from './theme/ThemeProvider';
import { getAllowedTemplates } from './templates/logic';
import type { PortfolioPage, TemplateId } from './templates/types';

const samplePortfolio: PortfolioDocument = {
  pages: [
    {
      id: 'page-1',
      date: '2026-03-22',
      title: 'Single Image Portfolio',
      content:
        'One image defaults to a hero composition with the copy and visual carrying equal weight.',
      selectedTemplate: 'hero',
      images: [
        {
          id: 'image-1',
          src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
          alt: 'Mountain landscape'
        }
      ]
    },
    {
      id: 'page-2',
      date: '2026-03-18',
      title: 'Two Image Story',
      content:
        'Two images move into a split layout that keeps the narrative compact and visually balanced.',
      selectedTemplate: 'split',
      images: [
        {
          id: 'image-2',
          src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80',
          alt: 'Interior workspace'
        },
        {
          id: 'image-3',
          src: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
          alt: 'Minimal architecture'
        }
      ]
    }
  ]
};

const AppContent = (): React.JSX.Element => {
  const appInfo = window.desktopApp.getAppInfo();
  const { fontId, setFontId, setThemeId, themeId } = useTheme();
  const [portfolio, setPortfolio] = useState<PortfolioDocument>(samplePortfolio);
  const [selectedPageId, setSelectedPageId] = useState(samplePortfolio.pages[0].id);
  const [actionState, setActionState] = useState<{
    isExporting: boolean;
    isPersisting: boolean;
    message: string | null;
  }>({
    isExporting: false,
    isPersisting: false,
    message: null
  });

  const selectedPage =
    portfolio.pages.find((page) => page.id === selectedPageId) ?? portfolio.pages[0];

  const allowedTemplates = useMemo(
    () => getAllowedTemplates(selectedPage.images.length),
    [selectedPage.images.length]
  );

  const updateSelectedPage = (nextPage: PortfolioPage) => {
    setPortfolio((currentPortfolio) => ({
      ...currentPortfolio,
      pages: currentPortfolio.pages.map((page) =>
        page.id === nextPage.id ? nextPage : page
      )
    }));
  };

  const updatePageTemplate = (pageId: string, templateId: TemplateId) => {
    setPortfolio((currentPortfolio) => ({
      ...currentPortfolio,
      pages: currentPortfolio.pages.map((page) =>
        page.id === pageId ? { ...page, selectedTemplate: templateId } : page
      )
    }));
  };

  const addPage = () => {
    const nextPage = createEmptyPage();

    setPortfolio((currentPortfolio) => ({
      ...currentPortfolio,
      pages: [...currentPortfolio.pages, nextPage]
    }));
    setSelectedPageId(nextPage.id);
  };

  const deletePage = (pageId: string) => {
    setPortfolio((currentPortfolio) => {
      if (currentPortfolio.pages.length === 1) {
        return currentPortfolio;
      }

      const nextPages = currentPortfolio.pages.filter((page) => page.id !== pageId);

      if (selectedPageId === pageId) {
        setSelectedPageId(nextPages[0].id);
      }

      return {
        ...currentPortfolio,
        pages: nextPages
      };
    });
  };

  const savePortfolio = async () => {
    setActionState((current) => ({
      ...current,
      isPersisting: true,
      message: null
    }));

    try {
      const result = await window.desktopApp.savePortfolio(portfolio);

      setActionState((current) => ({
        ...current,
        isPersisting: false,
        message: result.canceled ? 'Save canceled.' : `Saved portfolio to ${result.filePath}`
      }));
    } catch (error) {
      setActionState((current) => ({
        ...current,
        isPersisting: false,
        message: error instanceof Error ? error.message : 'Failed to save portfolio.'
      }));
    }
  };

  const loadPortfolio = async () => {
    setActionState((current) => ({
      ...current,
      isPersisting: true,
      message: null
    }));

    try {
      const result = await window.desktopApp.loadPortfolio();

      if (!result.canceled && result.portfolio && isPortfolioDocument(result.portfolio)) {
        setPortfolio(result.portfolio);
        setSelectedPageId(result.portfolio.pages[0]?.id ?? '');
      }

      setActionState((current) => ({
        ...current,
        isPersisting: false,
        message:
          result.canceled || !result.filePath
            ? 'Load canceled.'
            : `Loaded portfolio from ${result.filePath}`
      }));
    } catch (error) {
      setActionState((current) => ({
        ...current,
        isPersisting: false,
        message: error instanceof Error ? error.message : 'Failed to load portfolio.'
      }));
    }
  };

  const exportHtml = async () => {
    setActionState((current) => ({
      ...current,
      isExporting: true,
      message: null
    }));

    try {
      const result: HtmlExportResult = await window.desktopApp.exportHtml({
        documentTitle: appInfo.name,
        themeId,
        fontId,
        pages: portfolio.pages
      });

      setActionState((current) => ({
        ...current,
        isExporting: false,
        message: result.canceled
          ? 'Export canceled.'
          : `Exported HTML to ${result.filePath}`
      }));
    } catch (error) {
      setActionState((current) => ({
        ...current,
        isExporting: false,
        message: error instanceof Error ? error.message : 'Failed to export HTML.'
      }));
    }
  };

  return (
    <main className="app-shell app-shell--workspace">
      <section className="workspace-panel workspace-panel--sidebar">
        <div>
          <p className="eyebrow">Portfolio Workspace</p>
          <h1>{appInfo.name}</h1>
          <p className="description">
            One portfolio state owns all pages. Page selection, editing, preview,
            save/load, and export all work from that same source of truth.
          </p>
        </div>

        <div className="app-actions">
          <div className="app-actions__row">
            <button
              className="primary-action"
              disabled={actionState.isPersisting}
              onClick={() => {
                void savePortfolio();
              }}
              type="button"
            >
              {actionState.isPersisting ? 'Saving...' : 'Save'}
            </button>
            <button
              className="secondary-action"
              disabled={actionState.isPersisting}
              onClick={() => {
                void loadPortfolio();
              }}
              type="button"
            >
              Load
            </button>
            <button
              className="secondary-action"
              disabled={actionState.isExporting}
              onClick={() => {
                void exportHtml();
              }}
              type="button"
            >
              {actionState.isExporting ? 'Exporting...' : 'Export HTML'}
            </button>
          </div>
          {actionState.message ? (
            <p className="action-message">{actionState.message}</p>
          ) : null}
        </div>

        <div className="theme-controls">
          <div className="field-group">
            <label className="field-label" htmlFor="theme-select">
              Color Theme
            </label>
            <select
              id="theme-select"
              value={themeId}
              onChange={(event) =>
                setThemeId(event.target.value as keyof typeof themeRegistry)
              }
            >
              {Object.values(themeRegistry).map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="font-select">
              Font
            </label>
            <select
              id="font-select"
              value={fontId}
              onChange={(event) =>
                setFontId(event.target.value as keyof typeof fontRegistry)
              }
            >
              {Object.values(fontRegistry).map((font) => (
                <option key={font.id} value={font.id}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <PageList
          pages={portfolio.pages}
          selectedPageId={selectedPage.id}
          onAddPage={addPage}
          onDeletePage={deletePage}
          onSelectPage={setSelectedPageId}
        />

        <div className="template-switcher">
          <h2>Available Templates</h2>
          <p>
            Current page has {selectedPage.images.length} image
            {selectedPage.images.length === 1 ? '' : 's'}.
          </p>
          <div className="template-option-list">
            {allowedTemplates.map((template) => (
              <button
                key={template.id}
                className={`template-option${
                  selectedPage.selectedTemplate === template.id ? ' is-selected' : ''
                }`}
                onClick={() => updatePageTemplate(selectedPage.id, template.id)}
                type="button"
              >
                <strong>{template.label}</strong>
                <span>{template.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="template-switcher">
          <h2>Edit Page</h2>
          <p>Switch pages from the list, then edit the selected page here.</p>
          <PortfolioEditor page={selectedPage} onChange={updateSelectedPage} />
        </div>
      </section>

      <section className="workspace-panel workspace-panel--preview">
        <PortfolioPreview
          pages={portfolio.pages}
          selectedPageId={selectedPage.id}
        />
      </section>
    </main>
  );
};

export const App = (): React.JSX.Element => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};
