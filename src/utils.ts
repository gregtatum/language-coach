import { T } from 'src';

/**
 * Allow exhaustive checking of case statements, by throwing an UnhandledCaseError
 * in the default branch.
 */
export class UnhandledCaseError extends Error {
  constructor(value: never, typeName: string) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    super(`There was an unhandled case for "${typeName}": ${value}`);
    this.name = 'UnhandledCaseError';
  }
}

/**
 * Ensure some T exists when the type systems knows it can be null or undefined.
 */
export function ensureExists<T>(
  item: T | null | undefined,
  message: string = 'an item',
): T {
  if (item === null) {
    throw new Error(message || 'Expected ${name} to exist, and it was null.');
  }
  if (item === undefined) {
    throw new Error(
      message || 'Expected ${name} to exist, and it was undefined.',
    );
  }
  return item;
}

/**
 * Mock out Google Analytics for anything that's not production so that we have run-time
 * code coverage in development and testing.
 */
export function mockGoogleAnalytics() {
  if (process.env.NODE_ENV === 'development') {
    (window as any).ga = (event: any, ...payload: any[]) => {
      const style = 'color: #FF6D00; font-weight: bold';
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`[analytics] %c"${event}"`, style, ...payload);
    };
  } else if (process.env.NODE_ENV !== 'production') {
    (window as any).ga = () => {};
  }
}

export function getUniqueSlug(slugs: Array<string>, slug: string): string {
  if (!slugs.includes(slug)) {
    return slug;
  }
  let id = 2;
  const matchSlug = /^(.+)-([1-9]\d*)$/;
  for (const other of slugs) {
    const match = other.match(matchSlug);
    if (!match) {
      continue;
    }
    const [, otherSlug, otherId] = match;
    if (otherSlug !== slug) {
      continue;
    }
    // parseInt should be safe here, since it's only digits.
    id = Math.max(id, parseInt(otherId, 10) + 1);
  }
  return `${slug}-${id}`;
}

export function getSourceSentences(source: string): T.SourceSentence[] {
  const sentences: T.SourceSentence[] = [];
  let startIndex = 0;
  for (let i = 0; startIndex < source.length; i++) {
    const ch = source[i];

    if (ch === undefined || ch === '.' || ch === '\n') {
      const endIndex = i + 1;
      const text = source.slice(startIndex, endIndex).trim();
      if (text) {
        sentences.push({
          text,
          startIndex,
          endIndex: endIndex,
        });
      }
      startIndex = endIndex;
    }
  }
  return sentences;
}

export function sluggify(text: string): string {
  return (
    text
      .trim()
      .toLocaleLowerCase()
      // De-compose the combining diacritical marks.
      .normalize('NFD')
      // Remove combining diacritical marks.
      //   U+0300 to U+036F: Combining Diacritical Marks
      //   U+1DC0 to U+1DFF: Combining Diacritical Marks Supplement
      //   U+20D0 to U+20FF: Combining Diacritical Marks for Symbols
      //   U+FE20 to U+FE2F: Combining Half Marks
      .replace(/[\u0300-\u036F]/g, '')
      .replace(/[\u1DC0-\u1DFF]/g, '')
      .replace(/[\u20D0-\u20FF]/g, '')
      .replace(/[\uFE20-\uFE2F]/g, '')
      // Replace all non-alphanumeric characters with a hyphen.
      .replace(/[^a-zA-Z0-9]/g, '-')
      // Replace consecutive hyphens with a single hyphen.
      .replace(/-{2,}/g, '-')
      // Replace any remaining non-alphanumeric characters with a hyphen
      .replace(/[^-a-zA-Z0-9]/g, '-')
      // Remove any leading or trailing hyphens
      .replace(/^-+|-+$/g, '')
  );
}

export function isElementInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
