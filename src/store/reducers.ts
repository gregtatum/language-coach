import * as T from 'src/@types';
import { combineReducers } from 'redux';

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

export const reducers = combineReducers({
  init,
  openAiApiKey,
  view,
  translationSlug,
  translations,
});

export type State = ReturnType<typeof reducers>;
