import React from "react";
import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import CreateStore from "@/app/create-store/page";
import { createWalletClient, http } from "viem";
import userEvent from "@testing-library/user-event";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { randomAddress, zeroAddress } from "@massmarket/utils";

import { render, getStateManager } from "./test-utils";

const sm = getStateManager();

const spy = vi.fn(() => {});

beforeEach(async () => {
  //When Store creation is completed successfully, router.push("/products") is called. So we are spying on this mock push fn.
  vi.mock("next/navigation", () => ({
    useRouter() {
      return {
        route: "/",
        push: spy,
      };
    },
    useSearchParams() {
      return {
        get: () => {},
      };
    },
    usePathname() {
      return "/merchants/";
    },
  }));

  vi.mock(import("wagmi"), async (importOriginal) => {
    const mod = await importOriginal(); // type is inferred
    return {
      ...mod,
      useWalletClient() {
        const account = privateKeyToAccount(
          "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
        );
        const wallet = createWalletClient({
          account,
          chain: hardhat,
          transport: http(),
        });
        return {
          data: wallet,
          status: "success",
        };
      },
    };
  });
});

afterEach(async () => {
  vi.restoreAllMocks();
});

describe("Create Store", async () => {
  const user = userEvent.setup();
  beforeEach(async () => {
    render(<CreateStore />, sm);
  });

  test("Create store - with auto-filled payee address", async () => {
    expect(spy).not.toHaveBeenCalled();
    await waitFor(async () => {
      const file = new File(["hello"], "hello.png", { type: "image/png" });

      const nameInput = screen.getByTestId(`storeName`);
      const baseAddrInput = screen.getByTestId("baseTokenAddr");
      const descInput = screen.getByTestId(`desc`);
      const chains = screen.getByRole("button", { name: /hardhat/i });
      const uploadInput = screen.getByTestId("file-upload");
      const saveBtn = screen.getByRole("button", { name: /save/i });

      await user.upload(uploadInput, file);

      await user.click(chains);
      await user.clear(nameInput);
      await user.clear(descInput);
      await user.clear(baseAddrInput);
      await user.type(nameInput, "New Store Name!!");
      await user.type(descInput, "New Store Description!!");
      await user.type(baseAddrInput, zeroAddress);

      await user.click(saveBtn);
    });
    await waitFor(async () => {
      expect(spy).toHaveBeenCalled();
      let count = 0;
      let pId;
      for await (const [id, tag] of sm.tags.iterator()) {
        count++;
        //Creating store thru create-store page should auto generate published and removed tags
        if (tag.name === "visible") {
          pId = id;
        } else {
          expect(tag.name).toEqual("remove");
        }
      }
      expect(count).toEqual(2);
      const manifest = await sm.manifest.get();
      expect(manifest.publishedTagId).toEqual(pId);
      expect(manifest.name).toEqual("New Store Name!!");
      expect(manifest.description).toEqual("New Store Description!!");
    });
  });

  test("create store - with changed payee address and base currency", async () => {
    expect(spy).not.toHaveBeenCalled();
    const payee = randomAddress();
    await waitFor(async () => {
      const file = new File(["hello"], "hello.png", { type: "image/png" });

      const nameInput = screen.getByTestId(`storeName`);
      const descInput = screen.getByTestId(`desc`);
      const chains = screen.getByRole("button", { name: /hardhat/i });
      const uploadInput = screen.getByTestId("file-upload");
      const saveBtn = screen.getByRole("button", { name: /save/i });
      const payeeInput = screen.getByTestId("payeeAddress");
      const baseAddrInput = screen.getByTestId("baseTokenAddr");

      await user.upload(uploadInput, file);
      await user.click(chains);
      await user.clear(nameInput);
      await user.clear(descInput);
      await user.clear(payeeInput);
      await user.clear(baseAddrInput);

      await user.type(nameInput, "New Store Name II");
      await user.type(descInput, "New Store Description II");
      await user.type(payeeInput, payee);
      await user.type(baseAddrInput, zeroAddress);

      await user.click(saveBtn);
    });
    await waitFor(async () => {
      expect(spy).toHaveBeenCalled();
      const manifest = await sm.manifest.get();
      expect(manifest.name).toEqual("New Store Name II");
      expect(manifest.description).toEqual("New Store Description II");
      expect(manifest.payee[0].addr).toEqual(payee);
      expect(manifest.setBaseCurrency?.tokenAddr).toEqual(zeroAddress);
    });
  });
});
