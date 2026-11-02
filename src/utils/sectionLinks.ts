export interface DocumentSectionTarget {
  id: string;
  title: string;
  tag: string;
  isExistingAnchor: boolean;
}

/**
 * Extracts all jumpable section targets from raw HTML string or block list
 */
export function extractHtmlSections(html: string): DocumentSectionTarget[] {
  if (!html) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections: DocumentSectionTarget[] = [];
  const seenIds = new Set<string>();

  // 1. Elements with explicit ID
  const elementsWithId = doc.querySelectorAll('[id]');
  elementsWithId.forEach((el) => {
    const id = el.getAttribute('id')?.trim();
    if (id && !seenIds.has(id.toLowerCase())) {
      seenIds.add(id.toLowerCase());
      const text = el.textContent?.trim().slice(0, 60) || id;
      sections.push({
        id,
        title: text.length > 0 ? text : `Section #${id}`,
        tag: el.tagName.toLowerCase(),
        isExistingAnchor: true,
      });
    }
  });

  // 2. Elements with <a name="...">
  const anchorsWithName = doc.querySelectorAll('a[name]');
  anchorsWithName.forEach((el) => {
    const name = el.getAttribute('name')?.trim();
    if (name && !seenIds.has(name.toLowerCase())) {
      seenIds.add(name.toLowerCase());
      const text = el.textContent?.trim().slice(0, 60) || name;
      sections.push({
        id: name,
        title: text.length > 0 ? text : `Anchor #${name}`,
        tag: 'a[name]',
        isExistingAnchor: true,
      });
    }
  });

  // 3. Headings without ID (h1, h2, h3, h4) that could be turned into anchor targets
  const headings = doc.querySelectorAll('h1, h2, h3, h4');
  headings.forEach((h, idx) => {
    const id = h.getAttribute('id');
    const text = h.textContent?.trim();
    if (text && (!id || !seenIds.has(id.toLowerCase()))) {
      const generatedId = id || slugify(text) || `section-heading-${idx + 1}`;
      if (!seenIds.has(generatedId.toLowerCase())) {
        seenIds.add(generatedId.toLowerCase());
        sections.push({
          id: generatedId,
          title: text.slice(0, 60),
          tag: h.tagName.toLowerCase(),
          isExistingAnchor: !!id,
        });
      }
    }
  });

  // 4. Common newsletter table headers or bold section markers
  const sectionHeaders = doc.querySelectorAll('td strong, p strong, span strong');
  sectionHeaders.forEach((strong, idx) => {
    const text = strong.textContent?.trim();
    if (text && text.length > 3 && text.length < 50) {
      const slug = slugify(text);
      if (slug && !seenIds.has(slug.toLowerCase())) {
        seenIds.add(slug.toLowerCase());
        sections.push({
          id: slug,
          title: text,
          tag: 'strong',
          isExistingAnchor: false,
        });
      }
    }
  });

  return sections;
}

/**
 * Convert string into a URL-friendly anchor slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Smoothly scrolls the editor container to a given section ID, and pulses a highlight border
 */
export function scrollToSectionInContainer(
  container: HTMLElement | null,
  targetId: string
): boolean {
  if (!container) return false;

  const cleanId = targetId.startsWith('#') ? targetId.slice(1) : targetId;
  if (!cleanId) return false;

  // Search by ID or by name
  let targetEl: HTMLElement | null =
    container.querySelector(`[id="${cleanId}"]`) ||
    container.querySelector(`a[name="${cleanId}"]`);

  // If not found, try case-insensitive or slug search on headings/strong tags
  if (!targetEl) {
    const allElements = container.querySelectorAll('*');
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i] as HTMLElement;
      if (
        el.id?.toLowerCase() === cleanId.toLowerCase() ||
        el.getAttribute('name')?.toLowerCase() === cleanId.toLowerCase()
      ) {
        targetEl = el;
        break;
      }
    }
  }

  // If still not found, check headings with text matching the slug
  if (!targetEl) {
    const headings = container.querySelectorAll('h1, h2, h3, h4, strong');
    for (let i = 0; i < headings.length; i++) {
      const h = headings[i] as HTMLElement;
      const slug = slugify(h.textContent || '');
      if (slug === cleanId) {
        targetEl = h;
        // Assign the ID so it's formally anchored now
        targetEl.id = cleanId;
        break;
      }
    }
  }

  if (targetEl) {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Visual flash/pulse indicator
    const originalOutline = targetEl.style.outline;
    const originalTransition = targetEl.style.transition;
    targetEl.style.transition = 'outline 0.2s ease, box-shadow 0.2s ease';
    targetEl.style.outline = '3px solid #f59e0b';
    targetEl.style.boxShadow = '0 0 16px rgba(245, 158, 11, 0.4)';

    setTimeout(() => {
      targetEl.style.outline = originalOutline;
      targetEl.style.boxShadow = '';
      targetEl.style.transition = originalTransition;
    }, 1600);

    return true;
  }

  return false;
}
