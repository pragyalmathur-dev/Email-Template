/**
 * Utility for detecting and deleting entire sections (e.g., Sudoku game, Customer Delight, etc.)
 * from uploaded raw HTML newsletters and structured block newsletters.
 */

export interface DeletableSection {
  id: string;
  title: string;
  category: 'game' | 'article' | 'table' | 'banner' | 'footer' | 'general';
  snippet: string;
  tag: string;
  domSelector?: string;
  isBlockMode?: boolean;
  blockId?: string;
}

/**
 * Clean up text for presentation
 */
function cleanText(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Finds the highest-level enclosing section element below the root container
 * (e.g. the section <table>, <tr>, or top-level <div> that wraps the entire section)
 */
export function findEnclosingSectionElement(
  targetEl: HTMLElement,
  rootContainer: HTMLElement
): HTMLElement {
  let curr: HTMLElement | null = targetEl;
  let candidate: HTMLElement = targetEl;

  while (curr && curr !== rootContainer && curr.parentElement && curr.parentElement !== document.body) {
    const parent: HTMLElement = curr.parentElement;
    const tagName = curr.tagName.toUpperCase();

    // If curr is a direct child of rootContainer, it is the top-level section container!
    if (parent === rootContainer) {
      return curr;
    }

    // If parent is rootContainer's main table or tbody, curr is a <tr> section!
    if (
      tagName === 'TR' &&
      (parent === rootContainer ||
        parent.parentElement === rootContainer ||
        parent.parentElement?.parentElement === rootContainer)
    ) {
      candidate = curr;
    }

    // If curr is a full-width section table
    if (tagName === 'TABLE' && (parent === rootContainer || parent.parentElement === rootContainer)) {
      return curr;
    }

    // If curr has an explicit id or section role
    if (curr.getAttribute('id') && curr !== targetEl) {
      candidate = curr;
    }

    curr = parent;
  }

  return candidate;
}

/**
 * Detects all deletable sections from a container DOM element or HTML string
 */
export function detectDeletableSections(
  source: HTMLElement | string
): DeletableSection[] {
  let doc: Document | HTMLElement;
  let isDomElement = false;

  if (typeof source === 'string') {
    const parser = new DOMParser();
    doc = parser.parseFromString(source, 'text/html');
  } else {
    doc = source;
    isDomElement = true;
  }

  const sections: DeletableSection[] = [];
  const seenTitles = new Set<string>();

  // Helper to categorize based on title / content keywords
  const categorize = (text: string): DeletableSection['category'] => {
    const lower = text.toLowerCase();
    if (
      lower.includes('sudoku') ||
      lower.includes('puzzle') ||
      lower.includes('crossword') ||
      lower.includes('game') ||
      lower.includes('quiz') ||
      lower.includes('riddle') ||
      lower.includes('trivia')
    ) {
      return 'game';
    }
    if (lower.includes('footer') || lower.includes('unsubscribe') || lower.includes('copyright')) {
      return 'footer';
    }
    if (lower.includes('header') || lower.includes('issue') || lower.includes('edition')) {
      return 'banner';
    }
    if (lower.includes('table') || lower.includes('grid')) {
      return 'table';
    }
    return 'article';
  };

  // 1. Look for explicit game / puzzle sections first (Sudoku, Crossword, Quiz, etc.)
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el, idx) => {
    const text = cleanText(el.textContent);
    const lower = text.toLowerCase();

    // Check for specific game signatures
    const isSudokuOrGame =
      (lower.startsWith('sudoku') ||
        lower.includes('sudoku challenge') ||
        lower.includes('crossword') ||
        lower.includes('brain teaser') ||
        lower.includes('fun zone') ||
        lower.includes('game zone') ||
        lower.includes('puzzle time')) &&
      text.length < 80;

    if (isSudokuOrGame) {
      const title = text.slice(0, 50);
      const titleKey = title.toLowerCase();
      if (!seenTitles.has(titleKey)) {
        seenTitles.add(titleKey);
        sections.push({
          id: `section-game-${idx}`,
          title: title || 'Sudoku Game / Puzzle',
          category: 'game',
          snippet: text.slice(0, 120),
          tag: el.tagName.toLowerCase(),
          domSelector: `[data-section-id="section-game-${idx}"]`,
        });
      }
    }
  });

  // 2. Scan Headings: h1, h2, h3, h4
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5');
  headings.forEach((h, idx) => {
    const title = cleanText(h.textContent);
    if (title && title.length > 2 && title.length < 80) {
      const titleKey = title.toLowerCase();
      if (!seenTitles.has(titleKey)) {
        seenTitles.add(titleKey);

        // Get preview of sibling or parent text
        const parent = h.parentElement;
        const parentText = cleanText(parent?.textContent) || title;
        const snippet = parentText.replace(title, '').trim().slice(0, 120) || title;

        sections.push({
          id: h.id || `section-heading-${idx}`,
          title: title,
          category: categorize(title),
          snippet: snippet,
          tag: h.tagName.toLowerCase(),
        });
      }
    }
  });

  // 3. Scan Tables with strong headers or distinct section titles
  const strongHeaders = doc.querySelectorAll('td > strong, p > strong, div > strong, th');
  strongHeaders.forEach((strong, idx) => {
    const title = cleanText(strong.textContent);
    if (
      title &&
      title.length > 3 &&
      title.length < 65 &&
      !seenTitles.has(title.toLowerCase())
    ) {
      const titleKey = title.toLowerCase();
      seenTitles.add(titleKey);

      const parentCell = strong.closest('td') || strong.parentElement;
      const cellText = cleanText(parentCell?.textContent) || '';
      const snippet = cellText.replace(title, '').trim().slice(0, 120);

      sections.push({
        id: `section-strong-${idx}`,
        title: title,
        category: categorize(title),
        snippet: snippet || title,
        tag: 'table-section',
      });
    }
  });

  return sections;
}

/**
 * Removes a section from the live DOM container
 */
export function removeSectionFromContainer(
  container: HTMLElement,
  section: DeletableSection
): boolean {
  if (!container) return false;

  const targetTitleLower = section.title.toLowerCase().trim();

  // 1. Try finding by ID
  if (section.id) {
    const elById = container.querySelector(`[id="${section.id}"]`);
    if (elById) {
      const enclosing = findEnclosingSectionElement(elById as HTMLElement, container);
      enclosing.remove();
      return true;
    }
  }

  // 2. Try finding by matching heading or game text
  const candidates = container.querySelectorAll(
    'h1, h2, h3, h4, h5, strong, td, div, table'
  );

  for (let i = 0; i < candidates.length; i++) {
    const el = candidates[i] as HTMLElement;
    const text = cleanText(el.textContent).toLowerCase();

    // Check exact or strong match with section title
    if (text === targetTitleLower || (targetTitleLower.length > 4 && text.startsWith(targetTitleLower))) {
      const enclosing = findEnclosingSectionElement(el, container);
      enclosing.remove();
      return true;
    }
  }

  // 3. Fallback: search for keyword inside text
  for (let i = 0; i < candidates.length; i++) {
    const el = candidates[i] as HTMLElement;
    const text = cleanText(el.textContent).toLowerCase();
    if (text.includes(targetTitleLower) && el.children.length === 0) {
      const enclosing = findEnclosingSectionElement(el, container);
      enclosing.remove();
      return true;
    }
  }

  return false;
}

/**
 * Deletes any section/table/container containing a given search query or keyword
 * (e.g. "sudoku", "crossword", "delight")
 */
export function deleteSectionByKeywordFromContainer(
  container: HTMLElement,
  keyword: string
): { success: boolean; deletedTitle?: string } {
  if (!container || !keyword.trim()) return { success: false };

  const cleanKeyword = keyword.trim().toLowerCase();
  const allElements = container.querySelectorAll(
    'h1, h2, h3, h4, h5, strong, td, div, table, tr'
  );

  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i] as HTMLElement;
    const text = cleanText(el.textContent);
    const lower = text.toLowerCase();

    if (lower.includes(cleanKeyword)) {
      // Find the best section wrapper
      const enclosing = findEnclosingSectionElement(el, container);
      const title = text.slice(0, 40) || cleanKeyword;
      enclosing.remove();
      return { success: true, deletedTitle: title };
    }
  }

  return { success: false };
}
