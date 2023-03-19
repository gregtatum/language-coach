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

export const getCurrentTranslationOrNull = createSelector(
  getTranslations,
  getTranslationSlug,
  (translations, slug): T.Translation | null => {
    console.log(`!!! translations[slug]`, translations, slug);
    return translations[slug] ?? null;
  },
);

export const getCurrentTranslation = dangerousSelector(
  getCurrentTranslationOrNull,
  'No translation was found.',
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
