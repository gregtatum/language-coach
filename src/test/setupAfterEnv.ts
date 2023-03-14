// @ts-expect-error - Not sure why this is breaking.
import fetchMock from 'fetch-mock-jest';
import { join } from 'path';

require('dotenv').config({ path: join(__dirname, '../../.env.test') });

const originalEnv = process.env;

beforeEach(function () {
  jest.resetModules();
  global.fetch = fetchMock.sandbox();
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.clearAllTimers();
  jest.useRealTimers();
  fetchMock.mockReset();

  process.env = originalEnv;
});
