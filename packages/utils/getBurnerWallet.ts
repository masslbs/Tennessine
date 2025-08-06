import { type Chain, createWalletClient, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

export function getBurnerWallet(chain: Chain) {
  const privateKey =
    globalThis.localStorage.getItem("burnerWallet-pk") as `0x${string}` ??
      generatePrivateKey();
  const burnerAccount = privateKeyToAccount(privateKey);
  const burnerWallet = createWalletClient({
    account: burnerAccount,
    chain,
    transport: http(),
  });

  if (!privateKey) {
    globalThis.localStorage.setItem("burnerWallet-pk", privateKey);
  }

  return { burnerWallet, burnerAccount };
}
