import { useRouter } from "next-router-mock";

function usePathname() {
  const router = useRouter();
  return router.pathname;
}

function useSearchParams() {
  const router = useRouter();
  const search = new URLSearchParams();
  Object.entries(router.query).forEach(([key, value]) => {
    search.append(key, `${value}`);
  });
  return search;
}

export * from "real-next/navigation";
export { usePathname, useRouter, useSearchParams };
