// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useDisconnect } from "wagmi";

import { Order, OrderedItem } from "@massmarket/schema";
import { CodecValue } from "@massmarket/utils/codec";

import { KeycardRole } from "../types.ts";
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
    title: "Cart",
    img: "menu-cart.svg",
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
  const [cartVisible, setCartVisible] = useState<boolean>(false);
  const [cartSize, setCartSize] = useState<number>(0);

  const navigate = useNavigate();
  const { shopDetails } = useShopDetails();
  const { stateManager } = useStateManager();
  const { currentOrder } = useCurrentOrder();
  const [keycard] = useKeycard();
  const { disconnect } = useDisconnect();
  const isMerchantView = keycard.role === KeycardRole.MERCHANT;

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
    cartVisible && setCartVisible(false);
  }

  function onCheckout() {
    setCartVisible(false);
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
            className="cursor-pointer"
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
        <section className="relative w-full text-base flex justify-between md:w-[800px] h-[56px] mr-3">
          <div
            id="logo"
            className="flex gap-2 cursor-pointer m-2"
            onClick={() => {
              navigate({
                to: isMerchantView ? "/merchant-dashboard" : "/listings",
                search: (prev: Record<string, string>) => ({
                  shopId: prev.shopId,
                }),
              });
              setMenuOpen(false);
              setCartVisible(false);
            }}
          >
            {shopDetails.profilePictureUrl
              ? (
                <div className="overflow-hidden rounded-full w-10 h-10">
                  <img
                    src={shopDetails.profilePictureUrl}
                    width={40}
                    height={40}
                    alt="profile-avatar"
                    className="w-10 h-10"
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
          <section className="absolute right-0 flex">
            <div
              id="menu"
              className={`${
                cartVisible ? "invisible" : "visible"
              } flex flex-col items-end`}
            >
              <button
                onClick={menuSwitch}
                style={{
                  backgroundColor: menuOpen ? "#F3F3F3" : "transparent",
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
                type="button"
                className="self-end h-[56px] cursor-pointer"
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
              <div
                className={`${menuOpen ? "hidden md:block z-10" : "hidden"}`}
              >
                <div className="fixed bg-background-gray w-full flex flex-col gap-5 rounded-b-lg p-5 w-fit static">
                  {renderMenuItems()}
                </div>
              </div>
            </div>
            <div
              id="cart"
              className={`${
                menuOpen ? "invisible" : "visible"
              } flex flex-col items-end relative`}
            >
              <button
                type="button"
                data-testid="cart-toggle"
                className={`${
                  isMerchantView ? "hidden" : ""
                } self-end h-[56px]`}
                style={{
                  backgroundColor: cartVisible ? "#F3F3F3" : "transparent",
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
                onClick={() => {
                  setCartVisible(!cartVisible);
                  menuOpen && setMenuOpen(false);
                }}
              >
                <img
                  src={cartVisible
                    ? "/icons/close-icon.svg"
                    : "/icons/menu-cart.svg"}
                  width={20}
                  height={20}
                  alt="cart-icon"
                  className="w-5 h-5"
                />
                <div
                  className={`${
                    (!cartSize || cartVisible) ? "hidden" : ""
                  } bg-red-700 rounded-full absolute top-[10px] right-[7px] w-4 h-4 flex justify-center items-center`}
                >
                  <p className="text-white text-[10px]">{cartSize}</p>
                </div>
              </button>
              <div
                className={`${cartVisible ? "hidden md:block z-10" : "hidden"}`}
              >
                <div
                  data-testid="desktop-cart"
                  className="fixed bg-background-gray w-full flex flex-col gap-5 rounded-b-lg p-5 static"
                >
                  <h1>Cart</h1>
                  <Cart
                    onCheckout={onCheckout}
                    closeCart={() => setCartVisible(false)}
                  />
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
      {(cartVisible || menuOpen) && (
        <span
          className="fixed bg-black w-full h-full opacity-60 z-5"
          onClick={() => {
            cartVisible && setCartVisible(false);
            menuOpen && setMenuOpen(false);
          }}
        />
      )}
      <section id="mobile-menu" className="md:hidden absolute z-10">
        {menuOpen
          ? (
            <section>
              <div className="fixed bg-background-gray w-full flex flex-col gap-5 rounded-b-lg p-5">
                {renderMenuItems()}
              </div>
            </section>
          )
          : null}
        {cartVisible
          ? (
            <section>
              <div className="fixed bg-background-gray w-full flex flex-col gap-5 rounded-b-lg p-5">
                <h1>Cart</h1>
                <Cart
                  onCheckout={onCheckout}
                  closeCart={() => setCartVisible(false)}
                />
              </div>
            </section>
          )
          : null}
      </section>
    </section>
  );
}

export default Navigation;
