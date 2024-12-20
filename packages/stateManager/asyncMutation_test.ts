import { afterAll, beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import type { StateManager } from "./mod.ts";
import type { MockClient } from "./mockClient.ts";
import { setupTestManager } from "./testUtils.ts";
import { ListingViewState } from "./types.ts";

describe("async mutations", () => {
  let client: MockClient;
  let stateManager: StateManager;
  const closers: (() => Promise<void>)[] = [];
  beforeEach(async () => {
    const tester = await setupTestManager();
    closers.push(tester.close);
    client = tester.client;
    stateManager = tester.stateManager;
    //Store test vector address to db for event verification
    await stateManager.keycards.addAddress(client.keyCardWallet.address);
    stateManager.eventStreamProcessing().then();
  });
  afterAll(async () => {
    await Promise.all(closers);
  });

  it("create/update functions are run in order", async () => {
    const metadata = {
      title: "Test Item 1",
      description: "Test description 1",
      images: ["https://http.cat/images/201.jpg"],
    };

    const decimals = 18;

    const res = await stateManager.listings.create(
      {
        price: "12.00",
        metadata,
        viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
      },
      decimals,
    );
    const id = res.id;
    const updatedMetadata = {
      title: "Updated Test Item 1",
      description: "Updated it description 1",
      images: ["https://http.cat/images/205.jpg"],
    };
    const results: string[] = [];
    const operations = [
      stateManager.listings
        .update(
          {
            id,
            price: "25.55",
            metadata: updatedMetadata,
          },
          decimals,
        )
        .then(() => results.push("P1")),
      stateManager.listings
        .create(
          {
            price: "5.00",
            metadata,
            viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
          },
          decimals,
        )
        .then(() => results.push("P2")),
      stateManager.listings
        .create(
          {
            price: "3.00",
            metadata,
            viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
          },
          decimals,
        )
        .then(() => results.push("P3")),
    ];

    await Promise.all(operations);
    //Check that the promises are resolved in order even if Promise.all was used.
    expect(results).toEqual(["P1", "P2", "P3"]);
  });

  it("queueClientRequest processes requests in order", async () => {
    const results: string[] = [];
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const delay = (ms: number): Promise<void> =>
      new Promise((resolve) => {
        const timeout = setTimeout(resolve, ms);
        timeouts.push(timeout);
      });

    const operations = [
      stateManager.listings.queueClientRequest(async () => {
        await delay(30);
        results.push("First");
        return "First";
      }),
      stateManager.listings.queueClientRequest(async () => {
        await delay(10);
        results.push("Second");
        return "Second";
      }),
      stateManager.listings.queueClientRequest(async () => {
        await delay(20);
        results.push("Third");
        return "Third";
      }),
    ];

    try {
      await Promise.all(operations);
      expect(results).toEqual(["First", "Second", "Third"]);
    } finally {
      timeouts.forEach((id) => clearTimeout(id));
    }
  });
});
