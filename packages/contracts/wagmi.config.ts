// @ts-check

/** @type {import('@wagmi/cli').Config} */

import { actions, react } from "npm:@wagmi/cli/plugins";
import PaymentsByAddress from "./abi/PaymentsByAddress.json" with {
  type: "json",
};
import RelayReg from "./abi/RelayReg.json" with { type: "json" };
import ShopReg from "./abi/ShopReg.json" with { type: "json" };
import Eddies from "./abi/Eddies.json" with { type: "json" };
import addresses from "./deploymentAddresses.json" with { type: "json" };

export default {
  out: "src/generated.ts",
  contracts: [
    {
      name: "PaymentsByAddress",
      abi: PaymentsByAddress,
      address: addresses.Payments,
    },
    {
      name: "RelayReg",
      abi: RelayReg,
      address: addresses.RelayReg,
    },
    {
      name: "ShopReg",
      abi: ShopReg,
      address: addresses.ShopReg,
    },
    {
      name: "Eddies",
      abi: Eddies,
      address: addresses.Eddies,
    },
  ],
  plugins: [
    react(),
    actions({
      overridePackageName: "wagmi",
    }),
  ],
};
