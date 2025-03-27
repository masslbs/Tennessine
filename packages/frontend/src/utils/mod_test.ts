import { assertEquals } from "@std/assert";
import { createPublicClient, http, zeroAddress } from "viem";
import { hardhat } from "viem/chains";
import { abi } from "@massmarket/contracts";
const { eddiesAddress } = abi;

import * as Utils from "./mod.ts";

Deno.test("getTokenInformation", async () => {
  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });
  const eth = await Utils.getTokenInformation(
    publicClient,
    zeroAddress,
  );
  assertEquals(eth[0], "ETH");
  assertEquals(eth[1], 18);
  const edd = await Utils.getTokenInformation(
    publicClient,
    eddiesAddress,
  );
  assertEquals(edd[0], "EDD");
  assertEquals(edd[1], 2);
});
