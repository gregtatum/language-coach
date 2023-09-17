import { T, Utils } from 'src';
import { Stem } from 'src/@types';

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
 * Sets the translation by updating the entire source.
 */
export function addTranslationSource(slug: string, sourceText: string) {
  return {
    type: 'add-translation-source' as const,
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

export function stemFrequencyAnalysis(stems: Stem[]) {
  return {
    type: 'stem-frequency-analysis' as const,
    stems,
  };
}

export function selectStem(stemIndex: number) {
  return {
    type: 'select-stem' as const,
    stemIndex,
  };
}

export function learnStem(stem: string) {
  return {
    type: 'learn-stem' as const,
    stem,
  };
}

export function ignoreStem(stem: string) {
  return {
    type: 'ignore-stem' as const,
    stem,
  };
}

export function changeLanguage(code: string) {
  return {
    type: 'change-language' as const,
    code,
  };
}
