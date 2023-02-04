import { render, renderHook, waitFor } from "@testing-library/preact";
import { usePromise } from "./usePromise";
import { h } from "preact";
import { useState } from "preact/hooks";
import { Suspense } from "preact/compat";

describe("usePromise tests", () => {
  describe("usual promise call", () => {
    it("should call promise and return result", async () => {
      const mockPromise = jest.fn(() => Promise.resolve("test"));
      const { result } = renderHook(() => usePromise(mockPromise, "test"));
      expect(mockPromise).toHaveBeenCalled();
      await waitFor(() => {
        expect(result.current[0]).toBe("test");
      });
    });

    it("should return error of rejected promise", async () => {
      const mockPromise = jest.fn(() => Promise.reject("Something went wrong"));
      const { result } = renderHook(() => usePromise(mockPromise, "test"));
      await waitFor(() => {
        expect(result.current[2]).toBe("Something went wrong");
      });
    });

    it("should refetch data if key changed", async () => {
      const mockPromise = jest.fn(() =>
        Promise.resolve("Something went wrong")
      );
      const { rerender } = renderHook((key) => usePromise(mockPromise, key), {
        initialProps: "test",
      });
      expect(mockPromise).toHaveBeenCalledTimes(1);
      rerender("new key");
      expect(mockPromise).toHaveBeenCalledTimes(2);
    });
  });

  describe("suspense tests", () => {
    const mockPromise = jest.fn((key: string) => {
      console.log("called with", key);
      return Promise.resolve(key);
    });
    const LazyComponent = ({ query }: { query: string }) => {
      const [data] = usePromise(() => mockPromise(query), query, {
        suspense: true,
      });
      return <p data-testid="component-result">{data}</p>;
    };
    const App = () => {
      const [query, setQuery] = useState("test");
      const [isVisible, setVisibility] = useState(true);
      return (
        <div>
          <input
            data-testid="test-input"
            value={query}
            onChange={(event) => {
              const inputElem = event.target as HTMLInputElement;
              setQuery(inputElem.value);
            }}
          />
          <button
            onClick={() => setVisibility((prevState) => !prevState)}
            data-testid="test-visibility"
          >
            Visibility test
          </button>
          <Suspense fallback={<p data-testid="fallback">Loading....</p>}>
            {isVisible && <LazyComponent query={query} />}
          </Suspense>
        </div>
      );
    };

    const setupApp = () => {
      return render(<App />);
    };

    it.skip("should render component and call promise with initial key", async () => {
      const { findByTestId } = setupApp();

      const loadingFallback = await findByTestId("fallback");
      expect(loadingFallback.textContent).toBe("Loading....");

      await waitFor(async () => {
        const result = await findByTestId("component-result");
        expect(result.textContent).toBe("test");
      });
    });
  });
});
