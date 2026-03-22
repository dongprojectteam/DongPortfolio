import type { TemplateComponentProps } from './types';

export const HeroTemplate = ({
  page
}: TemplateComponentProps): React.JSX.Element => {
  const [image] = page.images;

  return (
    <article className="portfolio-template portfolio-template--hero">
      <div className="template-copy">
        <p className="template-date">{page.date}</p>
        <h2>{page.title}</h2>
        <p>{page.content}</p>
      </div>
      {image ? (
        <div className="template-hero-image">
          <img src={image.src} alt={image.alt} />
        </div>
      ) : null}
    </article>
  );
};
