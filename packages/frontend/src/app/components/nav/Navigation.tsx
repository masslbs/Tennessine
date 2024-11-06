// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDisconnect } from "wagmi";

import { logger, assert } from "@massmarket/utils";

import { Order, OrderId, OrderState, Status } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import { useClient } from "@/context/AuthContext";
import { useUserContext } from "@/context/UserContext";
import Cart from "@/app/cart/Cart";
import { createQueryString } from "@/app/utils";

const merchantMenu = [
  {
    title: "Dashboard",
    img: "menu-dashboard.svg",
    href: "/merchant-dashboard",
  },
  //TODO: href for orders, contact, share.
  { title: "Manage Products", img: "menu-products.svg", href: "/products" },
  { title: "Manage Orders", img: "menu-order.svg", href: "/" },
  { title: "Shop Settings", img: "menu-settings.svg", href: "/store" },
  { title: "Disconnect", img: "menu-disconnect.svg" },
];

const namespace = "frontend:Navigation";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

function Navigation() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [basketOpen, setBasketOpen] = useState<boolean>(false);
  const [cartLength, setLength] = useState<number>(0);
  const { clientConnected, setIsConnected, isMerchantView } = useClient();
  const { shopDetails, setCommittedOrderId } = useStoreContext();
  const { clientWithStateManager } = useUserContext();
  const searchParams = useSearchParams();

  const router = useRouter();
  const { disconnect } = useDisconnect();

  const customerMenu = [
    { title: "Shop", img: "menu-products.svg", href: "/products" },
    {
      title: "Basket",
      img: "menu-basket.svg",
      href: `/checkout?${createQueryString("step", "cart", searchParams)}`,
    },
    { title: "Contact", img: "menu-contact.svg", href: "/" },
    { title: "Share", img: "menu-share.svg", href: "/" },
  ];

  useEffect(() => {
    function onChangeItems(order: Order) {
      const values = Object.values(order.items);
      let length = 0;
      values.map((qty) => (length += Number(qty)));
      setLength(length);
    }
    function txHashDetected(order: Order) {
      if (order.status === OrderState.STATE_PAYMENT_TX) {
        setLength(0);
      }
    }
    if (clientWithStateManager?.stateManager) {
      clientWithStateManager.stateManager.orders.on(
        "changeItems",
        onChangeItems,
      );

      clientWithStateManager!.stateManager.orders.on(
        "addPaymentTx",
        txHashDetected,
      );
      return () => {
        clientWithStateManager!.stateManager!.orders.removeListener(
          "addPaymentTx",
          txHashDetected,
        );
        clientWithStateManager!.stateManager!.orders.removeListener(
          "changeItems",
          onChangeItems,
        );
      };
    }
  }, [clientWithStateManager?.stateManager]);

  function onDisconnect() {
    setMenuOpen(false);
    localStorage.clear();
    disconnect();
    router.push("/merchants");
    setIsConnected(Status.Pending);
  }

  function menuSwitch() {
    setMenuOpen(!menuOpen);
    basketOpen && setBasketOpen(false);
  }

  async function onCheckout(orderId: OrderId) {
    try {
      if (!orderId) {
        debug("orderId not found");
        throw new Error("No order found");
      }
      await clientWithStateManager!.stateManager!.orders.commit(orderId);
      setBasketOpen(false);
      debug(`Order ID: ${orderId} committed`);
      setCommittedOrderId(orderId);
      router.push(
        `/checkout?${createQueryString(
          "step",
          "shippingDetails",
          searchParams,
        )}`,
      );
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("error committing order", error);
      // TODO: show error to user
    }
  }

  function renderMenuItems() {
    const menuItems = isMerchantView ? merchantMenu : customerMenu;
    return menuItems.map((opt, i) => {
      if (opt.title === "Disconnect") {
        return (
          <button key={i} onClick={onDisconnect}>
            <div className="flex gap-3 items-center">
              <Image
                src={`/icons/${opt.img}`}
                width={20}
                height={20}
                alt="menu-item"
                unoptimized={true}
                priority={true}
                className="w-5 h-5"
              />
              <h2 className="font-normal">{opt.title}</h2>
              <Image
                src="/icons/chevron-right.svg"
                width={12}
                height={12}
                alt="chevron-right"
                unoptimized={true}
                priority={true}
                className="ml-auto w-3 h-3"
              />
            </div>
          </button>
        );
      }

      return (
        <div
          data-testid={`menu-button-${opt.title}`}
          key={i}
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex gap-3 items-center">
            <Image
              src={`/icons/${opt.img}`}
              width={20}
              height={20}
              alt="menu-item"
              unoptimized={true}
              priority={true}
              className="w-5 h-5"
            />
            <Link href={opt.href!} key={opt.title}>
              <h2 className="font-normal">{opt.title}</h2>
            </Link>
            <Image
              src="/icons/chevron-right.svg"
              width={12}
              height={12}
              alt="chevron-right"
              unoptimized={true}
              priority={true}
              className="ml-auto w-3 h-3"
            />
          </div>
        </div>
      );
    });
  }

  return (
    <section className={`absolute left-0 top-0 right-0`}>
      <section className="w-full p-2 text-base flex justify-between bg-white">
        <div className="flex gap-2">
          {shopDetails.profilePictureUrl ? (
            <div className="overflow-hidden	rounded-full w-12 h-12">
              <Image
                src={shopDetails.profilePictureUrl}
                width={50}
                height={50}
                alt="profile-avatar"
                unoptimized={true}
                priority={true}
                className="w-12 h-12"
              />
            </div>
          ) : (
            <Image
              src={`/icons/mass-labs-logo.svg`}
              width={40}
              height={40}
              alt="mass-labs-logo"
              unoptimized={true}
              priority={true}
              className="w-10 h-10"
            />
          )}

          <h2 className="flex items-center">{shopDetails.name}</h2>
        </div>
        <section
          className={`flex gap-6 p-2 ${
            clientConnected === Status.Complete ? "" : "hidden"
          }`}
        >
          <button
            className="relative"
            onClick={() => setBasketOpen(!basketOpen)}
          >
            <Image
              src="/icons/menu-basket.svg"
              width={20}
              height={20}
              alt="basket-icon"
              unoptimized={true}
              className="w-5 h-5"
            />
            <div
              className={`${
                !cartLength ? "hidden" : ""
              } bg-red-700 rounded-full absolute top-0 left-3 w-4 h-4 flex justify-center items-center`}
            >
              <p className="text-white text-[10px]">{cartLength}</p>
            </div>
          </button>
          <button onClick={menuSwitch}>
            <Image
              src={menuOpen ? "/icons/close-icon.svg" : "/icons/hamburger.svg"}
              width={20}
              height={20}
              alt="menu-icon"
              unoptimized={true}
              className="w-5 h-5"
            />
          </button>
        </section>
      </section>
      {menuOpen ? (
        <section>
          <span className="fixed bg-black w-full h-full opacity-60" />
          <div className="fixed bg-background-gray z-10 w-full flex flex-col gap-5 rounded-b-lg p-5">
            {renderMenuItems()}
          </div>
        </section>
      ) : null}
      {basketOpen ? (
        <section>
          <span className="fixed bg-black w-full h-full opacity-60" />
          <div className="fixed bg-background-gray z-10 w-full flex flex-col gap-5 rounded-b-lg p-5">
            <Cart onCheckout={onCheckout} />
          </div>
        </section>
      ) : null}
    </section>
  );
}

export default Navigation;
