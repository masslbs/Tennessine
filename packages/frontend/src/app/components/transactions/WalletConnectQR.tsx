import React, { useState, useEffect } from "react";
import {
  useSwitchAccount,
  useSendTransaction,
  useAccount,
  useConnect,
} from "wagmi";
import { parseEther } from "viem";

function WalletConnectQR({ purchaseAddress, displayedTotal }) {
  const { switchAccount } = useSwitchAccount();
  const { connectors, connect } = useConnect();

  const { sendTransaction } = useSendTransaction();
  const account = useAccount();
  console.log({ account });

  const handleTransaction = () => {
    sendTransaction({
      to: purchaseAddress,
      value: displayedTotal,
    });
  };
  const displayConnectors = () => {
    return connectors.map((connector) => (
      <button
        key={connector.uid}
        onClick={() => connect({ connector })}
        className="p-4 bg-white my-4 border rounded w-full"
      >
        {connector.name}
      </button>
    ));
  };
  // async function handleSend() {
  //   if (!account.length) throw Error("No account found");
  //   try {
  //     const tx = {
  //       from: account,
  //       to: "0xBDE1EAE59cE082505bB73fedBa56252b1b9C60Ce",
  //       data: "0x",
  //       gasPrice: "0x029104e28c",
  //       gasLimit: "0x5208",
  //       value: "0x00",
  //     };

  //     const result = await signClient.request({
  //       topic: session.topic,
  //       chainId: "eip155:5",
  //       request: {
  //         method: "eth_sendTransaction",
  //         params: [tx],
  //       },
  //     });
  //     setTxnUrl(result);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  return (
    <div className="App">
      <h1>Sign v2 Standalone</h1>
      <div>{displayConnectors()}</div>
      <button onClick={}>Send transaction</button>
    </div>
  );
}

export default WalletConnectQR;
