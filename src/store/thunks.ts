import { Thunk } from 'src/@types';
import * as Plain from './plain';
import { $, T, Utils } from 'src';

/**
 * This file contains all of the thunk actions, that contain extra logic,
 * such as conditional dispatches, and multiple async calls.
 */

/**
 * These should only be used internally in thunks.
 */
const PlainInternal = {
  example() {
    return { type: 'example' as const };
  },
  addTranslation(translation: T.Translation, slug: string) {
    return { type: 'add-translation' as const, translation, slug };
  },
};

export type PlainInternal = typeof PlainInternal;

export function exampleThunk(): Thunk {
  return (dispatch, getState) => {
    console.log(getState());
    dispatch(PlainInternal.example());
    dispatch(Plain.setOpenAIApiKey('example'));
  };
}

export function addTranslation(
  summary: string,
  navigate?: (path: string) => void,
): Thunk<{ slug: string; translation: T.Translation }> {
  return (dispatch, getState) => {
    const { sourceLanguage, targetLanguage } = $.guessTranslationLanguages(
      getState(),
    );

    const slugs = $.getSlugs(getState());
    const slug = Utils.getUniqueSlug(slugs, Utils.sluggify(summary));
    const translation: T.Translation = {
      sourceText: '',
      sourceLanguage,
      targetLanguage,
      summary,
      sourceSentences: [],
      targetSentences: [],
    };

    dispatch(PlainInternal.addTranslation(translation, slug));
    if (navigate) {
      navigate('/translation/' + slug);
    }
    return { slug, translation };
  };
}

export function selectNextStem(direction: -1 | 1): Thunk<number> {
  return (dispatch, getState) => {
    const stems = $.getUnknownStems(getState());
    if (!stems) {
      throw new Error('Expected stems when selecting a new stem');
    }
    let stemIndex = $.getSelectedStemIndex(getState()) ?? -1;
    stemIndex += direction;
    // Keep the index in bounds.
    stemIndex = Math.max(0, Math.min(stemIndex, stems.length - 1));
    dispatch(Plain.selectStem(stemIndex));
    return stemIndex;
  };
}

export function ignoreSelectedStem(): Thunk {
  return (dispatch, getState) => {
    const stem = $.getSelectedStem(getState());
    if (stem) {
      dispatch(Plain.ignoreStem(stem.stem));
    }
  };
}

export function learnSelectedStem(): Thunk {
  return (dispatch, getState) => {
    const stem = $.getSelectedStem(getState());
    if (stem) {
      dispatch(Plain.learnStem(stem.stem));
    }
  };
}
