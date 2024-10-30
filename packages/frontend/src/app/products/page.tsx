// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import debugLib from "debug";

import { Item, Tag } from "@/types";
import { useUserContext } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import withAuth from "@/app/components/withAuth";
import SuccessMessage from "@/app/common/components/SuccessMessage";
import MerchantViewProducts from "@/app/components/products/MerchantViewProducts";
import CustomerViewProducts from "@/app/components/products/CustomerViewProducts";

const Products = () => {
  const searchParams = useSearchParams();
  const { clientWithStateManager } = useUserContext();
  const success = searchParams?.get("success");
  const { isMerchantView } = useAuth();
  const debug = debugLib("frontend:products");

  const [showSuccessMsg, setMsg] = useState<boolean>(success !== null);
  const [products, setProducts] = useState(new Map());
  const [allTags, setAllTags] = useState(new Map());

  const getAllListings = async () => {
    const listings = new Map();
    for await (const [
      id,
      item,
    ] of clientWithStateManager!.stateManager!.items.iterator()) {
      listings.set(id, item);
    }
    return listings;
  };

  useEffect(() => {
    const onCreateEvent = async () => {
      const l = new Map();
      for await (const [
        id,
        item,
      ] of clientWithStateManager!.stateManager!.items.iterator()) {
        l.set(id, item);
      }
      setProducts(l);
    };
    const onUpdateEvent = async () => {
      const l = new Map();
      for await (const [
        id,
        item,
      ] of clientWithStateManager!.stateManager!.items.iterator()) {
        l.set(id, item);
      }
      setProducts(l);
    };
    const onAddItemId = (item: Item) => {
      products.set(item.id, item);
      setProducts(products);
    };
    const onRemoveItemId = (item: Item) => {
      products.set(item.id, item);
      setProducts(products);
    };
    getAllListings()
      .then((listings) => {
        setProducts(listings);
      })
      .catch((e) => {
        debug(e);
      });

    // Listen to future events
    clientWithStateManager!.stateManager!.items.on("create", onCreateEvent);
    clientWithStateManager!.stateManager!.items.on("update", onUpdateEvent);
    clientWithStateManager!.stateManager!.items.on("addItemId", onAddItemId);
    clientWithStateManager!.stateManager!.items.on(
      "removeItemId",
      onRemoveItemId,
    );

    return () => {
      // Cleanup listeners on unmount
      clientWithStateManager!.stateManager!.items.removeListener(
        "create",
        onCreateEvent,
      );
      clientWithStateManager!.stateManager!.items.removeListener(
        "update",
        onUpdateEvent,
      );
      clientWithStateManager!.stateManager!.items.removeListener(
        "addItemId",
        onAddItemId,
      );
      clientWithStateManager!.stateManager!.items.removeListener(
        "removeItemId",
        onRemoveItemId,
      );
    };
  }, []);

  useEffect(() => {
    const onCreateEvent = (tag: Tag) => {
      allTags.set(tag.id, tag);
      setAllTags(allTags);
    };
    // Listen to future events
    clientWithStateManager!.stateManager!.tags.on("create", onCreateEvent);

    return () => {
      // Cleanup listeners on unmount
      clientWithStateManager!.stateManager!.items.removeListener(
        "create",
        onCreateEvent,
      );
    };
  }, []);

  return (
    <main className="bg-background-gray pt-under-nav h-screen">
      <SuccessMessage show={showSuccessMsg} onClose={() => setMsg(false)} />
      {isMerchantView ? (
        <MerchantViewProducts products={Array.from([...products.values()])} />
      ) : (
        <CustomerViewProducts products={Array.from([...products.values()])} />
      )}
    </main>
  );
};

export default withAuth(Products);
