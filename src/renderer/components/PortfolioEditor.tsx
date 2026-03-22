import { useEffect, useRef, useState } from 'react';
import type { PortfolioImage, PortfolioPage } from '../templates/types';

export interface PortfolioEditorProps {
  initialValue?: PortfolioPage;
  onChange?: (value: PortfolioPage) => void;
}

const createImageId = (): string =>
  `image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createPageId = (): string =>
  `page-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createEmptyPage = (): PortfolioPage => ({
  id: createPageId(),
  date: new Date().toISOString().slice(0, 10),
  title: '',
  content: '',
  images: [],
  selectedTemplate: 'hero'
});

const mapFilesToImages = (files: FileList): PortfolioImage[] =>
  Array.from(files).map((file) => ({
    id: createImageId(),
    src: URL.createObjectURL(file),
    alt: file.name
  }));

export const PortfolioEditor = ({
  initialValue,
  onChange
}: PortfolioEditorProps): React.JSX.Element => {
  const [page, setPage] = useState<PortfolioPage>(initialValue ?? createEmptyPage);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setPage(initialValue);
  }, [initialValue]);

  useEffect(() => {
    onChange?.(page);
  }, [onChange, page]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const updatePage = (updater: (current: PortfolioPage) => PortfolioPage) => {
    setPage((current) => updater(current));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files || files.length === 0) {
      return;
    }

    const nextImages = mapFilesToImages(files);
    objectUrlsRef.current.push(...nextImages.map((image) => image.src));

    updatePage((current) => ({
      ...current,
      images: [...current.images, ...nextImages]
    }));

    event.target.value = '';
  };

  const removeImage = (imageId: string) => {
    updatePage((current) => {
      const imageToRemove = current.images.find((image) => image.id === imageId);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.src);
        objectUrlsRef.current = objectUrlsRef.current.filter(
          (url) => url !== imageToRemove.src
        );
      }

      return {
        ...current,
        images: current.images.filter((image) => image.id !== imageId)
      };
    });
  };

  return (
    <form className="portfolio-editor" onSubmit={(event) => event.preventDefault()}>
      <div className="portfolio-editor__grid">
        <label className="portfolio-editor__field">
          <span className="portfolio-editor__label">Date</span>
          <input
            type="date"
            value={page.date}
            onChange={(event) =>
              updatePage((current) => ({ ...current, date: event.target.value }))
            }
          />
        </label>

        <label className="portfolio-editor__field">
          <span className="portfolio-editor__label">Title</span>
          <input
            type="text"
            placeholder="Portfolio page title"
            value={page.title}
            onChange={(event) =>
              updatePage((current) => ({ ...current, title: event.target.value }))
            }
          />
        </label>
      </div>

      <label className="portfolio-editor__field">
        <span className="portfolio-editor__label">Content</span>
        <textarea
          rows={8}
          placeholder="Write the page content"
          value={page.content}
          onChange={(event) =>
            updatePage((current) => ({ ...current, content: event.target.value }))
          }
        />
      </label>

      <label className="portfolio-editor__upload">
        <span className="portfolio-editor__label">Images</span>
        <input type="file" accept="image/*" multiple onChange={handleFileChange} />
        <span className="portfolio-editor__hint">
          Upload one or more images for this portfolio page.
        </span>
      </label>

      <div className="portfolio-editor__images">
        {page.images.map((image) => (
          <article key={image.id} className="portfolio-editor__image-card">
            <img src={image.src} alt={image.alt} />
            <div className="portfolio-editor__image-meta">
              <span>{image.alt}</span>
              <button type="button" onClick={() => removeImage(image.id)}>
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </form>
  );
};
