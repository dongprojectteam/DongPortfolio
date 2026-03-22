import { useMemo, useState } from 'react';
import { PortfolioEditor } from './components/PortfolioEditor';
import { PortfolioPreview } from './components/PortfolioPreview';
import {
  ThemeProvider,
  fontRegistry,
  themeRegistry,
  useTheme
} from './theme/ThemeProvider';
import { getAllowedTemplates, getTemplateForImageCount } from './templates/logic';
import { templateRegistry } from './templates/registry';
import type { PortfolioPage, TemplateId } from './templates/types';

const samplePages: PortfolioPage[] = [
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
  },
  {
    id: 'page-3',
    date: '2026-03-10',
    title: 'Gallery Page',
    content:
      'Three or more images shift into a grid collage so the page can absorb more visual material without falling apart.',
    selectedTemplate: 'grid',
    images: [
      {
        id: 'image-4',
        src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
        alt: 'Desk with laptop'
      },
      {
        id: 'image-5',
        src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
        alt: 'Modern meeting room'
      },
      {
        id: 'image-6',
        src: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80',
        alt: 'Creative studio'
      },
      {
        id: 'image-7',
        src: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=80',
        alt: 'Open office layout'
      }
    ]
  }
];

const AppContent = (): React.JSX.Element => {
  const appInfo = window.desktopApp.getAppInfo();
  const { fontId, setFontId, setThemeId, themeId } = useTheme();
  const [pages, setPages] = useState(samplePages);
  const [selectedPageId, setSelectedPageId] = useState(samplePages[0].id);

  const selectedPage =
    pages.find((page) => page.id === selectedPageId) ?? samplePages[0];

  const allowedTemplates = useMemo(
    () => getAllowedTemplates(selectedPage.images.length),
    [selectedPage.images.length]
  );

  const updatePageTemplate = (pageId: string, templateId: TemplateId) => {
    setPages((currentPages) =>
      currentPages.map((page) =>
        page.id === pageId ? { ...page, selectedTemplate: templateId } : page
      )
    );
  };

  const updateSelectedPage = (nextPage: PortfolioPage) => {
    setPages((currentPages) =>
      currentPages.map((page) => (page.id === nextPage.id ? nextPage : page))
    );
  };

  return (
    <main className="app-shell app-shell--workspace">
      <section className="workspace-panel workspace-panel--sidebar">
        <div>
          <p className="eyebrow">Template + Theme System</p>
          <h1>{appInfo.name}</h1>
          <p className="description">
            Editor changes flow into shared page state, then the preview renders
            from that state using the selected template.
          </p>
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

        <div className="page-list">
          {pages.map((page) => {
            const recommended = getTemplateForImageCount(page.images.length);

            return (
              <button
                key={page.id}
                className={`page-list-item${page.id === selectedPageId ? ' is-active' : ''}`}
                onClick={() => setSelectedPageId(page.id)}
                type="button"
              >
                <span>{page.title || 'Untitled page'}</span>
                <small>
                  {page.images.length} images · auto {templateRegistry[recommended].label}
                </small>
              </button>
            );
          })}
        </div>

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
          <p>Changes here update the selected page, and the preview follows immediately.</p>
          <PortfolioEditor initialValue={selectedPage} onChange={updateSelectedPage} />
        </div>
      </section>

      <section className="workspace-panel workspace-panel--preview">
        <PortfolioPreview pages={pages} selectedPageId={selectedPageId} />
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
