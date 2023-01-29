import { useState, useRef, useEffect } from "preact/hooks";

type PromiseState = "pending" | "fulfilled" | "rejected";

type HookState<T> = {
  promiseState: PromiseState;
  data?: T;
  err?: Error;
};

const fetchCache = new Map<string, Promise<any>>();

type Options = {
  suspense: boolean;
};

// https://github.com/reactwg/react-18/discussions/82
// no need for mounted/unmounted check in promise
export function usePromise<T>(
  promiseFn: () => Promise<T>,
  key: string,
  options?: Options
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

  console.log(key, isCached);

  if (!promiseRef.current && !isCached) {
    promiseRef.current = promiseFn()
      .then((data) => {
        // calls state on unmounted
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

  const cached = fetchCache.get(key);

  if (options?.suspense && !data && isCached) {
    // https://github.com/preactjs/preact/blob/master/compat/src/suspense.js#L6
    throw err ? err : promiseRef.current;
  }

  return [data, promiseState, err];
}
