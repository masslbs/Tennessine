import { bytesToHex } from "viem";
import { objectId, randomAddress } from "@massmarket/utils";

// Test variables used in multiple packages.

export const payees = [
  {
    address: randomAddress(),
    callAsContract: false,
    chainId: 31337,
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

export const metadata2 = {
  title: "Test Item 2",
  description: "Test description 2",
  images: ["https://http.cat/images/201.jpg"],
};

export const shippingDetails = {
  name: "John Doe",
  address: "123 Main St",
  city: "New York",
  zip: "10001",
  country: "United States",
  email: "john@example.com",
  phone: "+1234567890",
};
