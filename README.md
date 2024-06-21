<!--
SPDX-FileCopyrightText: 2024 Mass Labs

SPDX-License-Identifier: Unlicense
-->

# Tennessine

The newest type of [material](https://en.wikipedia.org/wiki/Tennessine) that builds around the [Mass Market](https://mass.market) system.

# In this Repo

This repo is a pnpm workspace and contains three packages.

- [`client`]('./tree/main/packages/client') - A network client to interact with a Mass Market Relay.
- [`contracts`]('./tree/main/packages/client') - ABI wrappers for our [contracts](https://github.com/masslbs/contracts)
- [`schema`]('./tree/main/packages/schema') - Generated encoder/decoders for the protocol buffer [definitions](https://github.com/masslbs/network-schema).
- [`frontend`]('./tree/main/packages/frontend') - A Next.js Frontend.

# Developing

Enter the development environment

```bash
nix develop
```

Install TS dependencies

```bash
pnpm install
```

Build the packages

```bash
pnpm build
```

Fomat the code

```bash
pnpm format
```
