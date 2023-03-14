import * as React from 'react';
import { A, $, Hooks } from 'src';

import './ApiKey.css';

export function ApiKey(props: { children: any }) {
  const key = Hooks.useSelector($.getOpenAiApiKey);
  const dispatch = Hooks.useDispatch();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  if (key) {
    return props.children;
  }
  return (
    <div className="apiKey">
      <h1>OpenAI API Key</h1>
      <p>
        Get your{' '}
        <a href="https://platform.openai.com/account/api-keys">
          OpenAI secret key
        </a>{' '}
        and paste it below.
      </p>
      <div className="apiKeyRow">
        <input
          type="text"
          className="apiKeyRowInput"
          placeholder="sk-abcdef...qrstuvwxyz"
          ref={inputRef}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && inputRef.current?.value) {
              dispatch(A.setOpenAIApiKey(inputRef.current.value));
            }
          }}
        />
        <button
          type="button"
          className="button apiKeyRowButton"
          onClick={() => {
            if (inputRef.current?.value) {
              dispatch(A.setOpenAIApiKey(inputRef.current.value));
            }
          }}
        >
          Load
        </button>
      </div>
    </div>
  );
}
