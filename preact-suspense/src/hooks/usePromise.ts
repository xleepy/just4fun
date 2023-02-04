import { useState, useRef, useEffect, useCallback } from "preact/hooks";

type PromiseState = "pending" | "fulfilled" | "rejected";

type HookState<T> = {
  promiseState: PromiseState;
  data?: T;
  err?: Error;
};

// usePrevious reference: https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_accessibility#more_robust_focus_management
// we need to provide initial value here otherwise component will be invalidated in each rerender try in suspense mode
export function usePrevious<T>(value?: T): T | undefined {
  const ref = useRef<T | undefined>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const fetchCache = new Map<string, Promise<any>>();

type Options = {
  suspense?: boolean;
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

  // mounted needed for request not in suspense mode
  const [isMounted, setMounted] = useState(false);
  const prevKey = usePrevious(key);
  const isSuspense = options?.suspense ?? false;
  const shouldRefetch = prevKey !== key;

  useEffect(() => {
    setMounted(true);
    return () => {
      // delete key on unmount
      if (fetchCache.has(key)) {
        fetchCache.delete(key);
      }
    };
    // Don't want to rerun hook on each key change
    // Should be removed only on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      console.log("removed prevkey", prevKey);
      // delete previous promise reference
      if (prevKey && fetchCache.has(prevKey) && shouldRefetch) {
        fetchCache.delete(prevKey);
      }
    };
  }, [shouldRefetch, prevKey]);

  const runPromise = useCallback(async () => {
    // get cached promise or run another request
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

  console.log("should refetch for:", key, shouldRefetch);

  useEffect(() => {
    // not in suspense mode we should call promise in useEffect to prevent rendering issues
    const isChanged = shouldRefetch || isMounted;
    if (!isSuspense && isChanged) {
      runPromise();
    }
  }, [isSuspense, shouldRefetch, isMounted, runPromise]);

  // in suspense mode promise should be thrown or error in case error received
  if (isSuspense && (shouldRefetch || !data)) {
    // https://github.com/preactjs/preact/blob/master/compat/src/suspense.js#L6
    throw err ? err : runPromise();
  }

  return [data, promiseState, err];
}
