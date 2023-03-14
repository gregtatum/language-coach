import { State } from 'src/@types';
import { createSelector } from 'reselect';
import { OpenAI } from 'src/logic/openAI';
import { ensureExists } from 'src/utils';

export function getOpenAiApiKey(state: State) {
  return state.openAiApiKey;
}

export const getOpenAiOrNull = createSelector(
  getOpenAiApiKey,
  (key): OpenAI | null => {
    if (key) {
      return new OpenAI(key);
    }
    return null;
  },
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
