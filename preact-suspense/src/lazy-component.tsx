import { useRef, useState } from "preact/hooks";
import { lazy } from "preact/compat";

type PromiseState = "pending" | "fulfilled" | "rejected";

const LazyLorem = lazy(() =>
  import("./lorem").then(({ Lorem }) => ({ default: Lorem }))
);

function usePromise<T>(promiseFn: () => Promise<T>) {
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

export function LazyComponent() {
  const data = usePromise(() => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("Hi from lazy");
      }, 1000);
    });
  });

  return (
    <div>
      {data}
      <LazyLorem />
    </div>
  );
}
