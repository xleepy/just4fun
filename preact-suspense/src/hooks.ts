import { useState, useRef, useEffect, useCallback } from "preact/hooks";

type PromiseState = "pending" | "fulfilled" | "rejected";

type HookState<T> = {
  promiseState: PromiseState;
  data?: T;
  err?: Error;
};

// usePrevious reference: https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_accessibility#more_robust_focus_management
export function usePrevious<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

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

  const prevKey = usePrevious(key);

  const isSuspense = options?.suspense;

  const shouldRefetch = prevKey !== key;

  useEffect(() => {
    return () => {
      console.log("called unmount with", key);
      if (fetchCache.has(key)) {
        fetchCache.delete(key);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      console.log("removed prevkey", prevKey);
      if (fetchCache.has(prevKey) && shouldRefetch) {
        fetchCache.delete(prevKey);
      }
    };
  }, [shouldRefetch, prevKey]);

  const runPromise = useCallback(async () => {
    const current = fetchCache.get(key) ?? promiseFn();
    console.log("current", current);
    try {
      fetchCache.set(key, current);
      const data = await current;
      console.log(data);
      setHookState({ data, promiseState: "fulfilled" });
    } catch (err: any) {
      setHookState({ err, promiseState: "rejected" });
    }
  }, [key, promiseFn]);

  console.log("should refetch", shouldRefetch);

  useEffect(() => {
    if (!isSuspense || shouldRefetch) {
      runPromise();
    }
  }, [isSuspense, shouldRefetch]);

  if (isSuspense && (shouldRefetch || !data)) {
    // https://github.com/preactjs/preact/blob/master/compat/src/suspense.js#L6
    throw err ? err : runPromise();
  }

  return [data, promiseState, err];
}
