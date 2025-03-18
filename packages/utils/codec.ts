import { Decoder, Encoder } from "cbor-x";

const options = {
  variableMapSize: true,
  useRecords: false,
  mapsAsObjects: false,
  tagUint8Array: false,
} as const;

const encoder = new Encoder(options);
const decoder = new Decoder(options);

export type CodecKey =
  | string
  | number
  | bigint
  | ArrayLike<number>;

export type PrimitiveValues =
  | CodecKey
  | Date
  | null
  | boolean
  | ArrayBufferLike;

export type CodecValue<
  Values = PrimitiveValues,
> =
  | Values
  | Array<CodecValue>
  | Map<CodecKey, CodecValue>;

export type Path = CodecKey[];

export function encode(val: CodecValue) {
  return new Uint8Array(encoder.encode(val));
}

export function decode(data: Uint8Array): CodecValue {
  return decoder.decode(data);
}
