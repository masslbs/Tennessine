// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT
// @ts-types="./compiled.d.ts"
import pb from "./compiled.js";
import schema = pb.market.mass;
import google = pb.google;

export default schema;
export type { google };

import testVectors from "./testVectors.json" with { type: "json" };
export { testVectors };

// a few concrete fields we need to handle in the client.
// these are not generated from the proto files.
export const EnvelopMessageTypes = {
  PingRequest: "pingRequest",
  SubscriptionPushRequest: "subscriptionPushRequest",
};
