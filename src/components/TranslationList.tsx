import * as React from 'react';
import * as Router from 'react-router-dom';
import { A, $, Hooks } from 'src';

import './TranslationList.css';

export function TranslationList() {
  const translations = Object.entries(Hooks.useSelector($.getTranslations));
  const dispatch = Hooks.useDispatch();
  const navigate = Router.useNavigate();

  return (
    <div className="translationList">
      <h1 className="translationListHeading">Your Translations</h1>
      <p>
        Translate text and improve your language skills with a machine learning
        coach. Personalized assistance, intuitive process, and support for a
        wide range of languages. Start your first translation now..
      </p>
      <button
        className="button primary"
        onClick={() => dispatch(A.addTranslation('New Translation', navigate))}
      >
        New Translation
      </button>
      <div className="translationListList">
        {translations.map(
          ([slug, { summary, sourceLanguage, targetLanguage }]) => (
            <div className="translationListItem" key={slug}>
              <Router.Link to={`/translation/${slug}`}>{summary}</Router.Link>
              <div className="translationListLang">{sourceLanguage}</div>
              <div className="translationListLang">{targetLanguage}</div>
              <button type="button" className="button warning">
                Delete
              </button>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
