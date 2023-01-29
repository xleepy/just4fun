import { useState, useRef } from "preact/hooks";

type PromiseState = "pending" | "fulfilled" | "rejected";

type HookState<T> = {
  promiseState: PromiseState;
  data?: T;
  err?: Error;
};

const fetchCache = new Map<string, Promise<any>>();

// https://github.com/reactwg/react-18/discussions/82
// no need for mounted/unmounted check in promise
export function usePromise<T>(
  promiseFn: () => Promise<T>,
  key: string
): [T | undefined, PromiseState, Error | undefined] {
  const [{ promiseState, data, err }, setHookState] = useState<HookState<T>>(
    () => {
      return {
        promiseState: "pending",
      };
    }
  );
  const promiseRef = useRef<Promise<void>>();

  const isCached = fetchCache.has(key);

  if (!promiseRef.current && !isCached) {
    promiseRef.current = promiseFn()
      .then((data) => {
        setHookState({
          promiseState: "fulfilled",
          data,
        });
      })
      .catch((err) => {
        setHookState({
          promiseState: "rejected",
          err,
        });
      })
      .finally(() => {
        fetchCache.delete(key);
      });

    fetchCache.set(key, promiseRef.current);
  }

  if (err) {
    throw err;
  }

  if (!data && isCached) {
    // https://github.com/preactjs/preact/blob/master/compat/src/suspense.js#L6
    throw promiseRef.current;
  }

  return [data, promiseState, err];
}
