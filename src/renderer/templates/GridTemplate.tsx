import type { TemplateComponentProps } from './types';

export const GridTemplate = ({
  page
}: TemplateComponentProps): React.JSX.Element => {
  return (
    <article className="portfolio-template portfolio-template--grid">
      <header className="template-header">
        <p className="template-date">{page.date}</p>
        <h2>{page.title}</h2>
        <p>{page.content}</p>
      </header>
      <div className="template-grid-gallery">
        {page.images.map((image, index) => (
          <figure
            key={image.id}
            className={`template-image-frame template-image-frame--grid-${index + 1}`}
          >
            <img src={image.src} alt={image.alt} />
          </figure>
        ))}
      </div>
    </article>
  );
};
