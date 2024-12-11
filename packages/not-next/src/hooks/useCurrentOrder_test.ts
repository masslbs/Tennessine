// import { assertEquals } from "jsr:@std/assert";
// import { cleanup } from "npm:@testing-library/react";
// import { renderHook } from "npm:@testing-library/react";
// import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
// import { useCurrentOrder } from "./useCurrentOrder.ts";

// Deno.skip("test useQuery instantiation", async (t) => {
//   GlobalRegistrator.register({});

//   await t.step("should handle no orders", () => {
//     const { result } = renderHook(() => useCurrentOrder());
//     assertEquals(result.current.currentOrder, null);
//     assertEquals(result.current.isDone, false);
//   });

//   await GlobalRegistrator.unregister();
// });
