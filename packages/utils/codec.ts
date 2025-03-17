import { Decoder, Encoder } from "cbor-x";

const options = {
  useRecords: false,
  mapsAsObjects: false,
  tagUint8Array: false,
} as const;
const encoder = new Encoder(options);
const decoder = new Decoder(options);

export type CodecValue = unknown;

export function encode(val: CodecValue) {
  return new Uint8Array(encoder.encode(val));
}

export function decode(data: Uint8Array): CodecValue {
  return decoder.decode(data);
}
