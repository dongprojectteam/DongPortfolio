import { dialog, ipcMain } from 'electron';
import fs from 'node:fs/promises';
import type { HtmlExportPayload, HtmlExportResult } from '../shared/export';
import { fontRegistry, themeRegistry } from '../renderer/theme/registry';
import type { TemplateId } from '../renderer/templates/types';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const paragraphize = (value: string): string =>
  escapeHtml(value)
    .split(/\r?\n\r?\n/)
    .map((paragraph) => `<p>${paragraph.replaceAll(/\r?\n/g, '<br />')}</p>`)
    .join('');

const resolveTemplateForExport = (
  page: HtmlExportPayload['pages'][number]
): TemplateId => {
  const imageCount = page.images.length;
  const autoTemplate: TemplateId =
    imageCount <= 1 ? 'hero' : imageCount === 2 ? 'split' : 'grid';

  if (
    (page.selectedTemplate === 'hero' && imageCount <= 1) ||
    (page.selectedTemplate === 'split' && imageCount === 2) ||
    (page.selectedTemplate === 'grid' && imageCount >= 3)
  ) {
    return page.selectedTemplate;
  }

  return autoTemplate;
};

const renderImages = (
  images: HtmlExportPayload['pages'][number]['images'],
  templateId: TemplateId
): string => {
  if (images.length === 0) {
    return '';
  }

  if (templateId === 'hero') {
    const [image] = images;

    return `
      <div class="template-hero-image">
        <img src="${image.src}" alt="${escapeHtml(image.alt)}" />
      </div>
    `;
  }

  if (templateId === 'split') {
    return `
      <div class="template-split-grid">
        ${images
          .slice(0, 2)
          .map(
            (image) => `
              <figure class="template-image-frame">
                <img src="${image.src}" alt="${escapeHtml(image.alt)}" />
              </figure>
            `
          )
          .join('')}
      </div>
    `;
  }

  return `
    <div class="template-grid-gallery">
      ${images
        .map(
          (image, index) => `
            <figure class="template-image-frame template-image-frame--grid-${
              index + 1
            }">
              <img src="${image.src}" alt="${escapeHtml(image.alt)}" />
            </figure>
          `
        )
        .join('')}
    </div>
  `;
};

const renderPage = (page: HtmlExportPayload['pages'][number], index: number): string => {
  const templateId = resolveTemplateForExport(page);
  const templateClass =
    templateId === 'hero'
      ? 'portfolio-template portfolio-template--hero'
      : templateId === 'split'
        ? 'portfolio-template portfolio-template--split'
        : 'portfolio-template portfolio-template--grid';

  const copyBlock =
    templateId === 'hero'
      ? `
        <div class="template-copy">
          <p class="template-date">${escapeHtml(page.date)}</p>
          <h2>${escapeHtml(page.title || 'Untitled page')}</h2>
          ${paragraphize(page.content)}
        </div>
      `
      : `
        <header class="template-header">
          <p class="template-date">${escapeHtml(page.date)}</p>
          <h2>${escapeHtml(page.title || 'Untitled page')}</h2>
          ${paragraphize(page.content)}
        </header>
      `;

  return `
    <section class="export-page-shell">
      <div class="preview-page-chrome">
        <span>Page ${index + 1}</span>
        <span>${escapeHtml(page.selectedTemplate)}</span>
      </div>
      <article class="${templateClass}">
        ${copyBlock}
        ${renderImages(page.images, templateId)}
      </article>
    </section>
  `;
};

const buildExportHtml = (payload: HtmlExportPayload): string => {
  const theme = themeRegistry[payload.themeId];
  const font = fontRegistry[payload.fontId];

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(payload.documentTitle)}</title>
    <style>
      :root {
        --app-bg: ${theme.colors.appBackground};
        --app-bg-accent: ${theme.colors.appBackgroundAccent};
        --panel-bg: ${theme.colors.panelBackground};
        --panel-surface: ${theme.colors.panelSurface};
        --panel-border: ${theme.colors.panelBorder};
        --panel-shadow: ${theme.colors.panelShadow};
        --preview-bg: ${theme.colors.previewBackground};
        --text-primary: ${theme.colors.textPrimary};
        --text-muted: ${theme.colors.textMuted};
        --accent: ${theme.colors.accent};
        --accent-soft: ${theme.colors.accentSoft};
        --font-family-base: ${font.fontFamily};
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        color: var(--text-primary);
        background: var(--app-bg-accent), var(--app-bg);
        font-family: var(--font-family-base);
      }
      main {
        display: grid;
        gap: 28px;
        padding: 32px;
      }
      .export-page-shell { display: grid; gap: 12px; }
      .preview-page-chrome {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        color: var(--text-muted);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .portfolio-template {
        width: min(100%, 920px);
        margin: 0 auto;
        padding: 28px;
        border-radius: 24px;
        background: var(--panel-bg);
        color: var(--text-primary);
        box-shadow: 0 20px 50px var(--panel-shadow);
      }
      .portfolio-template--hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
        gap: 24px;
        align-items: stretch;
      }
      .template-copy, .template-header {
        display: grid;
        gap: 18px;
        align-content: start;
      }
      .template-header { margin-bottom: 24px; }
      .template-date {
        margin: 0;
        color: var(--accent);
        font-size: 12px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      h2 {
        margin: 0;
        color: inherit;
        font-size: clamp(1.8rem, 2vw, 2.8rem);
        line-height: 1;
      }
      p { margin: 0; }
      .portfolio-template img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 18px;
      }
      .template-hero-image { min-height: 420px; }
      .template-split-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }
      .template-grid-gallery {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 16px;
      }
      .template-image-frame { min-height: 260px; margin: 0; }
      .template-image-frame--grid-1 { grid-column: span 7; min-height: 280px; }
      .template-image-frame--grid-2 { grid-column: span 5; min-height: 280px; }
      .template-image-frame--grid-3,
      .template-image-frame--grid-4,
      .template-image-frame--grid-5,
      .template-image-frame--grid-6 { grid-column: span 4; min-height: 180px; }
      .template-image-frame--grid-7,
      .template-image-frame--grid-8 { grid-column: span 6; min-height: 220px; }
      .template-image-frame--grid-9,
      .template-image-frame--grid-10,
      .template-image-frame--grid-11,
      .template-image-frame--grid-12 { grid-column: span 3; }
      @media (max-width: 720px) {
        main { padding: 20px; }
        .portfolio-template--hero,
        .template-split-grid,
        .template-grid-gallery { grid-template-columns: 1fr; }
        .template-image-frame--grid-1,
        .template-image-frame--grid-2,
        .template-image-frame--grid-3,
        .template-image-frame--grid-4,
        .template-image-frame--grid-5,
        .template-image-frame--grid-6,
        .template-image-frame--grid-7,
        .template-image-frame--grid-8,
        .template-image-frame--grid-9,
        .template-image-frame--grid-10,
        .template-image-frame--grid-11,
        .template-image-frame--grid-12 { grid-column: auto; }
      }
    </style>
  </head>
  <body>
    <main>
      ${payload.pages.map((page, index) => renderPage(page, index)).join('')}
    </main>
  </body>
</html>`;
};

export const registerHtmlExportIpc = (): void => {
  ipcMain.handle(
    'export:html',
    async (_event, payload: HtmlExportPayload): Promise<HtmlExportResult> => {
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: 'Export Portfolio as HTML',
        defaultPath: 'portfolio.html',
        filters: [{ name: 'HTML Files', extensions: ['html'] }]
      });

      if (canceled || !filePath) {
        return { canceled: true };
      }

      const html = buildExportHtml(payload);
      await fs.writeFile(filePath, html, 'utf8');

      return {
        canceled: false,
        filePath
      };
    }
  );
};
