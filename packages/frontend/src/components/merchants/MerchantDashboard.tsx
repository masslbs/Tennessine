// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import { Link } from "@tanstack/react-router";

import Transactions from "./Transactions.tsx";
import ButtonLink from "../common/ButtonLink.tsx";
import ChevronRight from "../common/ChevronRight.tsx";
export default function MerchantDashboard() {
  return (
    <main
      className="px-4 pt-[10px] md:flex justify-center"
      data-testid="merchant-dashboard-screen"
    >
      <section className="md:w-[1000px] md:flex justify-center gap-2">
        <section className="mb-2 md:w-1/3">
          <h1>Dashboard</h1>
          <div className="flex flex-col gap-1 pt-1">
            <Link
              className="flex items-center gap-1 px-3 py-[10px] bg-white rounded-md"
              to="/edit-listing"
              search={(prev: Record<string, string>) => ({
                shopId: prev.shopId,
              })}
              style={{ color: "black" }}
            >
              Add new product
              <div className="ml-auto">
                <ChevronRight />
              </div>
            </Link>
            <Link
              className="flex items-center gap-1 px-3 py-[10px] bg-white rounded-md"
              to="/listings"
              search={(prev: Record<string, string>) => ({
                shopId: prev.shopId,
              })}
              style={{ color: "black" }}
            >
              <p>View products</p>
              <div className="ml-auto">
                <ChevronRight />
              </div>
            </Link>

            <Link
              to="/settings"
              search={(prev: Record<string, string>) => ({
                shopId: prev.shopId,
              })}
              className="flex items-center gap-1 px-3 py-[10px] bg-white rounded-md"
              style={{ color: "black" }}
            >
              <p>Shop settings</p>
              <div className="ml-auto">
                <ChevronRight />
              </div>
            </Link>
          </div>
        </section>
        <section className="bg-white rounded-md md:w-2/3 md:bg-transparent md:pt-0 py-3">
          <h2 className="md:mb-2 px-3">Latest Orders</h2>
          <Transactions displayLastFour />
          <div className="flex mt-3 ml-3">
            <ButtonLink to="/orders">View all orders</ButtonLink>
          </div>
        </section>
      </section>
    </main>
  );
}
