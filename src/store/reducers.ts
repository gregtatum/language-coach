import * as T from 'src/@types';
import { combineReducers } from 'redux';
import { Stem } from 'src/@types';
import { getLanguageByCode } from 'src/logic/languages';

function init(state = false, action: T.Action): boolean {
  switch (action.type) {
    case 'example':
      return true;
    default:
      return state;
  }
}

function openAiApiKey(
  state: string | null = window.localStorage.getItem('apiKey') || null,
  action: T.Action,
): string | null {
  switch (action.type) {
    case 'set-openai-api-key':
      window.localStorage.setItem('apiKey', action.key);
      return action.key;
    default:
      return state;
  }
}

function view(state: T.View = 'home', action: T.Action): T.View {
  switch (action.type) {
    case 'set-view':
    case 'view-translation':
      return action.view;
    default:
      return state;
  }
}

function translationSlug(state: string = '', action: T.Action): string {
  switch (action.type) {
    case 'view-translation':
      return action.slug;
    default:
      return state;
  }
}

type TranslationRecord = Record<string, T.Translation>;

function translations(
  state: TranslationRecord = {},
  action: T.Action,
): TranslationRecord {
  switch (action.type) {
    case 'add-translation': {
      const result: TranslationRecord = {
        ...translations,
        [action.slug]: action.translation,
      };
      return result;
    }
    case 'add-translation-source': {
      const { slug, sourceText, sourceSentences } = action;
      const oldTranslation = state[slug];
      if (!oldTranslation) {
        throw new Error(`Could not find the translation from slug ${slug}.`);
      }
      const translation: T.Translation = {
        ...oldTranslation,
        sourceText,
        sourceSentences,
        targetSentences: sourceSentences.map(() => ''),
      };
      const record: TranslationRecord = {
        ...translations,
        [slug]: translation,
      };
      return record;
    }
    case 'update-translation-target': {
      const { slug, translationIndex, targetText } = action;
      const oldTranslation = state[slug];
      if (!oldTranslation) {
        throw new Error(`Could not find the translation from slug ${slug}.`);
      }
      const targetSentences = oldTranslation.targetSentences.slice();
      targetSentences[translationIndex] = targetText;
      const translation: T.Translation = { ...oldTranslation, targetSentences };

      return {
        ...translations,
        [slug]: translation,
      };
    }
    case 'change-translation-langauge': {
      const { slug, sourceLanguage, targetLanguage } = action;
      const oldTranslation = state[slug];
      if (!oldTranslation) {
        throw new Error(`Could not find the translation from slug ${slug}.`);
      }
      const translation: T.Translation = {
        ...oldTranslation,
        sourceLanguage,
        targetLanguage,
      };

      return {
        ...translations,
        [slug]: translation,
      };
    }
    case 'remove-translation': {
      const { slug } = action;
      const translations = { ...state };
      delete translations[slug];
      return translations;
    }
    default:
      return state;
  }
}

function stems(state: Stem[] | null = null, action: T.Action): Stem[] | null {
  switch (action.type) {
    case 'stem-frequency-analysis':
      return action.stems;
    default:
      return state;
  }
}

function selectedStem(
  state: null | number = 3,
  action: T.Action,
): null | number {
  switch (action.type) {
    case 'select-stem':
      return action.stemIndex;
    case 'stem-frequency-analysis':
      return null;
    default:
      return state;
  }
}

function getLearnedStemsFromLocalStorage(
  language = localStorage.getItem('language'),
): Set<string> {
  if (!language) {
    return new Set();
  }
  return getSetFromLocalStorage('learned-stems-' + language);
}

function getIgnoredStemsFromLocalStorage(
  language = localStorage.getItem('language'),
): Set<string> {
  if (!language) {
    return new Set();
  }
  return getSetFromLocalStorage('ignored-stems-' + language);
}

function getSetFromLocalStorage(key: string): Set<string> {
  const value = localStorage.getItem(key);
  if (!value) {
    return new Set();
  }
  return new Set(JSON.parse(value));
}

function saveSetToLocalStorage(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

function ignoredStems(
  state: Set<string> = getIgnoredStemsFromLocalStorage(),
  action: T.Action,
): Set<string> {
  switch (action.type) {
    case 'ignore-stem': {
      const { stem, languageCode } = action;
      const stems = new Set(state);
      stems.add(stem);
      saveSetToLocalStorage('ignored-stems-' + languageCode, stems);
      return stems;
    }
    case 'undo-ignore-stem': {
      const { stem, languageCode } = action;
      const stems = new Set(state);
      stems.delete(stem);
      saveSetToLocalStorage('ignored-stems-' + languageCode, stems);
      return stems;
    }
    case 'change-language':
      return getIgnoredStemsFromLocalStorage(action.code);
    default:
      return state;
  }
}

function learnedStems(
  state: Set<string> = getLearnedStemsFromLocalStorage(),
  action: T.Action,
): Set<string> {
  switch (action.type) {
    case 'learn-stem': {
      const { stem, languageCode } = action;
      const stems = new Set(state);
      stems.add(stem);
      saveSetToLocalStorage('learned-stems-' + languageCode, stems);
      return stems;
    }
    case 'undo-learn-stem': {
      const { stem, languageCode } = action;
      const stems = new Set(state);
      stems.delete(stem);
      saveSetToLocalStorage('learned-stems-' + languageCode, stems);
      return stems;
    }
    case 'update-learned-words': {
      const { words, languageCode } = action;
      saveSetToLocalStorage('learned-stems-' + languageCode, words);
      return words;
    }
    case 'change-language':
      return getLearnedStemsFromLocalStorage(action.code);
    default:
      return state;
  }
}

function language(
  state: T.Language = getLanguageByCode(
    localStorage.getItem('language') ?? 'es',
  ),
  action: T.Action,
) {
  switch (action.type) {
    case 'change-language': {
      localStorage.setItem('language', action.code);
      return getLanguageByCode(action.code);
    }
    default:
      return state;
  }
}

function undoList(state: T.Action[] = [], action: T.Action): T.Action[] {
  switch (action.type) {
    case 'learn-stem':
    case 'ignore-stem': {
      return [...state, action];
    }
    case 'set-view':
      return [];
    case 'undo-learn-stem':
    case 'undo-ignore-stem': {
      const newState = state.slice();
      newState.pop();
      return newState;
    }
    default:
      return state;
  }
}

function selectedSentences(
  state: Map<string, number> = new Map(),
  action: T.Action,
): Map<string, number> {
  switch (action.type) {
    case 'stem-frequency-analysis':
      return new Map();
    case 'next-sentence': {
      const { stem, direction } = action;
      const currentIndex = state.get(stem.stem) ?? 0;
      const sentencesLength = stem.sentences.length;
      const newState = new Map(state);
      const nextIndex =
        (sentencesLength + currentIndex + direction) % sentencesLength;
      newState.set(stem.stem, nextIndex);
      return newState;
    }
    default:
      return state;
  }
}

export const reducers = combineReducers({
  init,
  openAiApiKey,
  view,
  translationSlug,
  translations,
  selectedStem,
  stems,
  ignoredStems,
  learnedStems,
  undoList,
  language,
  selectedSentences,
});

export type State = ReturnType<typeof reducers>;
