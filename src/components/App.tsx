import * as React from 'react';

import './App.css';

import { ApiKey } from './ApiKey';
import { Translation } from './Translation';
import { TranslationList } from './TranslationList';
import { MostUsed } from './MostUsed';
import { Learned } from './Learned';
import { HomePage } from './HomePage';
import { Header } from './Header';

import { Hooks, A, $, T } from 'src';
import * as Router from 'react-router-dom';
import { UnhandledCaseError } from 'src/utils';

function ViewRouter(props: { view: T.View }) {
  const { view } = props;
  const dispatch = Hooks.useDispatch();
  React.useEffect(() => {
    dispatch(A.setView(view));
  }, [view]);
  return null;
}

function TranslationRouter() {
  const params = Router.useParams();
  const slug = params['*'];
  const dispatch = Hooks.useDispatch();
  React.useEffect(() => {
    if (slug) {
      dispatch(A.viewTranslation('translation', slug));
    } else {
      dispatch(A.setView('translation-list'));
    }
  }, [slug]);
  return null;
}

function MostUsedRouter() {
  const params = Router.useParams();
  const slug = params['*'];
  const dispatch = Hooks.useDispatch();
  React.useEffect(() => {
    dispatch(A.setView('most-used'));
    // TODO - Handle slug.
  }, [slug]);
  return null;
}

function LearnedRouter() {
  const params = Router.useParams();
  const slug = params['*'];
  const dispatch = Hooks.useDispatch();
  React.useEffect(() => {
    dispatch(A.setView('learned'));
    // TODO - Handle slug.
  }, [slug]);
  return null;
}

export function App() {
  React.useEffect(() => {
    document.body.classList.add('AppLoaded');
  }, []);

  return (
    <ApiKey>
      {/* The router is used to only route the views to the Redux store. */}
      <Router.HashRouter>
        <Router.Routes>
          <Router.Route path="/" element={<ViewRouter view="home" />} />
          <Router.Route path="translation" element={<TranslationRouter />}>
            <Router.Route path="*" />
          </Router.Route>
          <Router.Route path="most-used" element={<MostUsedRouter />}>
            <Router.Route path="*" />
          </Router.Route>
          <Router.Route path="learned" element={<LearnedRouter />}>
            <Router.Route path="*" />
          </Router.Route>
        </Router.Routes>
        <Header />
        <Views />
      </Router.HashRouter>
    </ApiKey>
  );
}

function Views() {
  const view = Hooks.useSelector($.getView);
  switch (view) {
    case 'home':
      return <HomePage />;
    case 'translation-list':
      return <TranslationList />;
    case 'translation':
      return <Translation />;
    case 'most-used':
      return <MostUsed />;
    case 'learned':
      return <Learned />;
    default:
      throw new UnhandledCaseError(view, 'Unhandled view');
  }
}
