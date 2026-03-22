import { useMemo, useState } from 'react';
import { TemplateRenderer } from './templates/TemplateRenderer';
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

export const App = (): React.JSX.Element => {
  const appInfo = window.desktopApp.getAppInfo();
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

  return (
    <main className="app-shell app-shell--workspace">
      <section className="workspace-panel workspace-panel--sidebar">
        <div>
          <p className="eyebrow">Template System</p>
          <h1>{appInfo.name}</h1>
          <p className="description">
            Registry-driven React templates chosen by image count, with
            per-page switching when multiple layouts are valid.
          </p>
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
                <span>{page.title}</span>
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
      </section>

      <section className="workspace-panel workspace-panel--preview">
        <header className="preview-header">
          <div>
            <p className="eyebrow">Live Preview</p>
            <h2>{templateRegistry[selectedPage.selectedTemplate].label}</h2>
          </div>
          <p className="preview-meta">
            Rendered through registry and `TemplateRenderer`
          </p>
        </header>
        <div className="preview-surface">
          <TemplateRenderer page={selectedPage} />
        </div>
      </section>
    </main>
  );
};
