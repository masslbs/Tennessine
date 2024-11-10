"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { OrderId } from "@/types";
import { useUserContext } from "@/context/UserContext";
import BackButton from "@/app/common/components/BackButton";

export default function OrderDetails() {
  const { clientWithStateManager } = useUserContext();

  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") as OrderId;

  useEffect(() => {
    orderId &&
      clientWithStateManager?.stateManager.orders.get(orderId).then((order) => {
        //TODO: render order details
      });
  }, [orderId]);

  return (
    <main className="pt-under-nav h-screen p-4 mt-5">
      <BackButton href="/merchant-dashboard" />
      <div>
        <h1>Order overview</h1>
      </div>
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <h2>Order items</h2>
      </section>
    </main>
  );
}
