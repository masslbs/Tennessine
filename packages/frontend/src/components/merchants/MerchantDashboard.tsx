// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import { Link } from "@tanstack/react-router";

import Transactions from "./Transactions.tsx";

export default function MerchantDashboard() {
  return (
    <main
      className="p-4 md:flex justify-center h-screen"
      data-testid="merchant-dashboard-screen"
    >
      <section className="md:w-[560px]">
        <section className="mb-4">
          <h1>Dashboard</h1>
          <div className="flex flex-col gap-1 pt-4">
            <Link
              className="flex items-center gap-1 p-3 bg-white rounded-md"
              to="/edit-listing"
              search={(prev: Record<string, string>) => ({
                shopId: prev.shopId,
              })}
              style={{ color: "black" }}
            >
              Add new product
              <img
                src={`/icons/chevron-right.svg`}
                width={8}
                height={8}
                alt="chevron-right"
                className="w-2 h-2 ml-auto"
              />
            </Link>
            <Link
              className="flex items-center gap-1 p-3 bg-white rounded-md"
              to="/listings"
              search={(prev: Record<string, string>) => ({
                shopId: prev.shopId,
              })}
              style={{ color: "black" }}
            >
              <p>View products</p>
              <img
                src={`/icons/chevron-right.svg`}
                width={8}
                height={8}
                alt="chevron-right"
                className="w-2 h-2 ml-auto"
              />
            </Link>

            <Link
              to="/settings"
              search={(prev: Record<string, string>) => ({
                shopId: prev.shopId,
              })}
              className="flex items-center gap-1 p-3 bg-white rounded-md"
              style={{ color: "black" }}
            >
              <p>Shop settings</p>
              <img
                src={`/icons/chevron-right.svg`}
                width={8}
                height={8}
                alt="chevron-right"
                className="w-2 h-2 ml-auto"
              />
            </Link>
          </div>
        </section>
        <h2>Latest Orders</h2>
        <Transactions />
      </section>
    </main>
  );
}
