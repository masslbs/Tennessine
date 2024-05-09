// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { ReactElement } from "react";
import RelaysView from "../src/app/components/store/RelaysView";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "../test";
import { StoreContext } from "../src/context/StoreContext";
import { IRelay, RelayStatus } from "@/types";

const dummy: IRelay[] = [
  {
    id: "0x9",
    name: "Betafish",
    location: "Unknown",
    status: RelayStatus.Available,
    provisioned: true,
  },
  {
    id: "0x10",
    name: "Pufferfish",
    location: "Unknown",
    status: RelayStatus.Available,
    provisioned: false,
  },
];

describe("Relay components consumes context state properly", () => {
  const customRender = (
    component: ReactElement,
    // @ts-expect-error FIXME
    providerProps,
  ) => {
    return render(
      <StoreContext.Provider value={providerProps}>
        {component}
      </StoreContext.Provider>,
    );
  };
  beforeEach(() => {
    const dummyValues = {
      relays: dummy,
      store: null,
    };

    customRender(<RelaysView close={() => {}} />, dummyValues);
  });
  it("Renders all the relays available", async () => {
    await waitFor(() =>
      expect(screen.getByText("Betafish")).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByText("Pufferfish")).toBeInTheDocument(),
    );
  });
  it("Separates provisioned vs Available relays", async () => {
    await waitFor(() =>
      expect(screen.getByTestId("available")).toHaveTextContent("Betafish"),
    );
    await waitFor(() =>
      expect(screen.getByTestId("provisioned")).toHaveTextContent("Pufferfish"),
    );
  });
});
