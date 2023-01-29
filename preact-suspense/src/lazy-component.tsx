import { lazy } from "preact/compat";
import { usePromise } from "./hooks";

export function LazyComponent() {
  const [data, state] = usePromise<any[]>(
    () => {
      return fetch(`https://www.reddit.com/r/react.json`)
        .then((response) => response.json())
        .then(({ data }) => {
          return data.children.map((d: any) => d.data);
        });
    },
    "unique-key",
    { suspense: true }
  );

  // render error
  // const [test] = usePromise(() => Promise.resolve("test"), "another-key");

  console.log("promise state", state);

  return (
    <div>
      {/* <p>{`test value ${test}`}</p> */}
      <p>{`Promise state: ${state}`}</p>
      <ul>
        {data?.map((post) => {
          return (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.author}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
