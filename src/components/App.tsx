import * as React from 'react';

import './App.css';
import { ApiKey } from 'src/components/ApiKey';
import { TranslationSuggestions } from 'src/components/TranslationSuggestions';
import { Hooks, $ } from 'src';

export function App() {
  return (
    <ApiKey>
      <TranslationSuggestions />
    </ApiKey>
  );
}
