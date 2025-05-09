export function useShopDomain(): { protocol: string; shopDomain: string } {
  return {
    protocol: globalThis.location.protocol,
    shopDomain: globalThis.location.host,
  };
}
