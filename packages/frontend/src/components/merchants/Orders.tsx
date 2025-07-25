import { useEffect, useState } from "react";

import { CodecValue } from "@massmarket/utils/codec";
import { useStateManager } from "@massmarket/react-hooks";

import Transactions from "./Transactions.tsx";
import BackButton from "../common/BackButton.tsx";

export default function Orders() {
  const { stateManager } = useStateManager();
  const [orderSize, setOrderSize] = useState(0);

  useEffect(() => {
    if (!stateManager) return;
    function ordersEvent(res: CodecValue | undefined) {
      if (res instanceof Map) {
        setOrderSize(res.size);
      }
    }

    stateManager.get(["Orders"]).then(
      (res: CodecValue | undefined) => {
        if (res instanceof Map) {
          setOrderSize(res.size);
        }
      },
    );

    stateManager.events.on(ordersEvent, ["Orders"]);

    return () => {
      stateManager.events.off(
        ordersEvent,
        ["Orders"],
      );
    };
  }, [stateManager]);

  return (
    <main className="px-5 md:flex justify-center">
      <section
        data-testid-="transactions-container"
        className="md:w-[1000px]"
      >
        <BackButton />
        <h1 className="my-[10px]">Manage Orders ({orderSize})</h1>
        <section className="p-1 rounded-lg">
          <Transactions />
        </section>
      </section>
    </main>
  );
}
