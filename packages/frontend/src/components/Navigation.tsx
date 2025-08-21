// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useDisconnect } from "wagmi";

import { Order, OrderedItem } from "@massmarket/schema";
import { CodecValue } from "@massmarket/utils/codec";
import {
  useActiveOrder,
  useKeycard,
  useShopDetails,
  useStateManager,
} from "@massmarket/react-hooks";

import Cart from "./cart/Cart.tsx";
import ChevronRight from "./common/ChevronRight.tsx";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const merchantMenu = [
  {
    title: "Dashboard",
    img: "menu-dashboard.svg",
    href: "/merchant-dashboard",
  },
  {
    title: "Manage Products",
    img: "menu-products.svg",
    href: "/merchants/listings",
  },
  { title: "Manage Orders", img: "menu-order.svg", href: "/merchants/orders" },
  {
    title: "Shop Settings",
    img: "menu-settings.svg",
    href: "/merchants/shop-settings",
  },
  {
    title: "Share",
    img: "menu-share.svg",
    href: `/share`,
  },
  { title: "Disconnect", img: "menu-disconnect.svg" },
  { title: "Switch shop", img: "switch-icon.svg", href: "/my-shops" },
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

const massMarketMenu = [
  { title: "Support", img: "menu-settings.svg", href: `/support` },
];

function Navigation() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [cartVisible, setCartVisible] = useState<boolean>(false);
  const [cartSize, setCartSize] = useState<number>(0);

  const navigate = useNavigate();
  const { shopDetails } = useShopDetails();
  const { stateManager } = useStateManager();
  const { activeOrder } = useActiveOrder();
  const { keycard } = useKeycard();
  const { disconnect } = useDisconnect();
  const isMerchantView = keycard?.role === "merchant";

  useEffect(() => {
    // in the hook `useCurrentOrder`, we "reset" currentOrder for the states OrderState.Canceled and OrderState.Paid.
    // this is done by setting it to null.
    // TODO (@alp 2025-04-17): raise the question of using a sentinel value for "reset" orderIDs e.g. currentOrder = SENTINEL_ORDER
    //
    // NOTE(@alp 2025-04-17): this same bug (setting currentOrder = null) *might* be afflicting ListingDetail.tsx and
    // the call to cancelAndRecreateOrder
    if (!activeOrder) {
      setCartSize(0);
      return;
    }
    stateManager?.get(["Orders", activeOrder.ID])
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
  }, [activeOrder]);

  function onDisconnect() {
    setMenuOpen(false);
    disconnect();
    globalThis.localStorage.removeItem("burnerWallet-pk");
    navigate({
      to: "/",
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
    const menuItems = !keycard
      ? massMarketMenu
      : isMerchantView
      ? merchantMenu
      : customerMenu;
    return menuItems.map((opt, i) => {
      const content = (
        <Link
          to={opt.href!}
          key={opt.title}
          search={(prev: Record<string, string>) => ({
            shopId: prev.shopId,
          })}
        >
          <div className="flex gap-3 items-center px-6 py-[10px]">
            <img
              src={`/icons/${opt.img}`}
              width={20}
              height={20}
              alt="menu-item"
              className="w-5 h-5"
            />
            <p className="text-xl text-black whitespace-nowrap">{opt.title}</p>
            <div className="ml-auto w-3 h-3">
              <ChevronRight />
            </div>
          </div>
        </Link>
      );
      if (opt.title === "Disconnect") {
        return (
          <button
            type="button"
            style={{
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FFF"}
            onMouseLeave={(e) =>
              e.currentTarget.style.backgroundColor = "transparent"}
            key={i}
            onClick={onDisconnect}
          >
            {content}
          </button>
        );
      }

      return (
        <div
          data-testid={`menu-button-${opt.title}`}
          key={i}
          onClick={() => setMenuOpen(false)}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FFF"}
          onMouseLeave={(e) =>
            e.currentTarget.style.backgroundColor = "transparent"}
        >
          {content}
        </div>
      );
    });
  }

  return (
    <section>
      {(cartVisible || menuOpen) && (
        <span
          className="fixed bg-black w-full h-full opacity-60 z-5"
          onClick={() => {
            cartVisible && setCartVisible(false);
            menuOpen && setMenuOpen(false);
          }}
        />
      )}
      <section
        className={`bg-white flex justify-center z-10 fixed top-0 left-0 right-0`}
        data-testid="navigation"
      >
        <section className="relative w-full text-base flex justify-between md:w-[1000px] h-[56px] md:mr-3">
          <div
            id="logo"
            className="flex gap-2 cursor-pointer m-2 ml-5 md:ml-0"
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
            {shopDetails?.profilePictureUrl
              ? (
                <div className="overflow-hidden rounded-full w-10 h-10">
                  <img
                    src={shopDetails?.profilePictureUrl}
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

            <h2 className="flex items-center">{shopDetails?.name}</h2>
          </div>
          <div className="hidden md:flex mr-25 h-[56px] items-center">
            <ConnectButton chainStatus="name" />
          </div>
          <section className="absolute right-0 flex">
            <div
              id="cart"
              className={`${
                menuOpen ? "hidden md:block" : "visible"
              } flex flex-col items-end`}
            >
              <button
                type="button"
                data-testid="cart-toggle"
                className={`${
                  isMerchantView || !keycard ? "hidden" : ""
                } self-end h-[56px] ${cartVisible ? "mr-[50px] md:mr-0" : ""}`}
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
                  } bg-red-700 rounded-full absolute top-[12px] left-[27px] w-[14px] h-[14px] flex justify-center items-center`}
                >
                  <p className="text-white text-[10px]">{cartSize}</p>
                </div>
              </button>
              <div
                className={`${
                  cartVisible ? "z-10 w-screen md:w-fit" : "hidden"
                }`}
              >
                <div
                  data-testid="cart"
                  className="fixed bg-background-gray w-full flex flex-col gap-5 rounded-b-lg p-5 pt-2 static"
                >
                  <h1>Cart</h1>
                  <Cart
                    onCheckout={onCheckout}
                    closeCart={() => setCartVisible(false)}
                  />
                </div>
              </div>
            </div>

            <div
              id="menu"
              className={`${
                cartVisible ? "hidden md:block" : "visible"
              } w-[50px] flex flex-col items-end`}
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
                className={`${menuOpen ? "z-10 md:min-w-70" : "hidden"}`}
              >
                <div
                  id="menu-items-container"
                  className="bg-background-gray w-screen flex flex-col rounded-b-lg pt-4 md:pb-4 absolute right-0 md:w-full md:static"
                >
                  {renderMenuItems()}
                  <div className="md:hidden flex flex-col gap-3 mt-4 px-6 py-4 bg-white rounded-b-lg">
                    <h3>Your Wallet</h3>
                    <ConnectButton chainStatus="name" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
    </section>
  );
}

export default Navigation;
