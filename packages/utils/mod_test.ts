import { expect } from "@std/expect";
import { extractEntriesFromHAMT, fetchAndDecode } from "./mod.ts";
import type { CodecValue } from "./codec.ts";

let snapshots: Map<string, Map<string, CodecValue>>[];
Deno.test("fetchAndDecode with ShopOkay vector", async () => {
  const testVector = await fetchAndDecode("ShopOkay");

  // Verify the returned object is a Map (TestVector)
  expect(testVector instanceof Map).toBe(true);

  // Verify it contains expected properties
  expect(testVector.has("Snapshots")).toBe(true);

  // Get the snapshots array
  snapshots = testVector.get("Snapshots") as Map<
    string,
    Map<string, CodecValue>
  >[];
  expect(Array.isArray(snapshots)).toBe(true);

  expect(snapshots.length).toBeGreaterThan(0);
});

Deno.test("hamt extraction gives correct keys (accounts)", () => {
  const firstSnapshot = snapshots[5]; // test case "add-guest-account"
  expect(firstSnapshot instanceof Map).toBe(true);

  // Check if we can access "After" -> "Value" -> "Accounts"
  const after = firstSnapshot.get("After");
  expect(after instanceof Map).toBe(true);

  if (after) {
    const value = after.get("Value");
    expect(value instanceof Map).toBe(true);
    if (value instanceof Map && value.has("Accounts")) {
      const accounts = value.get("Accounts");
      expect(accounts).toBeInstanceOf(Array);

      const accountMap = extractEntriesFromHAMT(accounts);
      if (accountMap) {
        expect(accountMap instanceof Map).toBe(true);
        if (accountMap instanceof Map) {
          // Verify all keys in the account map are Uint8Array(20)
          for (const key of accountMap.keys()) {
            expect(key instanceof Uint8Array).toBe(true);
            const keyArr = key as Uint8Array;
            expect(keyArr.length).toBe(20);
          }
        }
      }
    }
  }
});

Deno.test("hamt extraction gives correct keys (listings)", () => {
  // Find a snapshot with listings
  const listingSnapshot = snapshots.filter((snapshot) => {
    const after = snapshot.get("After");
    if (after instanceof Map) {
      const value = after.get("Value");
      if (value instanceof Map) {
        const listings = value.get("Listings");
        return listings !== undefined;
      }
    }
    return false;
  });

  expect(listingSnapshot.length).toBeGreaterThan(0);

  for (const snapshot of listingSnapshot) {
    const after = snapshot.get("After");
    expect(after instanceof Map).toBe(true);

    if (after) {
      const value = after.get("Value");
      expect(value instanceof Map).toBe(true);

      if (value instanceof Map && value.has("Listings")) {
        const listings = value.get("Listings");
        expect(listings).toBeInstanceOf(Array);

        const listingMap = extractEntriesFromHAMT(listings);
        expect(listingMap instanceof Map).toBe(true);

        if (listingMap instanceof Map) {
          // Verify all keys in the listing map are numbers
          for (const key of listingMap.keys()) {
            expect(typeof key).toBe("number");
          }
        }
      }
    }
  }
});

Deno.test("hamt extraction gives correct keys (orders)", () => {
  // Find a snapshot with orders
  const orderSnapshot = snapshots.filter((snapshot) => {
    const after = snapshot.get("After");
    if (after instanceof Map) {
      const value = after.get("Value");
      if (value instanceof Map) {
        const orders = value.get("Orders");
        return orders !== undefined;
      }
    }
    return false;
  });

  // If no snapshot has orders, this test is inconclusive but shouldn't fail
  expect(orderSnapshot.length).toBeGreaterThan(0);

  for (const snapshot of orderSnapshot) {
    const after = snapshot.get("After");
    expect(after instanceof Map).toBe(true);

    if (after) {
      const value = after.get("Value");
      expect(value instanceof Map).toBe(true);

      if (value instanceof Map && value.has("Orders")) {
        const orders = value.get("Orders");
        expect(orders).toBeInstanceOf(Array);

        const orderMap = extractEntriesFromHAMT(orders);
        expect(orderMap instanceof Map).toBe(true);

        if (orderMap instanceof Map) {
          // Verify all keys in the order map are numbers
          for (const key of orderMap.keys()) {
            expect(typeof key).toBe("number");
          }
        }
      }
    }
  }
});
