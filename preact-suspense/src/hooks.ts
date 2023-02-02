import { useState, useRef, useEffect, useCallback } from "preact/hooks";

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

  const isSuspense = options?.suspense;

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

  useEffect(() => {
    if (!isSuspense) {
      runPromise();
    }
  }, [isSuspense]);

  if (isSuspense && !data) {
    // https://github.com/preactjs/preact/blob/master/compat/src/suspense.js#L6
    throw err ? err : runPromise();
  }

  return [data, promiseState, err];
}
