import "./app.css";
import { Suspense, useState } from "preact/compat";
import { LazyComponent } from "./lazy-component";
import { usePromise } from "./hooks";

export function App() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  // fix requests issue on multiple hook calls

  const [mockData] = usePromise(
    () => new Promise<string>((resolve) => resolve("Top level promise call")),
    "mock-promise"
  );
  return (
    <div>
      <button className="counter" onClick={handleClick}>
        {`Current count: ${count}`}
      </button>
      <p>{mockData}</p>
      <Suspense fallback={<p>loading...</p>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}
