import { useState } from 'react';
import { createImageId } from '../../shared/portfolio';
import type { PortfolioImage, PortfolioPage } from '../templates/types';

export interface PortfolioEditorProps {
  page: PortfolioPage;
  onChange: (value: PortfolioPage) => void;
}

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
  page,
  onChange
}: PortfolioEditorProps): React.JSX.Element => {
  const [isReadingImages, setIsReadingImages] = useState(false);

  const updatePage = (updater: (current: PortfolioPage) => PortfolioPage) => {
    onChange(updater(page));
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
