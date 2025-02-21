import { bytesToHex } from "viem";
import { objectId, randomAddress } from "@massmarket/utils";

// Test variables used in multiple packages.

export const payees = [
  {
    address: randomAddress(),
    callAsContract: false,
    chainId: 1,
    name: "default",
  },
];
export const orderPriceModifiers = [
  {
    title: "EU VAT",
    percentage: bytesToHex(objectId()),
  },
];
export const shippingRegions = [
  {
    name: "test",
    country: "test country",
    postalCode: "test postal",
    city: "test city",
    orderPriceModifiers,
  },
];
export const metadata = {
  title: "Test Item 1",
  description: "Test description 1",
  images: ["https://http.cat/images/201.jpg"],
};
