import { usePromise } from "./usePromise";

type Props = {
  query: string;
};

export function LazyComponent({ query }: Props) {
  const [data, state] = usePromise<any[]>(
    () => {
      return fetch(`https://www.reddit.com/r/${query}.json`)
        .then((response) => response.json())
        .then(({ data }) => {
          if (!data) {
            return [];
          }
          return data.children.map((d: any) => d.data);
        });
    },
    query,
    { suspense: true }
  );

  const [test] = usePromise(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("test");
        }, 1000);
      }),
    "another-key",
    { suspense: true }
  );

  console.log("promise state", state);

  return (
    <div>
      <p>{`test value ${test}`}</p>
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
