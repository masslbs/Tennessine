import { useContext, useState } from "react";
import { MassMarketContext } from "../MassMarketContext.tsx";

export function useQuery<T>(
  query: () => Promise<T>,
  deps: unknown[] = [],
) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(false);
  const { queryCache } = useContext(
    MassMarketContext,
  );

  let { promise, deps: cachedDeps } = queryCache.get(query.toString());
  const depsChanged = cachedDeps.every((elem: unknown, index: number) => {
    return Object.is(elem, deps[index]);
  });
  if (!promise || depsChanged) {
    promise = query();
    queryCache.set(promise);
  }
  promise.then(() => setIsConnected(true)).catch(setError);
  return { isConnected, error };
}
