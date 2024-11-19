import "./happyDomSetup.ts";
import { assertEquals } from "jsr:@std/assert";
import { render, screen } from "npm:@testing-library/react";
import App from "../src/App.tsx";

Deno.test("check that we can render the app", () => {
  render(<App />);
  const hello = screen.getByTestId("hello");
  assertEquals(hello.textContent, "hello!");
});
