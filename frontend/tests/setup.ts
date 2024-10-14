import { beforeEach } from "vitest";
import { vi } from "vitest";

beforeEach(async () => {
  vi.mock("next/navigation", async (importOriginal) => {
    const actual = await importOriginal<typeof import("next/navigation")>();
    const { useRouter } =
      await vi.importActual<typeof import("next-router-mock")>(
        "next-router-mock",
      );
    const usePathname = vi.fn().mockImplementation(() => {
      const router = useRouter();
      return router.pathname;
    });
    const useSearchParams = vi.fn().mockImplementation(() => {
      const router = useRouter();
      const search = new URLSearchParams();
      Object.entries(router.query).forEach(([key, value]) => {
        search.append(key, `${value}`);
      });
      return search;
    });
    return {
      ...actual,
      useRouter: vi.fn().mockImplementation(useRouter),
      usePathname,
      useSearchParams,
    };
  });
});
