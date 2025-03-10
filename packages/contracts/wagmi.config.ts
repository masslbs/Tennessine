import { react } from "npm:@wagmi/cli/plugins";

const contractsPath = Deno.env.get("MASS_CONTRACTS_PATH");
const abipath = contractsPath + "/abi/";

async function importJson(path: string) {
  const mod = await import(path, {
    with: {
      type: "json",
    },
  });
  return mod.default;
}

const PaymentsByAddress = await importJson(
  abipath + "PaymentsByAddress.json",
);
const RelayReg = await importJson(abipath + "RelayReg.json");
const ShopReg = await importJson(abipath + "ShopReg.json");
const Eddies = await importJson(abipath + "Eddies.json");
const addresses = await importJson(contractsPath + "/deploymentAddresses.json");

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
    // todo: replace actions plugin
    // https://github.com/wevm/wagmi/blob/main/packages/cli/src/plugins/actions.ts#L24
  ],
};
