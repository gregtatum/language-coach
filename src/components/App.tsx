import * as React from 'react';

import './App.css';

import { ApiKey } from './ApiKey';
import { Translation } from './Translation';
import { TranslationList } from './TranslationList';
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
    default:
      throw new UnhandledCaseError(view, 'Unhandled view');
  }
}
