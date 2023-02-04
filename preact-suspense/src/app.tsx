import "./app.css";
import { Suspense, useCallback, useState } from "preact/compat";
import { LazyComponent } from "./lazy-component";
import { usePromise } from "./hooks/usePromise";

export function App() {
  const [query, setQuery] = useState("reactjs");
  const handleInputChange = useCallback((event: Event) => {
    const inputElem = event.target as HTMLInputElement;
    setQuery(inputElem.value);
  }, []);

  const [displayList, setDisplayListState] = useState(true);

  // fix requests issue on multiple hook calls

  const [mockData] = usePromise(
    () => new Promise<string>((resolve) => resolve("Top level promise call")),
    "mock-promise"
  );
  return (
    <div>
      <div className="input-container">
        <input value={query} onChange={handleInputChange} />
        <button onClick={() => setDisplayListState((prevState) => !prevState)}>
          Toggle list
        </button>
      </div>
      <p>{mockData}</p>
      <Suspense fallback={<p>loading...</p>}>
        {displayList && <LazyComponent query={query} />}
      </Suspense>
    </div>
  );
}
