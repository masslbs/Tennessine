import { assertEquals } from "jsr:@std/assert";
import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import * as abi from "@massmarket/contracts";
import * as Utils from "./mod.ts";

Deno.test("getTokenInformation", async () => {
  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });
  const eth = await Utils.getTokenInformation(
    publicClient,
    abi.addresses.zeroAddress,
  );
  assertEquals(eth[0], "ETH");
  assertEquals(eth[1], 18);
  const edd = await Utils.getTokenInformation(
    publicClient,
    abi.addresses.Eddies,
  );
  assertEquals(edd[0], "EDD");
  assertEquals(edd[1], 2);
});
