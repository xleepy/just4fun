import "./app.css";
import { Suspense } from "preact/compat";
import { LazyComponent } from "./lazy-component";

export function App() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <LazyComponent />
    </Suspense>
  );
}
