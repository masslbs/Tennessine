// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import NavigationMenu from "../src/app/components/nav/NavigationMenu";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "../test";

describe("Navigation Menu", () => {
  beforeEach(() => {
    render(<NavigationMenu isOpen={true} onClose={() => {}} />);
  });
  it("Renders all 6 menu options", async () => {
    vi.mock("next/navigation", () => ({
      useRouter() {
        return {
          route: "/",
          push: () => {},
        };
      },
    }));
    expect(screen.getByTestId("menu-button-products")).toBeInTheDocument();
    expect(screen.getByTestId("menu-button-transactions")).toBeInTheDocument();
    expect(screen.getByTestId("menu-button-earnings")).toBeInTheDocument();
    expect(
      screen.getByTestId("menu-button-store settings"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("menu-button-profile")).toBeInTheDocument();
  });
});
