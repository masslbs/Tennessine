import "./happyDomSetup.ts";
import { assertEquals } from "jsr:@std/assert";
import { render, screen } from "npm:@testing-library/react";

Deno.test("check that we can render the app", async () => {
  // we need to import App.tsx here since wagmi and rainbowkit setup timers
  const {
    default: App,
  } = await import("../src/App.tsx");
  render(<App />);
  const hello = screen.getByTestId("hello");
  assertEquals(hello.textContent, "hello!");
});
