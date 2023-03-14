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

export const reducers = combineReducers({ init, openAiApiKey });
export type State = ReturnType<typeof reducers>;
