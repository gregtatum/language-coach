import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'src/store/create-store';
import * as T from 'src/@types';
import { App } from 'src/components/App';
import { mockGoogleAnalytics } from 'src/utils';

export * as A from 'src/store/actions';
export * as $ from 'src/store/selectors';
export * as T from 'src/@types';

if (process.env.NODE_ENV !== 'test') {
  init();
}

export async function init(): Promise<void> {
  mockGoogleAnalytics();

  const store = createStore();
  Object.assign(window as any, { store });
  mountReact(store);
}

export function createRootApp(store: T.Store): JSX.Element {
  return (
    <Provider store={store as any}>
      <App key={'app'} />
    </Provider>
  );
}

function mountReact(store: T.Store): void {
  const mountElement = document.createElement('div');
  mountElement.className = 'AppRoot';
  const body = document.body;
  if (!body) {
    throw new Error(
      'Attempting to mount the <App> React component but no document body was found.',
    );
  }
  body.appendChild(mountElement);
  ReactDOM.render(createRootApp(store), mountElement);
}
