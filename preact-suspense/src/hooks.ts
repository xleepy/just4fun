import { useState, useRef } from "preact/hooks";

type PromiseState = "pending" | "fulfilled" | "rejected";

type HookState<T> = {
  promiseState: PromiseState;
  data?: T;
  err?: Error;
};

const keys = new Set<string>();

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
  const keyRef = useRef(key);

  // const isNew = !keys.has(keyRef.current);

  if (!promiseRef.current) {
    keys.add(keyRef.current);
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
      });
  }

  if (err) {
    throw err;
  }

  if (promiseState === "pending") {
    throw promiseRef.current;
  }

  return [data, promiseState, err];
}
