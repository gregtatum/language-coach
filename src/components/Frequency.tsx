import * as React from 'react';
import './Frequency.css';
import { Stem } from 'src/@types';
import { Hunspell, loadModule } from 'hunspell-asm';
import { Hooks, $, A } from 'src';
import { isElementInViewport } from 'src/utils';

let hunspell: Hunspell | void;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const affResponse = await fetch('dictionaries/es/index.aff');
  const dicResponse = await fetch('dictionaries/es/index.dic');
  const affBuffer = new Uint8Array(await affResponse.arrayBuffer());
  const dicBuffer = new Uint8Array(await dicResponse.arrayBuffer());

  const hunspellFactory = await loadModule();

  const affFile = hunspellFactory.mountBuffer(affBuffer, 'es.aff');
  const dictFile = hunspellFactory.mountBuffer(dicBuffer, 'es.dic');

  hunspell = hunspellFactory.create(affFile, dictFile);
})();

function segmentSentence(text: string, locale = 'es'): string[] {
  if (Intl.Segmenter) {
    const sentences = [];
    const segmenter = new Intl.Segmenter(locale, { granularity: 'sentence' });
    for (const { segment } of segmenter.segment(text)) {
      sentences.push(segment);
    }
    return sentences;
  }
  // Use a regular expression to split text into sentences on periods, question marks,
  // exclamation points, and newlines.
  const sentenceRegex = /[.!?]\s*|\n+/;
  return text.split(sentenceRegex);
}

function segmentWords(text: string, locale = 'es'): string[] {
  const words = [];

  if (Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(locale, { granularity: 'word' });
    for (const { segment, isWordLike } of segmenter.segment(text)) {
      if (isWordLike) {
        words.push(segment);
      }
    }
  } else {
    const regex = /\p{Alphabetic}+/gu;
    for (const [segment] of text.matchAll(regex)) {
      words.push(segment);
    }
  }
  return words;
}

const sampleText = [
  'Que trata de la condición y ejercicio del famoso hidalgo don Quijote de',
  'la Mancha Que trata de la primera salida que de su tierra hizo el',
  'ingenioso don Quijote Donde se cuenta la graciosa manera que tuvo don',
  'Quijote en armarse caballero',
];

function computeStems(text: string, locale = 'es'): Stem[] {
  const stemsByStem: Map<string, Stem> = new Map();
  for (const sentence of segmentSentence(text, locale)) {
    for (const word of segmentWords(sentence, locale)) {
      const stemmedWord = hunspell?.stem(word)[0] ?? word;
      let stem = stemsByStem.get(word);
      if (!stem) {
        stem = {
          stem: stemmedWord,
          frequency: 0,
          tokens: [],
          sentences: [],
        };
        stemsByStem.set(word, stem);
      }
      if (!stem.tokens.includes(word)) {
        stem.tokens.push(word);
      }
      const trimmedSentence = sentence.trim();
      if (!stem.sentences.includes(trimmedSentence)) {
        stem.sentences.push(trimmedSentence);
      }
      stem.frequency++;
    }
  }
  const stems = [...stemsByStem.values()];
  return stems.sort((a, b) => b.frequency - a.frequency);
}

function boldWords(sentence: string, tokens: string[]) {
  const splitToken = '\uE000'; // This is a "private use" token.
  for (const token of tokens) {
    sentence = sentence.replaceAll(token, splitToken + token + splitToken);
  }
  const parts = sentence.split(splitToken);
  const results = [];
  for (let i = 0; i < parts.length; i += 2) {
    results.push(<span key={i}>{parts[i]}</span>);
    results.push(<b key={i + 1}>{parts[i + 1]}</b>);
  }
  return results;
}

export function Frequency() {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const stemsContainer = React.useRef<HTMLDivElement | null>(null);
  const [text, setText] = React.useState<string>('');
  const dispatch = Hooks.useDispatch();
  const stems = Hooks.useSelector($.getUnknownStems);
  const selectedStem = Hooks.useSelector($.getSelectedStemIndex);

  React.useEffect(() => {
    if (text) {
      dispatch(A.stemFrequencyAnalysis(computeStems(text)));
    }
  }, [text]);

  Hooks.useListener(stemsContainer, 'keypress', [], (event) => {
    let stemIndex;
    switch ((event as KeyboardEvent).key) {
      case 'j':
      case 'ArrowDown':
        stemIndex = dispatch(A.selectNextStem(1));
        break;
      case 'k':
      case 'ArrowUp':
        stemIndex = dispatch(A.selectNextStem(-1));
        break;
      case 'i':
        dispatch(A.ignoreSelectedStem());
        break;
      case 'l':
        dispatch(A.learnSelectedStem());
        break;
      default:
      // Do nothing.
    }
    if (stemIndex !== undefined) {
      const selector = `[data-stem-index="${stemIndex}"]`;
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Could not find stem element from ${selector}`);
      }

      if (!isElementInViewport(element)) {
        element.scrollIntoView();
      }
    }
  });

  return (
    <div className="frequency AppScroll">
      <div className="frequencyTop">
        <p>
          Paste in text to the textarea to perform a word frequency analysis.
          This will give you a targeted list of words to learn.
        </p>
        <textarea
          className="frequencyTextArea"
          ref={textAreaRef}
          defaultValue={sampleText}
        />
        <button
          onClick={() => {
            const textArea = textAreaRef.current;
            if (textArea) {
              setText(textArea.value);
            }
          }}
          className="button frequencyStartButton"
        >
          Run Analysis
        </button>
      </div>
      <div className="frequencyStems" tabIndex={0} ref={stemsContainer}>
        {stems ? (
          <>
            <div className="frequencyStemsRow frequencyStemsHeader">
              <div className="frequencyStemsHeaderRight">Count</div>
              <div>Stem</div>
              <div>Words</div>
              <div></div>
              <div>Sentence</div>
            </div>
            {stems.map((stem, stemIndex) => (
              <StemRow
                stem={stem}
                key={stemIndex}
                stemIndex={stemIndex}
                selectedStem={selectedStem}
                stemsContainer={stemsContainer}
              />
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}

interface StemRowProps {
  stem: Stem;
  stemIndex: number;
  selectedStem: number | null;
  stemsContainer: React.RefObject<HTMLDivElement | null>;
}

function StemRow({
  stem,
  selectedStem,
  stemIndex,
  stemsContainer,
}: StemRowProps) {
  const dispatch = Hooks.useDispatch();
  const isSelected = selectedStem === stemIndex;

  let className = 'frequencyStemsRow';
  if (isSelected) {
    className += ' selected';
  }

  return (
    <div
      className={className}
      onClick={() => {
        dispatch(A.selectStem(stemIndex));
        stemsContainer.current?.focus();
      }}
      aria-selected={isSelected}
      data-stem-index={stemIndex}
    >
      <div className="frequencyStemsCount">{stem.frequency}</div>
      <div>{stem.stem}</div>
      <div>{stem.tokens.join(',')}</div>
      <div className="frequencyButtons">
        <button
          type="button"
          className="frequencyButton button"
          onClick={() => dispatch(A.learnStem(stem.stem))}
        >
          learn
        </button>
        <button
          type="button"
          className="frequencyButton button"
          onClick={() => dispatch(A.ignoreStem(stem.stem))}
        >
          ignore
        </button>
      </div>
      <div>{boldWords(stem.sentences[0], stem.tokens)}</div>
    </div>
  );
}
