<!--
SPDX-FileCopyrightText: 2024 Mass Labs

SPDX-License-Identifier: Unlicense
-->

# Tennessine

The newest type of [material](https://en.wikipedia.org/wiki/Tennessine) that
builds around the [Mass Market](https://mass.market) system.

# Packages

- [`client`](packages/client) - A network client to interact with a Mass Market
  Relay. Encodes and decodes messages to and from the relay.
- [`contracts`](packages/contracts) - ABI wrappers for our
  [contracts](https://github.com/masslbs/contracts)
- [`schema`](packages/schema) - Generated encoder/decoders for the protocol
  buffer [definitions](https://github.com/masslbs/network-schema).
- [`frontend`](packages/frontend) - UI built with React, runs on
  [`deno`](https://deno.com/) and [`vite`](https://vite.dev/).
- [`blockchain`](packages/blockchain) - Wrapper functions for contract calls.
- [`statemanager`](packages/statemanager) - Module for formatting data during
  requesting and receiving events from the relay client.
