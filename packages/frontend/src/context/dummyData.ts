// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Item, Relay, RelayStatus } from "../types";
export const dummyProducts: Item[] = [
  {
    id: "0x1",
    metadata: {
      title: "Dubai Camel Sticker",
      image: "/assets/camel.png",
      description: "N/A",
    },
    price: "1.22",
    quantity: 0,
  },
  {
    id: "0x2",
    metadata: {
      title: "Money Printer Sticker",
      image: "/assets/printer.png",
      description: "N/A",
    },
    price: "4.22",
    quantity: 0,
  },
];

export const dummyRelays: Relay[] = [
  {
    id: "0x3",
    name: "Pufferfish",
    location: "Unknown",
    status: RelayStatus.Available,
    provisioned: false,
  },
  {
    id: "0x1",
    name: "Weird Fishes",
    location: "Unknown",
    status: RelayStatus.Available,
    provisioned: false,
  },
  {
    id: "0x4",
    name: "CatFish",
    location: "San Francisco, California, United States",
    status: RelayStatus.Unavailable,
    provisioned: false,
  },
  {
    id: "0x8",
    name: "DogFish",
    location: "San Francisco, California, United States",
    status: RelayStatus.Available,
    provisioned: true,
  },
  {
    id: "0x9",
    name: "Betafish",
    location: "Unknown",
    status: RelayStatus.Available,
    provisioned: true,
  },
];
