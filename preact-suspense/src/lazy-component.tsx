import { useEffect, useRef, useState } from "preact/hooks";

type PromiseState = "pending" | "fulfilled" | "rejected";

export function LazyComponent() {
  const [promiseState, setPromiseState] = useState<PromiseState>("pending");
  const promiseRef = useRef<Promise<void>>();

  if (!promiseRef.current) {
    promiseRef.current = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    })
      .then(() => {
        setPromiseState("fulfilled");
      })
      .catch(() => {
        setPromiseState("rejected");
      });
  }

  if (promiseState === "pending") {
    throw promiseRef.current;
  }

  return <div>hi from lazy</div>;
}
