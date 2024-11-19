import "./happyDomSetup.ts";
// import { assert } from "jsr:@std/assert";
import { render, screen } from "npm:@testing-library/react";
import App from "../src/App.tsx";

Deno.test("check that we can render the app", () => {
  render(<App />);
  screen.getByTestId("test");
});
