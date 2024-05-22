// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { ReactElement, useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
// import { render, screen } from "../test";
import { MyContext, useMyContext } from "@/context/MyContext";
import { MockClient } from "@massmarket/client/test/mockClient";
import { StoreContextProvider, useStoreContext } from "@/context/StoreContext";
import { render, screen } from "@testing-library/react";

// const FauxComponent = () => {
//   const { products } = useStoreContext();
//   const { relayClient } = useMyContext();
//   useEffect(() => {
//     (async () => {
//       relayClient && (await relayClient.connect());
//     })();
//   });
//   console.log({ products });
//   return <div></div>;
// };

describe("My wallet consumes context state correctly", () => {
  const client = new MockClient();

  const Wrapper = () => {
    return (
      <MyContext.Provider value={{ relayClient: client }}>
        <StoreContextProvider />
        {/* <StoreContextProvider>
          <FauxComponent />
        </StoreContextProvider> */}
      </MyContext.Provider>
    );
  };

  it("first test", async () => {
    render(<Wrapper />);

    await client.connect();
    // expect(screen.getByTestId("hi")).toHaveTextContent("Betafish");
  });
});
