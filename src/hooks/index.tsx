import * as React from 'react';
import * as Redux from 'react-redux';
import { Selector } from 'src/@types';
import { T } from 'src';

type PromiseState<T> =
  | { type: 'pending' }
  | { type: 'fulfilled'; value: T }
  | { type: 'rejected'; error: unknown };

export function useInfalliblePromise<T>(promise: Promise<T>): null | T {
  const [inner, setInner] = React.useState<T | null>(null);
  React.useEffect(() => {
    promise
      .then((value) => {
        setInner(value);
      })
      .catch((error) => {
        console.error('An assumed infallible promise failed.', error);
      });
  }, [promise]);
  return inner;
}

const pending: PromiseState<any> = {
  type: 'pending',
};

export function usePromise<T>(promise: Promise<T>): PromiseState<T> {
  const [inner, setInner] = React.useState<PromiseState<T>>(pending);
  React.useEffect(() => {
    promise.then(
      (value: T) => {
        setInner({ type: 'fulfilled', value });
      },
      (error: unknown) => {
        setInner({ type: 'rejected', error });
      },
    );
  }, [promise]);
  return inner;
}

export function usePromiseSelector<T>(
  selector: Selector<Promise<T>>,
): PromiseState<T> {
  return usePromise(Redux.useSelector(selector));
}

export function useStore(): T.Store {
  return Redux.useStore() as T.Store;
}

export function useDispatch(): T.Dispatch {
  return Redux.useDispatch();
}

export { useSelector } from 'react-redux';
