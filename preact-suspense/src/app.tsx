import "./app.css";
import { Suspense, useState } from "preact/compat";
import { LazyComponent } from "./lazy-component";

export function App() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount((prevCount) => prevCount + 1);
  };
  return (
    <div>
      <button className="counter" onClick={handleClick}>
        {`Current count: ${count}`}
      </button>
      <Suspense fallback={<p>loading...</p>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}
