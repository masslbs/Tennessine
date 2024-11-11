"use client";

import React from "react";

import BackButton from "@/app/common/components/BackButton";

export default function OrderDetails({ order }) {
  console.log({ order });
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
