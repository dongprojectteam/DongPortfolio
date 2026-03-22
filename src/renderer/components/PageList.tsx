import type { PortfolioPage } from '../templates/types';
import { getTemplateForImageCount } from '../templates/logic';
import { templateRegistry } from '../templates/registry';

export interface PageListProps {
  pages: PortfolioPage[];
  selectedPageId: string;
  onSelectPage: (pageId: string) => void;
  onAddPage: () => void;
  onDeletePage: (pageId: string) => void;
}

export const PageList = ({
  pages,
  selectedPageId,
  onSelectPage,
  onAddPage,
  onDeletePage
}: PageListProps): React.JSX.Element => {
  return (
    <section className="page-list-panel">
      <div className="page-list-panel__header">
        <div>
          <h2>Pages</h2>
          <p>{pages.length} total</p>
        </div>
        <button className="secondary-action" onClick={onAddPage} type="button">
          Add Page
        </button>
      </div>

      <div className="page-list">
        {pages.map((page, index) => {
          const recommended = getTemplateForImageCount(page.images.length);

          return (
            <div
              key={page.id}
              className={`page-list-item${page.id === selectedPageId ? ' is-active' : ''}`}
            >
              <button
                className="page-list-item__button"
                onClick={() => onSelectPage(page.id)}
                type="button"
              >
                <span>
                  {index + 1}. {page.title || 'Untitled page'}
                </span>
                <small>
                  {page.images.length} images · auto {templateRegistry[recommended].label}
                </small>
              </button>
              <button
                className="page-list-item__delete"
                disabled={pages.length === 1}
                onClick={() => onDeletePage(page.id)}
                type="button"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
