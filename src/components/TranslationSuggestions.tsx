import * as React from 'react';
import { A, $, Hooks } from 'src';

import './TranslationSuggestions.css';

const suggestion = `The correct translation would be: "Este perro es lindo".

Changes made:
- "Esta" changed to "Este", as "perro" is a masculine noun.
- "Bonito" changed to "lindo", as "lindo" is generally used to describe the cuteness of an animal in Spanish.`;

export function TranslationSuggestions() {
  const openAI = Hooks.useSelector($.getOpenAI);
  const [responseText, setResponseText] = React.useState('');
  const fromLanguageRef = React.useRef<HTMLInputElement | null>(null);
  const toLanguageRef = React.useRef<HTMLInputElement | null>(null);
  const fromTextRef = React.useRef<HTMLTextAreaElement | null>(null);
  const toTextRef = React.useRef<HTMLTextAreaElement | null>(null);

  async function getSuggestion() {
    const fromLanguage = fromLanguageRef.current?.value;
    const toLanguage = toLanguageRef.current?.value;
    const fromText = fromTextRef.current?.value;
    const toText = toTextRef.current?.value;
    if (!fromLanguage || !toLanguage || !fromText || !toText) {
      return;
    }

    const response = await openAI.suggestTranslationCorrection(
      fromLanguage,
      toLanguage,
      fromText,
      toText,
    );
    console.log(response);
    setResponseText(response.choices[0].message.content);
  }

  return (
    <div className="translationSuggestions">
      <h1>Translation Suggestions</h1>
      <p>
        Practice your language skills by translating text, and get assistance
        from ChatGPT.
      </p>
      <div className="translationSuggestionsLanguages">
        <input type="text" defaultValue="English" ref={fromLanguageRef} />
        <span> to </span>
        <input type="text" defaultValue="Spanish" ref={toLanguageRef} />
      </div>
      <div className="translationSuggestionsTextAreas">
        <textarea
          className="translationSuggestionsSource"
          placeholder="Source text"
          ref={fromTextRef}
          defaultValue={`This dog is cute.`}
        />
        <textarea
          className="translationSuggestionsTarget"
          placeholder="Translated text"
          ref={toTextRef}
          defaultValue={`Esta perro esta bonito.`}
        />
      </div>
      <div className="translationSuggestionsResponseButtonWrapper">
        <button
          type="button"
          className="translationSuggestionsResponseButton button"
          onClick={() => {
            getSuggestion().catch((error) => console.error(error));
          }}
        >
          Get Translation Suggestions
        </button>
      </div>
      <pre className="translationSuggestionsResponse">
        {responseText || suggestion}
      </pre>
    </div>
  );
}
