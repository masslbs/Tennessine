// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useDisconnect } from "wagmi";

import { Order, OrderedItem } from "@massmarket/schema";
import { CodecValue } from "@massmarket/utils/codec";

import Cart from "./cart/Cart.tsx";
import { useStateManager } from "../hooks/useStateManager.ts";
import { useShopDetails } from "../hooks/useShopDetails.ts";
import { useKeycard } from "../hooks/useKeycard.ts";
import { useCurrentOrder } from "../hooks/useCurrentOrder.ts";

const merchantMenu = [
  {
    title: "Dashboard",
    img: "menu-dashboard.svg",
    href: "/merchant-dashboard",
  },
  //TODO: href for orders, contact, share.
  { title: "Manage Products", img: "menu-products.svg", href: "/listings" },
  { title: "Manage Orders", img: "menu-order.svg", href: "/orders" },
  { title: "Shop Settings", img: "menu-settings.svg", href: "/settings" },
  { title: "Disconnect", img: "menu-disconnect.svg" },
];

const customerMenu = [
  { title: "Shop", img: "menu-products.svg", href: "/listings" },
  {
    title: "Basket",
    img: "menu-basket.svg",
    href: `/cart`,
  },
  {
    title: "Contact",
    img: "menu-contact.svg",
    href: `/contact`,
  },
  {
    title: "Share",
    img: "menu-share.svg",
    href: `/share`,
  },
];

function Navigation() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [basketOpen, setBasketOpen] = useState<boolean>(false);
  const [cartSize, setCartSize] = useState<number>(0);

  const navigate = useNavigate();
  const { shopDetails } = useShopDetails();
  const { stateManager } = useStateManager();
  const { currentOrder } = useCurrentOrder();
  const [keycard] = useKeycard();
  const { disconnect } = useDisconnect();
  const isMerchantView = keycard.role === "merchant";

  useEffect(() => {
    // in the hook `useCurrentOrder`, we "reset" currentOrder for the states OrderState.Canceled and OrderState.Paid.
    // this is done by setting it to null.
    // TODO (@alp 2025-04-17): raise the question of using a sentinel value for "reset" orderIDs e.g. currentOrder = SENTINEL_ORDER
    //
    // NOTE(@alp 2025-04-17): this same bug (setting currentOrder = null) *might* be afflicting ListingDetail.tsx and
    // the call to cancelAndRecreateOrder
    if (!currentOrder) {
      setCartSize(0);
      return;
    }
    stateManager?.get(["Orders", currentOrder.ID])
      .then((o: CodecValue | undefined) => {
        if (!o) {
          throw new Error("No order found");
        }
        const order = Order.fromCBOR(o);
        // Getting number of items in order.
        let cartSize = 0;
        order.Items.forEach((item: OrderedItem) => (cartSize += item.Quantity));
        setCartSize(cartSize);
      });
  }, [currentOrder]);

  function onDisconnect() {
    setMenuOpen(false);
    localStorage.clear();
    disconnect();
    navigate({
      to: "/merchant-connect",
    });
  }

  function menuSwitch() {
    setMenuOpen(!menuOpen);
    basketOpen && setBasketOpen(false);
  }

  function onCheckout() {
    setBasketOpen(false);
    navigate({
      to: "/shipping",
      search: (prev: Record<string, string>) => ({
        shopId: prev.shopId,
      }),
    });
  }

  function renderMenuItems() {
    const menuItems = isMerchantView ? merchantMenu : customerMenu;
    return menuItems.map((opt, i) => {
      if (opt.title === "Disconnect") {
        return (
          <button
            type="button"
            style={{ backgroundColor: "transparent", padding: 0 }}
            key={i}
            onClick={onDisconnect}
          >
            <div className="flex gap-3 items-center">
              <img
                src={`/icons/${opt.img}`}
                width={20}
                height={20}
                alt="menu-item"
                className="w-5 h-5"
              />
              <h2 className="font-normal">{opt.title}</h2>
              <img
                src="/icons/chevron-right.svg"
                width={12}
                height={12}
                alt="chevron-right"
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
          <Link
            to={opt.href!}
            key={opt.title}
            search={(prev: Record<string, string>) => ({
              shopId: prev.shopId,
            })}
          >
            <div className="flex gap-3 items-center">
              <img
                src={`/icons/${opt.img}`}
                width={20}
                height={20}
                alt="menu-item"
                className="w-5 h-5"
              />
              <h2 className="font-normal text-black">{opt.title}</h2>
              <img
                src="/icons/chevron-right.svg"
                width={12}
                height={12}
                alt="chevron-right"
                className="ml-auto w-3 h-3"
              />
            </div>
          </Link>
        </div>
      );
    });
  }

  return (
    <section>
      <section
        className={`bg-white flex justify-center`}
        data-testid="navigation"
      >
        <section className="w-full p-2 text-base flex justify-between md:w-[800px] mr-3">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={() =>
              navigate({
                to: "/listings",
                search: (prev: Record<string, string>) => ({
                  shopId: prev.shopId,
                }),
              })}
          >
            {shopDetails.profilePictureUrl
              ? (
                <div className="overflow-hidden rounded-full w-12 h-12">
                  <img
                    src={shopDetails.profilePictureUrl}
                    width={50}
                    height={50}
                    alt="profile-avatar"
                    className="w-12 h-12"
                  />
                </div>
              )
              : (
                <img
                  src={`/icons/mass-labs-logo.svg`}
                  width={40}
                  height={40}
                  alt="mass-labs-logo"
                  className="w-10 h-10"
                />
              )}

            <h2 className="flex items-center">{shopDetails.name}</h2>
          </div>
          <section
            className={`flex gap-6`}
          >
            <button
              type="button"
              data-testid="cart-toggle"
              className={`relative ${isMerchantView ? "hidden" : ""}`}
              style={{ backgroundColor: "transparent", padding: 0 }}
              onClick={() => {
                setBasketOpen(!basketOpen);
                menuOpen && setMenuOpen(false);
              }}
            >
              <img
                src={basketOpen
                  ? "/icons/close-icon.svg"
                  : "/icons/menu-basket.svg"}
                width={20}
                height={20}
                alt="basket-icon"
                className="w-5 h-5"
              />
              <div
                className={`${
                  (!cartSize || basketOpen) ? "hidden" : ""
                } bg-red-700 rounded-full absolute top-0 left-3 w-4 h-4 flex justify-center items-center`}
              >
                <p className="text-white text-[10px]">{cartSize}</p>
              </div>
            </button>
            <button
              onClick={menuSwitch}
              style={{ backgroundColor: "transparent", padding: 0 }}
              type="button"
            >
              <img
                src={menuOpen
                  ? "/icons/close-icon.svg"
                  : "/icons/hamburger.svg"}
                width={20}
                height={20}
                alt="menu-icon"
                className="w-5 h-5"
              />
            </button>
          </section>
        </section>
      </section>
      {(basketOpen || menuOpen) && (
        <span
          className="fixed bg-black w-full h-full opacity-60"
          onClick={() => {
            basketOpen && setBasketOpen(false);
            menuOpen && setMenuOpen(false);
          }}
        />
      )}
      <section className="md:flex md:justify-center">
        <section className="md:ml-[calc(800px-13rem)] md:flex md:justify-end absolute">
          {menuOpen
            ? (
              <section>
                <div className="fixed bg-background-gray z-10 w-full flex flex-col gap-5 rounded-b-lg p-5 md:w-[200px] md:static">
                  {renderMenuItems()}
                </div>
              </section>
            )
            : null}
          {basketOpen
            ? (
              <section>
                <div className="fixed bg-background-gray z-10 w-full flex flex-col gap-5 rounded-b-lg p-5 md:w-[350px] md:static">
                  <h1>Basket</h1>
                  <Cart
                    onCheckout={onCheckout}
                    closeBasket={() => setBasketOpen(false)}
                  />
                </div>
              </section>
            )
            : null}
        </section>
      </section>
    </section>
  );
}

export default Navigation;
