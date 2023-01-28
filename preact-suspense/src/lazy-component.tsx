import { lazy } from "preact/compat";
import { usePromise } from "./hooks";

const LazyLorem = lazy(() =>
  import("./lorem").then(({ Lorem }) => ({ default: Lorem }))
);

export function LazyComponent() {
  const [data, state] = usePromise<any[]>(() => {
    return fetch(`https://www.reddit.com/r/react.json`)
      .then((response) => response.json())
      .then(({ data }) => {
        return data.children.map((d: any) => d.data);
      });
  });

  console.log("promise state", state);

  console.log(this);

  return (
    <div>
      {`Promise state: ${state}`}
      <LazyLorem />
      {data?.map((post) => {
        return (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.author}</p>
          </div>
        );
      })}
    </div>
  );
}
