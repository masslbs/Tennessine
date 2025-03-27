import { bytesToHex } from "viem";
import { objectId, randomAddress } from "@massmarket/utils";
import { PayeeMap } from "@massmarket/schema";
import { hardhat } from "viem/chains";
import { fetchAndDecode } from "@massmarket/utils";
// Test variables used in multiple packages.

export const payees = new PayeeMap(
  new Map([
    [
      hardhat.id,
      new Map([
        [
          randomAddress(),
          {
            callAsContract: false,
          },
        ],
      ]),
    ],
  ]),
);

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
  address1: "123 Main St",
  city: "New York",
  postalCode: "10001",
  country: "United States",
  emailAddress: "john@example.com",
  phoneNumber: "+1234567890",
};

type TestVector = Map<
  string,
  Array<Map<string, Map<string, Map<string, Map<string, codec.CodecValue>>>>>
>;

const manifestVector = await fetchAndDecode("ManifestOkay") as TestVector;
export const allManifests = manifestVector.get("Snapshots")?.map((snapshot) => {
  return snapshot!.get("After")!.get("Value")!.get("Manifest");
}) || [];
