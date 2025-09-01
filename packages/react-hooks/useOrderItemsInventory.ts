import { useEffect, useState } from "react";
import { getLogger } from "@logtape/logtape";

import type { CodecValue } from "@massmarket/utils/codec";

import { useStateManager } from "./useStateManager.ts";
import { useActiveOrder } from "./useActiveOrder.ts";

const baseLogger = getLogger([
  "mass-market",
  "frontend",
  "useOrderItemsInventory",
]);

/**
 * This hook is used to get the inventory for all the items in current/active order.
 * It listens to inventory updates for those items.
 */
export default function useOrderItemsInventory() {
  const { stateManager } = useStateManager();
  const { activeOrder } = useActiveOrder();
  const [inventoryMap, setInventoryMap] = useState<Map<number, number>>(
    new Map(),
  );
  const listingIds = activeOrder?.Items.map((item) => item.ListingID);
  const logger = baseLogger.with({
    orderId: activeOrder?.ID,
  });

  useEffect(() => {
    if (!listingIds || !stateManager) return;
    const updateInventoryMap = new Map();
    activeOrder?.Items.forEach((item) => {
      stateManager.get(["Inventory", item.ListingID]).then((stockNo) => {
        updateInventoryMap.set(item.ListingID, stockNo);
      });
    });
    setInventoryMap(updateInventoryMap);

    // Setting up event listeners for inventory updates.
    // Create a map to store event handlers for each key.
    const eventHandlers = new Map();

    listingIds.forEach((key: number) => {
      const onInventoryUpdate = (stockNo: CodecValue | undefined) => {
        if (typeof stockNo !== "number") {
          logger.error("Inventory is not a number");
        }
        setInventoryMap((prev) => {
          const updatedInventoryMap = new Map(prev);
          updatedInventoryMap.set(key, stockNo as number);
          return updatedInventoryMap;
        });
      };

      // Store the handler reference so we can remove it after
      eventHandlers.set(key, onInventoryUpdate);

      stateManager.events.on(onInventoryUpdate, ["Inventory", key]);
    });
    return () => {
      listingIds.forEach((key) => {
        const handler = eventHandlers.get(key);
        if (!handler) {
          logger.error(`Handler for ${key} not found`);
          return;
        }
        stateManager.events.off(handler, ["Inventory", key]);
      });
    };
  }, [listingIds, stateManager]);

  return { inventoryMap };
}
