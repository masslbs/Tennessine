"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ssz_1 = require("@chainsafe/ssz");
// Creates a "Keypair" SSZ data type (a private key of 32 bytes, a public key of 48 bytes)
var Listing = new ssz_1.ContainerType({
    id: new ssz_1.UintBigintType(8), // 8 bytes, 64 bits
    storeId: new ssz_1.UintBigintType(32),
    price: new ssz_1.UintBigintType(32),
    currency: new ssz_1.UintBigintType(32),
    name: new ssz_1.ByteListType(32),
    description: new ssz_1.ByteListType(256),
    image: new ssz_1.ByteListType(256),
});
var State = new ssz_1.ListCompositeType({
    elementType: Listing,
    limit: Math.pow(2, 32),
});
console.log(State);
