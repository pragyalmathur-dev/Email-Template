import { DetectedImage, NewsletterBlock, NewsletterDocument } from '../types/newsletter';

/**
 * Extracts all images across any NewsletterDocument (structured or raw HTML)
 */
export function getAllImagesFromDocument(doc: NewsletterDocument): DetectedImage[] {
  const images: DetectedImage[] = [];

  if (doc.rawHtmlMode && doc.rawHtmlContent) {
    // Parse raw HTML using DOMParser
    if (typeof window !== 'undefined') {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(doc.rawHtmlContent, 'text/html');
      const imgElements = htmlDoc.querySelectorAll('img');

      imgElements.forEach((img, idx) => {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || `Image ${idx + 1}`;
        const parent = img.parentElement;
        const caption = parent?.querySelector('figcaption')?.textContent || parent?.getAttribute('title') || '';

        images.push({
          id: `raw-img-${idx}`,
          blockId: 'raw-html',
          blockTitle: `Newsletter Image #${idx + 1}`,
          blockType: 'raw-image',
          fieldKey: `img-index-${idx}`,
          index: idx,
          url: src,
          alt: alt,
          caption: caption,
        });
      });
    }
    return images;
  }

  // Structured blocks image extraction
  doc.blocks.forEach((block) => {
    switch (block.type) {
      case 'header':
        if (block.logoUrl) {
          images.push({
            id: `${block.id}-logo`,
            blockId: block.id,
            blockTitle: block.title || 'Brand Header',
            blockType: block.type,
            fieldKey: 'logoUrl',
            url: block.logoUrl,
            alt: block.brandName,
          });
        }
        break;

      case 'hero':
        if (block.imageUrl) {
          images.push({
            id: `${block.id}-hero-image`,
            blockId: block.id,
            blockTitle: block.headline || 'Hero Section',
            blockType: block.type,
            fieldKey: 'imageUrl',
            url: block.imageUrl,
            alt: block.imageAlt,
            caption: block.imageCaption,
          });
        }
        break;

      case 'letter':
        if (block.authorAvatarUrl) {
          images.push({
            id: `${block.id}-avatar`,
            blockId: block.id,
            blockTitle: block.headline || 'Letter Avatar',
            blockType: block.type,
            fieldKey: 'authorAvatarUrl',
            url: block.authorAvatarUrl,
            alt: block.authorName,
          });
        }
        break;

      case 'two-column':
        if (block.imageUrl) {
          images.push({
            id: `${block.id}-two-col-img`,
            blockId: block.id,
            blockTitle: block.headline || 'Feature Spotlight',
            blockType: block.type,
            fieldKey: 'imageUrl',
            url: block.imageUrl,
            alt: block.imageAlt,
            caption: block.imageCaption,
          });
        }
        break;

      case 'three-column':
        block.items.forEach((item, itemIdx) => {
          if (item.imageUrl) {
            images.push({
              id: `${block.id}-col-${itemIdx}`,
              blockId: block.id,
              blockTitle: `${block.headline} · ${item.title || `Item ${itemIdx + 1}`}`,
              blockType: block.type,
              fieldKey: 'items',
              index: itemIdx,
              url: item.imageUrl,
              alt: item.imageAlt || item.title,
            });
          }
        });
        break;

      case 'gallery':
        block.images.forEach((img, gIdx) => {
          if (img.url) {
            images.push({
              id: `${block.id}-gallery-${gIdx}`,
              blockId: block.id,
              blockTitle: `${block.headline} · Photo ${gIdx + 1}`,
              blockType: block.type,
              fieldKey: 'images',
              index: gIdx,
              url: img.url,
              alt: img.alt || `Gallery Image ${gIdx + 1}`,
              caption: img.caption,
            });
          }
        });
        break;

      default:
        break;
    }
  });

  return images;
}

/**
 * Updates an image in a NewsletterDocument by its fieldKey and index
 */
export function updateDocumentImage(
  doc: NewsletterDocument,
  targetImage: DetectedImage,
  newUrl: string,
  newAlt?: string
): NewsletterDocument {
  // If in raw HTML mode
  if (doc.rawHtmlMode && doc.rawHtmlContent && typeof window !== 'undefined') {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(doc.rawHtmlContent, 'text/html');
    const imgElements = htmlDoc.querySelectorAll('img');

    if (targetImage.index !== undefined && imgElements[targetImage.index]) {
      const targetImg = imgElements[targetImage.index];
      targetImg.setAttribute('src', newUrl);
      if (newAlt !== undefined) targetImg.setAttribute('alt', newAlt);
      return {
        ...doc,
        updatedAt: new Date().toISOString(),
        rawHtmlContent: htmlDoc.documentElement.outerHTML,
      };
    }
  }

  // Structured mode
  const newBlocks = doc.blocks.map((block) => {
    if (block.id !== targetImage.blockId) return block;

    if (block.type === 'hero' && targetImage.fieldKey === 'imageUrl') {
      return { ...block, imageUrl: newUrl, imageAlt: newAlt ?? block.imageAlt };
    }

    if (block.type === 'header' && targetImage.fieldKey === 'logoUrl') {
      return { ...block, logoUrl: newUrl };
    }

    if (block.type === 'letter' && targetImage.fieldKey === 'authorAvatarUrl') {
      return { ...block, authorAvatarUrl: newUrl };
    }

    if (block.type === 'two-column' && targetImage.fieldKey === 'imageUrl') {
      return { ...block, imageUrl: newUrl, imageAlt: newAlt ?? block.imageAlt };
    }

    if (block.type === 'three-column' && targetImage.fieldKey === 'items' && targetImage.index !== undefined) {
      const updatedItems = [...block.items];
      if (updatedItems[targetImage.index]) {
        updatedItems[targetImage.index] = {
          ...updatedItems[targetImage.index],
          imageUrl: newUrl,
          imageAlt: newAlt ?? updatedItems[targetImage.index].imageAlt,
        };
      }
      return { ...block, items: updatedItems };
    }

    if (block.type === 'gallery' && targetImage.fieldKey === 'images' && targetImage.index !== undefined) {
      const updatedImages = [...block.images];
      if (updatedImages[targetImage.index]) {
        updatedImages[targetImage.index] = {
          ...updatedImages[targetImage.index],
          url: newUrl,
          alt: newAlt ?? updatedImages[targetImage.index].alt,
        };
      }
      return { ...block, images: updatedImages };
    }

    return block;
  });

  return {
    ...doc,
    updatedAt: new Date().toISOString(),
    blocks: newBlocks,
  };
}

/**
 * Parses raw uploaded HTML newsletter file into NewsletterDocument
 */
export function parseUploadedHtml(rawHtml: string, filename: string): NewsletterDocument {
  let title = filename.replace(/\.(html|htm)$/i, '');
  let preheader = '';

  if (typeof window !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');
    const docTitle = doc.querySelector('title')?.textContent;
    if (docTitle) title = docTitle;

    // Look for hidden preheader div
    const preheaderDiv = doc.querySelector('div[style*="display: none"], div[style*="display:none"]');
    if (preheaderDiv) {
      preheader = (preheaderDiv.textContent || '').replace(/[\u200C\u00A0&nbsp;]/g, '').trim();
    }
  }

  // Create a raw HTML mode document that is directly editable and image-replaceable
  return {
    id: `uploaded-${Date.now()}`,
    name: title,
    updatedAt: new Date().toISOString(),
    rawHtmlMode: true,
    rawHtmlContent: rawHtml,
    metadata: {
      title: title,
      subject: title,
      preheader: preheader || 'Uploaded newsletter edition',
      senderName: 'Newsletter Team',
      senderEmail: 'newsletter@company.com',
      accentColor: '#934b35',
      fontFamily: 'serif',
      maxWidth: 680,
    },
    blocks: [],
  };
}
