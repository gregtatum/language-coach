import * as React from 'react';
import * as Router from 'react-router-dom';
import { Hooks, $, T, A } from 'src';

import './Header.css';
import { languages } from 'src/logic/languages';

export function Header() {
  const view = Hooks.useSelector($.getView);
  const selectedCode = Hooks.useSelector($.getLanguageCode);
  const learnedWords = Hooks.useSelector($.getLearnedStems);
  const dispatch = Hooks.useDispatch();
  function getActiveClass(v: T.View): string {
    if (v === view) {
      return ' active';
    }
    return '';
  }

  return (
    <div className="header">
      <img className="headerLogo" src="logo-96.tiny.png" />
      <div className="headerLogoName">
        Language
        <br />
        Coach
      </div>
      <div className="headerLinks">
        <Router.Link to="/" className={'headerLink' + getActiveClass('home')}>
          Home
        </Router.Link>
        {/* <Router.Link
          to="/translation"
          className={
            'headerLink' +
            getActiveClass('translation-list') +
            getActiveClass('translation')
          }
        >
          Translations
        </Router.Link> */}
        <Router.Link
          to="/most-used"
          className={'headerLink' + getActiveClass('most-used')}
        >
          Most Used Words
        </Router.Link>
        <Router.Link
          to="/learned"
          className={'headerLink' + getActiveClass('learned')}
        >
          Learned Words{' '}
          <span className="headerBubble">{learnedWords.size}</span>
        </Router.Link>
      </div>
      <div className="headerLanguage">
        <select
          className="headerLanguageSelect"
          value={selectedCode}
          onChange={(event) => {
            dispatch(A.changeLanguage(event.target.value));
          }}
        >
          {languages.map(({ code, long }) => (
            <option key={code} value={code}>
              {long}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
