import * as React from 'react';
import * as Router from 'react-router-dom';
import { Hooks, $, T } from 'src';

import './Header.css';

export function Header() {
  const view = Hooks.useSelector($.getView);
  function getActiveClass(v: T.View): string {
    if (v === view) {
      return ' active';
    }
    return '';
  }

  return (
    <div className="header">
      <img className="headerLogo" src="/logo-96.tiny.png" />
      <div className="headerLogoName">
        Translation
        <br />
        Coach
      </div>
      <div className="headerLinks">
        <Router.Link to="/" className={'headerLink' + getActiveClass('home')}>
          Home
        </Router.Link>
        <Router.Link
          to="/translation"
          className={
            'headerLink' +
            getActiveClass('translation-list') +
            getActiveClass('translation')
          }
        >
          Translations
        </Router.Link>
        <Router.Link
          to="/frequency"
          className={'headerLink' + getActiveClass('frequency')}
        >
          Word Frequency
        </Router.Link>
      </div>
    </div>
  );
}
