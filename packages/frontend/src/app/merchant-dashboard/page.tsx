"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// import { useMerchantContext } from "@/context/MerchantContext";
import { useStoreContext } from "@/context/StoreContext";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import Image from "next/image";
import { createQueryString } from "@/app/utils";
import { useSearchParams } from "next/navigation";
import { IStatus, OrderId } from "@/types";
import { OrderState } from "@/context/types";

const MerchantDashboard = () => {
  //   const { storeIds } = useMerchantContext();
  const { storeData, orderItems } = useStoreContext();
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<
    [OrderId, OrderState][] | []
  >([]);

  useEffect(() => {
    const carts = Array.from([...orderItems.entries()]);
    setTransactions(carts);
  }, [orderItems]);

  const renderTransactions = () => {
    return transactions?.length ? (
      transactions.map((entry) => {
        const cartId = entry[0];
        const value = entry[1];
        const transactionHash = value?.txHash || null;
        if (!value?.items) return null;
        const len = Object.keys(value.items).length;
        const status =
          value.status === IStatus.Complete
            ? "green"
            : value.status === IStatus.Failed
              ? "red"
              : "yellow";
        return (
          <div key={cartId}>
            <div className="bg-white border-2 rounded-xl p-3 flex justify-between">
              <p className={`text-${status}-500`}>{value.status}</p>
              <p>{transactionHash?.slice(0, 10)}...</p>
              <p>{len} item(s)</p>
            </div>
          </div>
        );
      })
    ) : (
      <div>
        <p>no transactions</p>
      </div>
    );
  };

  return (
    <main className="pt-under-nav h-screen">
      <div className="flex flex-col justify-between mx-4 mt-4">
        <div className="mb-4">
          <h2>{storeData.name}</h2>
          <div className="flex text-xs gap-1 pt-4">
            <SecondaryButton>
              <Link className="flex items-center gap-1" href="/products">
                Go to Shop
                <Image
                  src="/assets/forward-button.svg"
                  width={12}
                  height={12}
                  alt="forward-icon"
                />
              </Link>
            </SecondaryButton>
            <SecondaryButton>
              <Link
                href={`/products/edit?${createQueryString("itemId", "new", searchParams)}`}
              >
                Add Product +
              </Link>
            </SecondaryButton>
            <SecondaryButton>
              <div className="flex items-center gap-1">
                Settings
                <Image
                  src="/assets/settings.svg"
                  width={12}
                  height={12}
                  alt="settings-icon"
                />
              </div>
            </SecondaryButton>
          </div>
        </div>
        <div className="transactions-container">
          <h2 className="my-4">Transactions</h2>
          {renderTransactions()}
        </div>
      </div>
    </main>
  );
};

export default MerchantDashboard;
