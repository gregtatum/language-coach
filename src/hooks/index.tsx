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

export function useListener<
  E extends Element,
  Handler extends E['addEventListener'],
  Type extends Parameters<Handler>[0],
  Listener extends Parameters<Handler>[1],
  Options extends Parameters<Handler>[2],
>(
  elementOrRef: E | React.RefObject<E> | null,
  type: Type | Type[],
  deps: any[],
  callback: Listener,
  options?: Options,
) {
  const types: Type[] = Array.isArray(type) ? type : [type];
  React.useEffect(() => {
    if (!elementOrRef) {
      return () => {};
    }
    const element =
      'current' in elementOrRef ? elementOrRef.current : elementOrRef;
    if (!element) {
      return () => {};
    }
    for (const type of types) {
      element.addEventListener(type, callback, options);
    }

    return () => {
      for (const type of types) {
        element.removeEventListener(type, callback, options);
      }
    };
  }, [elementOrRef, ...deps]);
}
