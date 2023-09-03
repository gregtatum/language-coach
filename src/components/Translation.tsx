import * as React from 'react';
import { A, $, T, Hooks } from 'src';

import './Translation.css';

function Languages(props: { translation: T.Translation }) {
  const dispatch = Hooks.useDispatch();
  const slug = Hooks.useSelector($.getTranslationSlug);
  const hasLanguagesForTranslation = Hooks.useSelector(
    $.getHasLanguagesForTranslation,
  );

  const { sourceLanguage, targetLanguage } = props.translation;
  const sourceLanguageRef = React.useRef<HTMLInputElement | null>(null);
  const targetLanguageRef = React.useRef<HTMLInputElement | null>(null);

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

  const hidden = hasLanguagesForTranslation ? 'hidden' : '';

  return (
    <div className="translationLanguages">
      <h2 className={`translationHeader ${hidden}`}>
        Choose Translation Languages
      </h2>
      <div className="translationLanguageInputs">
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
    </div>
  );
}

export function Translation() {
  const translation = Hooks.useSelector($.getCurrentTranslationOrNull);
  const dispatch = Hooks.useDispatch();

  React.useEffect(() => {
    if (!translation) {
      dispatch(A.addTranslation('New Translation'));
    }
  }, [translation]);

  if (!translation) {
    return <div className="translation AppScroll"></div>;
  }

  return <TranslationInner translation={translation} />;
}

function InputText(props: { translation: T.Translation }) {
  const dispatch = Hooks.useDispatch();
  const hasLanguagesForTranslation = Hooks.useSelector(
    $.getHasLanguagesForTranslation,
  );
  const { sourceLanguage, sourceText } = props.translation;
  const slug = Hooks.useSelector($.getTranslationSlug);
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (hasLanguagesForTranslation) {
      textAreaRef.current?.focus();
    }
  }, [hasLanguagesForTranslation]);

  if (!hasLanguagesForTranslation || sourceText) {
    return null;
  }

  function updateTranslationSource() {
    const sourceText = textAreaRef.current?.value;
    if (sourceText?.trim()) {
      dispatch(A.addTranslationSource(slug, sourceText));
    }
  }

  return (
    <div className="translationInputText">
      <h2 className="translationHeader">Add Your {sourceLanguage} Text</h2>
      <textarea
        className="translationInputTextArea"
        defaultValue=""
        ref={textAreaRef}
        onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            updateTranslationSource();
          }
        }}
      ></textarea>
      <button
        className="button translationInputTextButton"
        onClick={updateTranslationSource}
      >
        Start Translating
      </button>
    </div>
  );
}

function TranslationPairs(props: { translation: T.Translation }) {
  const { sourceSentences } = props.translation;
  if (sourceSentences.length === 0) {
    return null;
  }
  return (
    <div className="translationSplit">
      {sourceSentences.map((_, index) => (
        <TranslationPair
          key={index}
          translation={props.translation}
          index={index}
        />
      ))}
    </div>
  );
}

/**
 * The individual translation target, that is the textarea the user will
 * type into.
 */
function TranslationPair(props: { translation: T.Translation; index: number }) {
  const { translation, index } = props;
  const sourceSentence = translation.sourceSentences[index];
  const targetSentence = translation.targetSentences[index];
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const dispatch = Hooks.useDispatch();
  const slug = Hooks.useSelector($.getTranslationSlug);

  function resizeTextArea() {
    const textarea = textAreaRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  // Ensure the textarea resizes by user input.
  React.useEffect(() => {
    window.addEventListener('resize', resizeTextArea);
    return () => {
      window.removeEventListener('resize', resizeTextArea);
    };
  }, []);

  // Focus the first textarea when the component loads.
  React.useEffect(() => {
    if (index === 0) {
      textAreaRef.current?.focus();
    }
  }, [index]);

  function saveInput() {
    const textArea = textAreaRef.current;
    if (!textArea) {
      return;
    }
    dispatch(A.updateTranslationTarget(slug, index, textArea.value.trim()));
  }

  return (
    <div className="translationPair">
      <p className="translationPairSource">{sourceSentence.text}</p>
      <textarea
        className="translationPairTarget"
        defaultValue={targetSentence}
        ref={textAreaRef}
        onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            //
          }
        }}
        onInput={resizeTextArea}
        onBlur={saveInput}
      ></textarea>
    </div>
  );
}

function TranslationInner(props: { translation: T.Translation }) {
  const { translation } = props;
  return (
    <div className="translation AppScroll">
      <Languages translation={translation} />
      <InputText translation={translation} />
      <TranslationPairs translation={translation} />
    </div>
  );
}
