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
