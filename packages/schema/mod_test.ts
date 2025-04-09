import { assertEquals } from "@std/assert";
import { extractEntriesFromHAMT, fetchAndDecode } from "@massmarket/utils";
import type { CodecValue } from "@massmarket/utils/codec";
import { Listing, Manifest, Order } from "./mod.ts";

type Rmap = Map<string, Rmap>;
type TestVector = Map<
  string,
  Array<Map<string, Map<string, Map<string, Map<string, CodecValue>>>>>
>;
Deno.test("unpack manifest vectors", async (t) => {
  const manifestOkayVector = await fetchAndDecode("ManifestOkay");
  const manifestOkayVectorSnapshots = manifestOkayVector.get(
    "Snapshots",
  ) as Array<Rmap>;

  const vector = manifestOkayVectorSnapshots.map(
    (snapshot) => {
      return {
        name: snapshot.get("Name") as unknown as string,
        value: snapshot?.get("After")?.get("Value")?.get("Manifest")!,
      };
    },
  ) || [];

  console.log("count of manifests", vector.length);
  for (const manifest of vector) {
    await t.step(manifest.name as string, () => {
      const unpacked = Manifest.fromCBOR(
        manifest.value as Map<string, unknown>,
      );
      console.log(unpacked);
      assertEquals(unpacked.asCBORMap(), manifest.value);
    });
  }
});

Deno.test("unpack listing vectors", async (t) => {
  const listingOkayVector = await fetchAndDecode("ListingOkay") as TestVector;

  const vectors = (listingOkayVector?.get("Snapshots") as unknown as [])?.map(
    (snapshot: Rmap) => {
      const values = extractEntriesFromHAMT(
        snapshot!.get("After")!.get("Value")!.get("Listings"),
      );
      return {
        name: snapshot!.get("Name"),
        values: values,
      };
    },
  ) || [];

  console.log("count of listings", vectors.length);
  for (const vector of vectors) {
    for (const [id, listing] of vector.values.entries()) {
      await t.step(`${vector.name} - ${id}`, () => {
        console.log("listing:", vector.name, id);
        console.log(listing);
        const unpacked = Listing.fromCBOR(listing as Map<string, unknown>);
        console.log(unpacked);
        assertEquals(unpacked.asCBORMap(), listing);
      });
    }
  }
});

Deno.test("unpack order vectors", async () => {
  const orderOkayVector = await fetchAndDecode("OrderOkay");

  const orders = (orderOkayVector?.get("Snapshots") as unknown as [])?.map(
    (snapshot: Rmap) => {
      const hamtNode = snapshot?.get("After")?.get("Value")?.get("Orders");
      return extractEntriesFromHAMT(hamtNode);
    },
  ) || [];

  console.log("count of orders", orders.length);

  for (const orderMap of orders) {
    for (const [id, order] of orderMap.entries()) {
      console.log("order id", id);
      const unpacked = Order.fromCBOR(order);
      console.log(unpacked);
      assertEquals(unpacked.asCBORMap(), order);
    }
  }
});

// Deno.test("AcceptedCurrencyMap addAddress/removeAddress", () => {
//   const currencies = new AcceptedCurrencyMap();
//   const chainId = 1;
//   const address1 = new Uint8Array([1, 2, 3]);
//   const address2 = new Uint8Array([4, 5, 6]);

//   currencies.addAddress(chainId, address1, false);
//   currencies.addAddress(chainId, address2, true);
//   const result1 = currencies.getAddressesByChainID(chainId);
//   assertEquals(result1?.size, 2);
//   assertEquals(result1?.get(address1)?.get("IsContract"), false);
//   assertEquals(result1?.get(address2)?.get("IsContract"), true);

//   currencies.removeAddress(chainId, address1);
//   const result2 = currencies.getAddressesByChainID(chainId);
//   assertEquals(result2?.size, 1);
//   assertEquals(result2?.get(address2)?.get("IsContract"), true);
// });

// Deno.test("PayeeMap addAddress", () => {
//   const payees = new PayeeMap();

//   const address1 = new Uint8Array([1, 2, 3]);
//   const address2 = new Uint8Array([4, 5, 6]);

//   payees.addAddress(1, address1, false);
//   payees.addAddress(2, address2, true);
//   assertEquals(payees.get(1)?.get(address1)?.CallAsContract, false);
//   assertEquals(payees.get(2)?.get(address2)?.CallAsContract, true);
// });
