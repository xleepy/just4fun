import { useState, useRef } from "preact/hooks";

type PromiseState = "pending" | "fulfilled" | "rejected";

export function usePromise<T>(promiseFn: () => Promise<T>) {
  const [promiseState, setPromiseState] = useState<PromiseState>("pending");
  const [data, setData] = useState<T>();
  const [err, setError] = useState<Error>();
  const promiseRef = useRef<Promise<void>>();
  if (!promiseRef.current) {
    promiseRef.current = promiseFn()
      .then((data) => {
        setPromiseState("fulfilled");
        setData(data);
      })
      .catch((err) => {
        setPromiseState("rejected");
        setError(err);
      });
  }

  if (err) {
    throw err;
  }

  if (promiseState === "pending") {
    throw promiseRef.current;
  }

  return data;
}
