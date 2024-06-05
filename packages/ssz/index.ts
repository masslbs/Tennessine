import {
  ContainerType,
  ByteVectorType,
  UintBigintType,
  ByteListType,
  ListCompositeType,
} from "@chainsafe/ssz";

// Creates a "Keypair" SSZ data type (a private key of 32 bytes, a public key of 48 bytes)
const Listing = new ContainerType({
  id: new UintBigintType(8), // 8 bytes, 64 bits
  storeId: new UintBigintType(32),
  price: new UintBigintType(32),
  currency: new UintBigintType(32),
  name: new ByteListType(32),
  description: new ByteListType(256),
  image: new ByteListType(256),
});

const l1 = Listing.defaultValue();
const l2 = Listing.defaultValue();

const State = new ListCompositeType(Listing, 2 ** 32);
const s = State.defaultValue();

s.push(l1);
s.push(l2);

const t = State.toView(s);
// console.log(t[0]);

// class ssz {
//   constructor() {
//     encode();
//     decode();
//   }
// }
//
// store = new Storage(db, State);
// name = await store.listings[0].name.get();
//
// store.setRoot(root);
// store.data.listings[0].name;
// store.data.listings[0].name;
// store.data.listings[0].name;
//
// store.data.listings[0].name.set("new name");
// store.data.listings[1].name.set("new name");
// store.data.listings[2].name.set("new name");
// store.data.listings[3].name.set("new name");
// multiproof = store.multiProof([store.listings[4].name, store.listings[5].name]);
// store.verifyMultiproof(multiproof);
// store.verifyProof(proof);
//
// await store.root();
//
//
// how to checkpoint
// checkpoints = []
// items = [[vesion, items]]
// check if the version in the the checkpoint list; if not, add it
