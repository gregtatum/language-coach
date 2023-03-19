import * as React from 'react';
import { A, $, Hooks } from 'src';

import './Translation.css';

const suggestion = `The correct translation would be: "Este perro es lindo".

Changes made:
- "Esta" changed to "Este", as "perro" is a masculine noun.
- "Bonito" changed to "lindo", as "lindo" is generally used to describe the cuteness of an animal in Spanish.`;

export function Translation() {
  const dispatch = Hooks.useDispatch();
  const openAI = Hooks.useSelector($.getOpenAI);
  const slug = Hooks.useSelector($.getTranslationSlug);
  const { sourceLanguage, targetLanguage } = Hooks.useSelector(
    $.getCurrentTranslation,
  );
  const [responseText, setResponseText] = React.useState('');
  const sourceLanguageRef = React.useRef<HTMLInputElement | null>(null);
  const targetLanguageRef = React.useRef<HTMLInputElement | null>(null);
  const fromTextRef = React.useRef<HTMLTextAreaElement | null>(null);
  const toTextRef = React.useRef<HTMLTextAreaElement | null>(null);

  function changeLanguages() {
    dispatch(
      A.changeTranslationLangauge(
        slug,
        sourceLanguageRef.current?.value ?? '',
        targetLanguageRef.current?.value ?? '',
      ),
    );
  }
  function onLanguageEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      changeLanguages();
      sourceLanguageRef.current?.blur();
      targetLanguageRef.current?.blur();
    }
  }

  async function getSuggestion() {
    const fromLanguage = sourceLanguageRef.current?.value;
    const toLanguage = targetLanguageRef.current?.value;
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

  const needsLanguages = !sourceLanguage || !targetLanguage;
  console.log(`!!! needsLanguages`, needsLanguages);
  return (
    <div className="translation">
      {needsLanguages ? <h2>Choose Translation Languages</h2> : null}
      <div className="translationLanguages">
        <input
          type="text"
          defaultValue={sourceLanguage}
          ref={sourceLanguageRef}
          onKeyDown={onLanguageEnter}
          onBlur={changeLanguages}
        />
        <span> to </span>
        <input
          type="text"
          defaultValue={targetLanguage}
          ref={targetLanguageRef}
          onKeyDown={onLanguageEnter}
          onBlur={changeLanguages}
        />
      </div>
      {needsLanguages ? null : (
        <>
          <div className="translationTextAreas">
            <textarea
              className="translationSource"
              placeholder="Source text"
              ref={fromTextRef}
              defaultValue={`This dog is cute.`}
            />
            <textarea
              className="translationTarget"
              placeholder="Translated text"
              ref={toTextRef}
              defaultValue={`Esta perro esta bonito.`}
            />
          </div>
          <div className="translationResponseButtonWrapper">
            <button
              type="button"
              className="translationResponseButton button"
              onClick={() => {
                getSuggestion().catch((error) => console.error(error));
              }}
            >
              Get Translation Suggestions
            </button>
          </div>
          <pre className="translationResponse">
            {responseText || suggestion}
          </pre>
        </>
      )}
    </div>
  );
}
