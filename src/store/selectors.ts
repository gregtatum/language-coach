import { State } from 'src/@types';
import { createSelector } from 'reselect';
import { OpenAI } from 'src/logic/openAI';
import { ensureExists } from 'src/utils';
import { T } from 'src';

export function getOpenAiApiKey(state: State) {
  return state.openAiApiKey;
}

export function getView(state: State) {
  return state.view;
}

export function getTranslationSlug(state: State) {
  return state.translationSlug;
}

export function getTranslations(state: State) {
  return state.translations;
}

export function getStems(state: State) {
  return state.stems;
}

export function getSelectedStemIndex(state: State) {
  return state.selectedStem;
}

export function getIgnoredStems(state: State) {
  return state.ignoredStems;
}

export function getLearnedStems(state: State) {
  return state.learnedStems;
}

export function getUndoList(state: State) {
  return state.undoList;
}

export function getLanguage(state: State) {
  return state.language;
}

export function getLanguageCode(state: State) {
  return getLanguage(state).code;
}

export function getDisplayLanguage(state: State) {
  return getLanguage(state).code;
}

export function getSelectedStem(state: State) {
  const stemIndex = getSelectedStemIndex(state);
  const stems = getUnknownStems(state);
  if (stemIndex !== null && stems) {
    return stems[stemIndex];
  }
  return null;
}

export const getLearnedAndIgnoredStems = createSelector(
  getLearnedStems,
  getIgnoredStems,
  (learned, ignored) => {
    const combined = new Set(learned);
    for (const word of ignored) {
      combined.add(word);
    }
    return combined;
  },
);

export const getUnknownStems = createSelector(
  getStems,
  getLearnedAndIgnoredStems,
  (stems, ignored): T.Stem[] | null => {
    if (!stems) {
      return null;
    }
    const unknownStems = stems.filter((stem) => !ignored.has(stem.stem));
    // Limit to 1000 words.
    return unknownStems.length > 1000
      ? unknownStems.slice(0, 1000)
      : unknownStems;
  },
);

export const getCurrentTranslationOrNull = createSelector(
  getTranslations,
  getTranslationSlug,
  (translations, slug): T.Translation | null => {
    return translations[slug] ?? null;
  },
);

export const getCurrentTranslation = dangerousSelector(
  getCurrentTranslationOrNull,
  'No translation was found.',
);

export const getHasLanguagesForTranslation = createSelector(
  getCurrentTranslation,
  (translation) =>
    Boolean(translation.sourceLanguage && translation.targetLanguage),
);

export const getOpenAiOrNull = createSelector(
  getOpenAiApiKey,
  (key): OpenAI | null => {
    if (key) {
      return new OpenAI(key);
    }
    return null;
  },
);

export const getSlugs = createSelector(
  getTranslations,
  (translations): string[] => Object.keys(translations),
);

export const getOpenAI = dangerousSelector(
  getOpenAiOrNull,
  "Dropbox wasn't available",
);

/**
 * Returns the value of the selector and assert that it is non-null.
 */
function dangerousSelector<T>(
  selector: (state: State) => T | null,
  message: string,
): (state: State) => T {
  return (state) => ensureExists(selector(state), message);
}

export const guessTranslationLanguages = createSelector(
  getTranslations,
  (translations) => {
    const source: Record<string, number> = {};
    const target: Record<string, number> = {};

    for (const { sourceLanguage, targetLanguage } of Object.values(
      translations,
    )) {
      source[sourceLanguage] = (source[sourceLanguage] ?? 0) + 1;
      target[targetLanguage] = (target[targetLanguage] ?? 0) + 1;
    }

    let sourceGuess = '';
    let sourceCount = 0;
    for (const [language, count] of Object.entries(source)) {
      if (count > sourceCount) {
        sourceGuess = language;
        sourceCount = count;
      }
    }

    let targetGuess = '';
    let targetCount = 0;
    for (const [language, count] of Object.entries(target)) {
      if (count > targetCount) {
        targetGuess = language;
        targetCount = count;
      }
    }

    if (!sourceGuess) {
      // If there is no good source langauge, guess the navigator language.
      const dn = new Intl.DisplayNames(undefined, {
        type: 'language',
      });
      sourceGuess = dn.of(window.navigator.language.slice(0, 2)) ?? '';
    }

    return { sourceLanguage: sourceGuess, targetLanguage: targetGuess };
  },
);
