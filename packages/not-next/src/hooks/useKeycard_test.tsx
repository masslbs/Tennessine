// import { afterEach, beforeEach, describe, it } from "jsr:@std/testing/bdd";
// import { assertEquals } from "jsr:@std/assert";
// import { renderHook } from "@testing-library/react-hooks";
// import { random32BytesHex } from "@massmarket/utils";
// import useKeycard from "./useKeycard.ts";

// describe("useKeycard", () => {
//   afterEach(() => localStorage.clear());
//   const randomKC = random32BytesHex();
//   describe("merchant keycard", () => {
//     beforeEach(() => {
//       localStorage.setItem("merchantKC", randomKC);
//     });

//     it("should return correct keycard states", () => {
//       const { result } = renderHook(() => useKeycard());
//       const { keycard, isMerchantKeycard, isGuestKeycard } = result.current;

//       assertEquals(keycard, randomKC);
//       assertEquals(isMerchantKeycard, true);
//       assertEquals(isGuestKeycard, false);
//     });
//   });

//   describe("guest keycard", () => {
//     beforeEach(() => {
//       localStorage.setItem("guestCheckoutKC", random32BytesHex());
//     });

//     it("should return correct keycard states", () => {
//       const { result } = renderHook(() => useKeycard());
//       const { keycard, isMerchantKeycard, isGuestKeycard } = result.current;

//       assertEquals(keycard, randomKC);
//       assertEquals(isMerchantKeycard, false);
//       assertEquals(isGuestKeycard, true);
//     });
//   });
// });
