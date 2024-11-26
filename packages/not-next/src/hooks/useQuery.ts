import { useState } from "react";
import { hashMessage } from "viem";

// global cache
const queryCache = new Map();

export default function useQuery<T>(
  query: () => Promise<T>,
  deps: unknown[] = [],
) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState(undefined);
  const queryCacheKey = hashMessage(JSON.stringify(deps) + query.toString());

  let { promise, deps: cachedDeps } = queryCache.get(queryCacheKey) ?? {
    promise: undefined,
    deps: [],
  };
  const depsAreSame = cachedDeps.every((elem: unknown, index: number) => {
    return Object.is(elem, deps[index]);
  });
  if (!promise || !depsAreSame) {
    promise = query();
    queryCache.set(queryCacheKey, { promise, deps });
  }
  promise
    .then((r: T) => {
      setIsConnected(true);
      setResult(r);
    })
    .catch(setError);
  return { isConnected, error, result };
}
