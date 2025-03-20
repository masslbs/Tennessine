import { useCallback, useEffect, useState } from "react";
import { codec } from "@massmarket/utils";
import { useClientWithStateManager } from "./useClientWithStateManager.ts"; // Adjust the import path as needed

/**
 * Subscribe to a path in the StateManager.
 *
 * @param path     the path within the state manager you want to track
 * @param initial  optional initial value to use before we can fetch from the manager
 * @returns [value, setValue] - A tuple with the current value and a setter function
 */
export function useStateManagerValue<T = codec.CodecValue>(
  path: codec.Path,
  initial?: T,
): [T | undefined, (newValue: T) => Promise<void>] {
  const { clientStateManager } = useClientWithStateManager();
  const [val, setVal] = useState<T | undefined>(initial);

  if (!clientStateManager?.stateManager) {
    throw new Error("Client not found");
  }
  const sm = clientStateManager.stateManager;

  // Fetch initial value and subscribe to changes
  useEffect(() => {
    let isMounted = true;

    // Fetch initial value
    sm.get(path).then((currValue) => {
      if (isMounted) {
        setVal(currValue as T);
      }
    }).catch((err) => {
      console.error("Error fetching path:", path, err);
    });

    const listener = (updatedVal: T) => {
      if (isMounted) {
        setVal(updatedVal);
      }
    };
    sm.events.on(listener, path);

    return () => {
      isMounted = false;
      sm.events.off(listener, path);
    };
  }, [sm, path]);

  // Create a stable setter function
  const setValue = useCallback(
    async (newValue: T) => {
      try {
        await sm.set(path, newValue as codec.CodecValue);
      } catch (error) {
        console.error("Error setting path:", path, error);
      }
    },
    [sm, path],
  );

  return [val, setValue];
}
