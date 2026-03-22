import { useEffect, useState } from 'react';
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

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error(`Unable to read file "${file.name}" as data URL.`));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error(`Unable to read file "${file.name}".`));
    };

    reader.readAsDataURL(file);
  });

const mapFilesToImages = async (files: FileList): Promise<PortfolioImage[]> =>
  Promise.all(
    Array.from(files).map(async (file) => ({
      id: createImageId(),
      src: await readFileAsDataUrl(file),
      alt: file.name,
      fileName: file.name
    }))
  );

export const PortfolioEditor = ({
  initialValue,
  onChange
}: PortfolioEditorProps): React.JSX.Element => {
  const [page, setPage] = useState<PortfolioPage>(initialValue ?? createEmptyPage);
  const [isReadingImages, setIsReadingImages] = useState(false);

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setPage(initialValue);
  }, [initialValue]);

  useEffect(() => {
    onChange?.(page);
  }, [onChange, page]);

  const updatePage = (updater: (current: PortfolioPage) => PortfolioPage) => {
    setPage((current) => updater(current));
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.target;

    if (!files || files.length === 0) {
      return;
    }

    setIsReadingImages(true);

    try {
      const nextImages = await mapFilesToImages(files);

      updatePage((current) => ({
        ...current,
        images: [...current.images, ...nextImages]
      }));
    } finally {
      setIsReadingImages(false);
      event.target.value = '';
    }
  };

  const removeImage = (imageId: string) => {
    updatePage((current) => {
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
          {isReadingImages
            ? 'Reading images for preview and export...'
            : 'Upload one or more images for this portfolio page.'}
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
