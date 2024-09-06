<!--
SPDX-FileCopyrightText: 2024 Mass Labs

SPDX-License-Identifier: Unlicense
-->

# Tennessine

The newest type of [material](https://en.wikipedia.org/wiki/Tennessine) that builds around the [Mass Market](https://mass.market) system.

# In this Repo

This repo is a pnpm workspace and contains three packages.

- [`client`](packages/client) - A network client to interact with a Mass Market Relay.
- [`contracts`](packages/client) - ABI wrappers for our [contracts](https://github.com/masslbs/contracts)
- [`schema`](packages/schema) - Generated encoder/decoders for the protocol buffer [definitions](https://github.com/masslbs/network-schema).
- [`frontend`](packages/frontend) - A Next.js Frontend.

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

Format the code

```bash
pnpm format
```

# Docker Setup

To develop and run the project in a Docker container:

Clone the repository and navigate to the project directory.

Build the Docker image by running:

`docker build -t tennessine .`

To start a Docker container with the built image, run:

`docker run --name mycontainer -p 3000:3000 tennessine`


After successful build and run you could open [http://localhost:3000]() from your browser.