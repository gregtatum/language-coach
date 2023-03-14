import { createStore } from 'src/store/create-store';
import { App } from 'src/components/App';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';

describe('app', () => {
  it('can render', () => {
    const store = createStore();
    render(
      <Provider store={store as any}>
        <App />
      </Provider>,
    );
    expect(screen.getByText(/React/)).toBeTruthy();
  });
});
