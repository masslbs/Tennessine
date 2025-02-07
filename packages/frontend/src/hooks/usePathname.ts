import { useRouter } from "@tanstack/react-router";

export function usePathname() {
  const router = useRouter();
  const isMerchantPath = ["/create-shop", "/merchant-connect"].includes(
    router?.state?.location?.pathname,
  );
  return { pathname: router?.state?.location?.pathname, isMerchantPath };
}
