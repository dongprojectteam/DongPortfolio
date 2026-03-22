import type { TemplateComponentProps } from './types';

export const SplitTemplate = ({
  page
}: TemplateComponentProps): React.JSX.Element => {
  const images = page.images.slice(0, 2);

  return (
    <article className="portfolio-template portfolio-template--split">
      <header className="template-header">
        <p className="template-date">{page.date}</p>
        <h2>{page.title}</h2>
        <p>{page.content}</p>
      </header>
      <div className="template-split-grid">
        {images.map((image) => (
          <figure key={image.id} className="template-image-frame">
            <img src={image.src} alt={image.alt} />
          </figure>
        ))}
      </div>
    </article>
  );
};
