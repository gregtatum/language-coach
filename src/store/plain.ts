import { T, Utils } from 'src';

export function setOpenAIApiKey(key: string) {
  return { type: 'set-openai-api-key' as const, key };
}

export function setView(view: T.View) {
  return { type: 'set-view' as const, view };
}

export function viewTranslation(view: T.View, slug: string) {
  return { type: 'view-translation' as const, view, slug };
}

export function removeTranslation(slug: string) {
  return { type: 'remove-translation' as const, slug };
}

/**
 * Re-sets the translation by updating the entire source.
 */
export function updateTranslationSource(slug: string, sourceText: string) {
  return {
    type: 'update-translation-source' as const,
    slug,
    sourceText,
    sourceSentences: Utils.getSourceSentences(sourceText),
  };
}

export function changeTranslationLangauge(
  slug: string,
  sourceLanguage: string,
  targetLanguage: string,
) {
  return {
    type: 'change-translation-langauge' as const,
    slug,
    sourceLanguage,
    targetLanguage,
  };
}

/**
 * Provides a translation for a sentence.
 */
export function updateTranslationTarget(
  slug: string,
  translationIndex: number,
  targetText: string,
) {
  return {
    type: 'update-translation-target' as const,
    slug,
    translationIndex,
    targetText,
  };
}
