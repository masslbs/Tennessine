export declare function requestId(): Uint8Array;
export declare function eventId(): Uint8Array;
export declare function randomBytes(n: number): Uint8Array;
export declare function convertFirstCharToLowerCase(str: string): string;
export declare function snakeToCamel(str: string): string;
export declare function formatMessageForSigning(obj: Record<string, Uint8Array | string | number | Uint8Array[] | number[]>): Record<string, string | `0x${string}`[] | BigInt | BigInt[]>;
export declare function getRandomStoreId(): `0x${string}`;
export declare function generatePk(): `0x${string}`;
export declare function hexToBase64(hex: string): string;
